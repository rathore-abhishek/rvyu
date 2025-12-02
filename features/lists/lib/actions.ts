"use server";

import { revalidatePath } from "next/cache";

import { and, count, desc, eq, ilike, or } from "drizzle-orm";

import { getUser } from "@/actions/user";

import db from "@/db";
import {
  list,
  listProject,
  project,
  review,
  savedProject,
  techStack,
} from "@/db/schema";
import { validateOrThrow } from "@/validation";

import { List } from "./types";
import { listSchema } from "./validation";

export async function createList({ name, description, playlistLink }: List) {
  validateOrThrow(listSchema, {
    name,
    description,
    playlistLink,
  });

  const user = await getUser();
  if (!user) {
    throw new Error("You must be logged in to create a list");
  }

  const [newList] = await db
    .insert(list)
    .values({
      name,
      description: description || null,
      playlistLink: playlistLink || null,
      userId: user.id,
    })
    .returning();

  if (!newList) {
    throw new Error("Failed to create list");
  }

  revalidatePath("/dashboard");

  return newList;
}

export async function getUserLists() {
  const user = await getUser();
  if (!user) {
    throw new Error("You must be logged in to get lists");
  }

  const lists = await db.query.list.findMany({
    where: eq(list.userId, user.id),
    orderBy: desc(list.createdAt),
  });

  if (!lists) {
    throw new Error("Failed to get lists");
  }

  return lists;
}

export async function editList({
  id,
  name,
  description,
  playlistLink,
}: List & { id: string }) {
  validateOrThrow(listSchema, {
    name,
    description,
    playlistLink,
  });

  const user = await getUser();
  if (!user) {
    throw new Error("You must be logged in to edit a list");
  }

  const [updatedList] = await db
    .update(list)
    .set({
      name,
      description: description || null,
      playlistLink: playlistLink || null,
    })
    .where(eq(list.id, id))
    .returning();

  if (!updatedList) {
    throw new Error("Failed to edit list");
  }

  revalidatePath(`/lists/${id}`);

  return updatedList;
}

export async function deleteList({ id }: { id: string }) {
  const user = await getUser();
  if (!user) {
    throw new Error("You must be logged in to delete a list");
  }

  const [deletedList] = await db
    .delete(list)
    .where(eq(list.id, id))
    .returning();

  if (!deletedList) {
    throw new Error("Failed to delete list");
  }

  return deletedList;
}

export async function getListDetails(listId: string) {
  const listData = await db.query.list.findFirst({
    where: eq(list.id, listId),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!listData) {
    throw new Error("List not found");
  }

  return {
    ...listData,
  };
}

export async function submitProjectToList({
  listId,
  projectId,
}: {
  listId: string;
  projectId: string;
}) {
  // Check if project already exists in this list
  const existingSubmission = await db.query.listProject.findFirst({
    where: and(
      eq(listProject.listId, listId),
      eq(listProject.projectId, projectId),
    ),
  });

  if (existingSubmission) {
    throw new Error("Project already submitted to this list");
  }

  // Add project to list
  await db.insert(listProject).values({
    listId,
    projectId,
  });

  revalidatePath(`/lists/${listId}`);

  return {
    success: true,
  };
}

// Toggle save (bookmark) on a project
export async function toggleProjectSave({ projectId }: { projectId: string }) {
  const user = await getUser();
  if (!user) {
    throw new Error("You must be logged in to save projects");
  }

  // Check if user already saved this project
  const existingSave = await db.query.savedProject.findFirst({
    where: and(
      eq(savedProject.userId, user.id),
      eq(savedProject.projectId, projectId),
    ),
  });

  if (existingSave) {
    // Unsave - remove the bookmark
    await db.delete(savedProject).where(eq(savedProject.id, existingSave.id));
    return { saved: false };
  } else {
    // Save - create a bookmark
    await db.insert(savedProject).values({
      userId: user.id,
      projectId,
    });
    return { saved: true };
  }
}

// Get list projects with pagination, search, and sorting
export async function getListProjects({
  listId,
  search,
  page = 1,
  limit = 12,
  sortBy = "date",
  sortDirection = "desc",
  filter = "reviewed",
}: {
  listId: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "date" | "rating";
  sortDirection?: "asc" | "desc";
  filter?: "reviewed" | "pending";
}) {
  const user = await getUser();

  // Build where conditions
  const conditions = [eq(listProject.listId, listId)];

  // Add search condition if provided
  if (search) {
    conditions.push(
      or(
        ilike(project.name, `%${search}%`),
        ilike(project.description, `%${search}%`),
      )!,
    );
  }

  const whereCondition = and(...conditions);

  // Fetch all projects to properly filter and count
  const listProjectsData = await db
    .select({
      listProject: listProject,
      project: project,
    })
    .from(listProject)
    .innerJoin(project, eq(listProject.projectId, project.id))
    .where(whereCondition)
    .orderBy(desc(listProject.createdAt));

  // Fetch related data for each project
  const projectsWithRelations = await Promise.all(
    listProjectsData.map(async ({ listProject: lp, project: proj }) => {
      // Fetch tech stack
      const techStackData = await db.query.techStack.findMany({
        where: eq(techStack.projectId, proj.id),
        columns: {
          id: true,
          label: true,
          image: true,
        },
      });

      // Fetch reviews
      const reviewsData = await db.query.review.findMany({
        where: eq(review.projectId, proj.id),
      });

      return {
        ...lp,
        project: {
          ...proj,
          techStack: techStackData,
          reviews: reviewsData,
        },
      };
    }),
  );

  // Filter based on review status and user authentication
  let filteredProjects = projectsWithRelations;

  // If user is not authenticated, only show reviewed projects
  if (!user) {
    filteredProjects = filteredProjects.filter(
      (lp) => lp.project.reviews && lp.project.reviews.length > 0,
    );
  } else {
    // If user is authenticated and owner, filter by reviewed/pending status
    if (filter === "reviewed") {
      filteredProjects = filteredProjects.filter(
        (lp) => lp.project.reviews && lp.project.reviews.length > 0,
      );
    } else if (filter === "pending") {
      filteredProjects = filteredProjects.filter(
        (lp) => !lp.project.reviews || lp.project.reviews.length === 0,
      );
    }
  }

  // Check user's save status and calculate overall rating
  const projectsWithMeta = await Promise.all(
    filteredProjects.map(async (lp) => {
      // Check if user saved this project
      let userSaved = false;
      if (user) {
        const saved = await db.query.savedProject.findFirst({
          where: and(
            eq(savedProject.userId, user.id),
            eq(savedProject.projectId, lp.project.id),
          ),
        });
        userSaved = !!saved;
      }

      // Count saved by users
      const [savedByResult] = await db
        .select({ count: count() })
        .from(savedProject)
        .where(eq(savedProject.projectId, lp.project.id));

      // Calculate overall rating
      let overallRating = null;
      if (lp.project.reviews && lp.project.reviews.length > 0) {
        const firstReview = lp.project.reviews[0];
        overallRating =
          (firstReview.design +
            firstReview.userExperience +
            firstReview.creativity +
            firstReview.functionality +
            firstReview.hireability) /
          5;
      }

      return {
        ...lp,
        userSaved,
        overallRating,
        project: {
          ...lp.project,
          review: lp.project.reviews[0] || null,
          _count: {
            savedBy: savedByResult?.count || 0,
          },
        },
      };
    }),
  );

  // Sort based on sortBy and sortDirection
  const sortedProjects = projectsWithMeta.sort((a, b) => {
    let comparison = 0;

    if (sortBy === "rating") {
      // Sort by overall rating
      const ratingA = a.overallRating ?? -1;
      const ratingB = b.overallRating ?? -1;
      comparison = ratingA - ratingB;
    } else {
      // Sort by date (review date if exists, otherwise listProject createdAt)
      const dateA = a.project.review?.createdAt
        ? new Date(a.project.review.createdAt).getTime()
        : new Date(a.createdAt).getTime();
      const dateB = b.project.review?.createdAt
        ? new Date(b.project.review.createdAt).getTime()
        : new Date(b.createdAt).getTime();
      comparison = dateA - dateB;
    }

    // Apply sort direction
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Calculate pagination
  const totalCount = sortedProjects.length;
  const totalPages = Math.ceil(totalCount / limit);
  const offset = (page - 1) * limit;
  const paginatedProjects = sortedProjects.slice(offset, offset + limit);

  return {
    projects: paginatedProjects,
    totalCount,
    totalPages,
    currentPage: page,
  };
}

// Get single project details for modal
export async function getProjectDetails(
  projectId: string,
  reviewOwnerId?: string,
) {
  const user = await getUser();

  const projectData = await db.query.project.findFirst({
    where: eq(project.id, projectId),
    with: {
      techStack: {
        columns: {
          id: true,
          label: true,
          image: true,
        },
      },
    },
  });

  if (!projectData) {
    throw new Error("Project not found");
  }

  // Fetch review if ownerId is provided
  let projectReview = null;
  if (reviewOwnerId) {
    projectReview = await db.query.review.findFirst({
      where: and(
        eq(review.projectId, projectId),
        eq(review.userId, reviewOwnerId),
      ),
    });
  }

  // Check if user saved this project
  let userSaved = false;
  if (user) {
    const saved = await db.query.savedProject.findFirst({
      where: and(
        eq(savedProject.userId, user.id),
        eq(savedProject.projectId, projectData.id),
      ),
    });
    userSaved = !!saved;
  }

  // Count saved by users
  const [savedByResult] = await db
    .select({ count: count() })
    .from(savedProject)
    .where(eq(savedProject.projectId, projectData.id));

  return {
    ...projectData,
    review: projectReview,
    userSaved,
    _count: {
      savedBy: savedByResult?.count || 0,
    },
  };
}

export async function getRandomListProject(listId: string) {
  const user = await getUser();

  // Get total count first to know if list is empty
  const [countResult] = await db
    .select({ count: count() })
    .from(listProject)
    .where(eq(listProject.listId, listId));

  if (!countResult || countResult.count === 0) {
    return null;
  }

  // Generate a random offset
  const randomOffset = Math.floor(Math.random() * countResult.count);

  // Fetch a random project using random offset (more efficient than ORDER BY RANDOM())
  const [randomProjectData] = await db
    .select({
      listProject: listProject,
      project: project,
    })
    .from(listProject)
    .innerJoin(project, eq(listProject.projectId, project.id))
    .where(eq(listProject.listId, listId))
    .limit(1)
    .offset(randomOffset);

  if (!randomProjectData) {
    return null;
  }

  // Fetch tech stack for the project
  const techStackData = await db.query.techStack.findMany({
    where: eq(techStack.projectId, randomProjectData.project.id),
    columns: {
      id: true,
      label: true,
      image: true,
    },
  });

  // Check if user saved this project
  let userSaved = false;
  if (user) {
    const saved = await db.query.savedProject.findFirst({
      where: and(
        eq(savedProject.userId, user.id),
        eq(savedProject.projectId, randomProjectData.project.id),
      ),
    });
    userSaved = !!saved;
  }

  return {
    ...randomProjectData.listProject,
    project: {
      ...randomProjectData.project,
      techStack: techStackData,
    },
    userSaved,
  };
}
