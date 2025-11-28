"use server";

import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

import { getUser } from "@/actions/user";

// Toggle like (vote) on a project within a list
export async function toggleProjectLike({
  listProjectId,
}: {
  listProjectId: string;
}) {
  const user = await getUser();
  if (!user) {
    throw new Error("You must be logged in to like projects");
  }

  // Check if user already liked this project
  const existingVote = await prisma.listProjectVote.findUnique({
    where: {
      userId_listProjectId: {
        userId: user.id,
        listProjectId,
      },
    },
  });

  if (existingVote) {
    // Unlike - remove the vote
    await prisma.listProjectVote.delete({
      where: {
        id: existingVote.id,
      },
    });
    return { liked: false };
  } else {
    // Like - create a vote with value 1
    await prisma.listProjectVote.create({
      data: {
        userId: user.id,
        listProjectId,
        value: 1,
      },
    });
    return { liked: true };
  }
}

// Toggle save (bookmark) on a project
export async function toggleProjectSave({
  projectId,
}: {
  projectId: string;
}) {
  const user = await getUser();
  if (!user) {
    throw new Error("You must be logged in to save projects");
  }

  // Check if user already saved this project
  const existingSave = await prisma.savedProject.findUnique({
    where: {
      userId_projectId: {
        userId: user.id,
        projectId,
      },
    },
  });

  if (existingSave) {
    // Unsave - remove the bookmark
    await prisma.savedProject.delete({
      where: {
        id: existingSave.id,
      },
    });
    return { saved: false };
  } else {
    // Save - create a bookmark
    await prisma.savedProject.create({
      data: {
        userId: user.id,
        projectId,
      },
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
  sortBy = "recent",
}: {
  listId: string;
  search?: string;
  cursor?: string;
  limit?: number;
  sortBy?: "recent" | "likes";
}) {
  const user = await getUser();

  // Build where clause for search
  const where: Prisma.ListProjectWhereInput = {
    listId,
    ...(search && {
      project: {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      },
    }),
  };

  // Determine ordering
  let orderBy: Prisma.ListProjectOrderByWithRelationInput;
  if (sortBy === "likes") {
    // We'll sort by vote count in application code since Prisma doesn't support orderBy count directly
    orderBy = { createdAt: "desc" };
  } else {
    orderBy = { createdAt: "desc" };
  }

  const listProjects = await prisma.listProject.findMany({
    where,
    include: {
      project: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          techStack: {
            select: {
              id: true,
              label: true,
              image: true,
            },
          },
          _count: {
            select: {
              savedBy: true,
            },
          },
        },
      },
      votes: {
        select: {
          userId: true,
          value: true,
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy,
    take: limit + 1,
    ...(cursor && {
      skip: 1,
      cursor: {
        id: cursor,
      },
    }),
  });

  // Calculate vote counts and check user's vote/save status
  const projectsWithMeta = await Promise.all(
    listProjects.map(async (lp) => {
      const voteCount = lp.votes.filter((v) => v.value === 1).length;
      const userVoted = user
        ? lp.votes.some((v) => v.userId === user.id && v.value === 1)
        : false;

      // Check if user saved this project
      let userSaved = false;
      if (user) {
        const saved = await prisma.savedProject.findUnique({
          where: {
            userId_projectId: {
              userId: user.id,
              projectId: lp.project.id,
            },
          },
        });
        userSaved = !!saved;
      }

      return {
        ...lp,
        voteCount,
        userVoted,
        userSaved,
      };
    }),
  );

  // Sort by likes if requested
  let sortedProjects = projectsWithMeta;
  if (sortBy === "likes") {
    sortedProjects = projectsWithMeta.sort(
      (a, b) => b.voteCount - a.voteCount,
    );
  }

  const hasMore = sortedProjects.length > limit;
  const data = hasMore ? sortedProjects.slice(0, limit) : sortedProjects;
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

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          github: true,
          twitter: true,
          linkedin: true,
          portfolio: true,
        },
      },
      techStack: {
        select: {
          id: true,
          label: true,
          image: true,
        },
      },
      _count: {
        select: {
          savedBy: true,
        },
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // Check if user saved this project
  let userSaved = false;
  if (user) {
    const saved = await prisma.savedProject.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: project.id,
        },
      },
    });
    userSaved = !!saved;
  }

  return {
    ...project,
    userSaved,
  };
}
