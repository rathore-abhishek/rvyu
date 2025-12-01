"use server";

import { revalidatePath } from "next/cache";

import { and, count, desc, eq, exists, ilike, or, sql } from "drizzle-orm";

import { getUser } from "@/actions/user";

import db from "@/db";
import { list, listProject, project, savedProject } from "@/db/schema";
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
    order: 0,
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
  cursor,
  limit = 12,
}: {
  listId: string;
  search?: string;
  cursor?: string;
  limit?: number;
  sortBy?: "recent";
}) {
  const user = await getUser();

  // Build where conditions
  const conditions = [eq(listProject.listId, listId)];

  if (search) {
    conditions.push(
      exists(
        db
          .select({ id: project.id })
          .from(project)
          .where(
            and(
              eq(project.id, listProject.projectId),
              or(
                ilike(project.name, `%${search}%`),
                ilike(project.description, `%${search}%`),
              ),
            ),
          ),
      ),
    );
  }

  const whereCondition = and(...conditions);

  // Fetch list projects with relations
  const listProjects = await db.query.listProject.findMany({
    where: whereCondition,
    with: {
      project: {
        with: {
          techStack: {
            columns: {
              id: true,
              label: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: desc(listProject.createdAt),
    limit: limit + 1,
    offset: cursor ? 1 : 0,
  });

  // Check user's save status
  const projectsWithMeta = await Promise.all(
    listProjects.map(async (lp) => {
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

      return {
        ...lp,
        userSaved,
        project: {
          ...lp.project,
          _count: {
            savedBy: savedByResult?.count || 0,
          },
        },
      };
    }),
  );

  const hasMore = projectsWithMeta.length > limit;
  const data = hasMore ? projectsWithMeta.slice(0, limit) : projectsWithMeta;
  const nextCursor = hasMore ? data[data.length - 1]?.id : null;

  return {
    projects: data,
    nextCursor,
    hasMore,
  };
}

// Get single project details for modal
export async function getProjectDetails(projectId: string) {
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

  // Fetch a random project
  // Note: ORDER BY RANDOM() can be slow on large tables, but for list projects it should be fine
  const randomProject = await db.query.listProject.findFirst({
    where: eq(listProject.listId, listId),
    with: {
      project: {
        with: {
          techStack: {
            columns: {
              id: true,
              label: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: sql`RANDOM()`,
  });

  if (!randomProject) {
    return null;
  }

  // Check if user saved this project
  let userSaved = false;
  if (user) {
    const saved = await db.query.savedProject.findFirst({
      where: and(
        eq(savedProject.userId, user.id),
        eq(savedProject.projectId, randomProject.project.id),
      ),
    });
    userSaved = !!saved;
  }

  return {
    ...randomProject,
    userSaved,
  };
}
