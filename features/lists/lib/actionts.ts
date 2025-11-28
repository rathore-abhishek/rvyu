"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { getUser } from "@/actions/user";

import { validateOrThrow } from "@/validation";

import { NewList } from "./types";
import { newListSchema } from "./validation";

export async function createList({ name, description, visibility }: NewList) {
  validateOrThrow(newListSchema, { name, description, visibility });

  const user = await getUser();
  if (!user) {
    throw new Error("You must be logged in to create a list");
  }

  const list = await prisma.list.create({
    data: {
      name,
      description,
      visibility: visibility || "UNLISTED",
      userId: user.id,
    },
  });

  if (!list) {
    throw new Error("Failed to create list");
  }

  revalidatePath("/dashboard");

  return list;
}

export async function getUserLists() {
  const user = await getUser();
  if (!user) {
    throw new Error("You must be logged in to get lists");
  }

  const lists = await prisma.list.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
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
  visibility,
}: NewList & { id: string }) {
  validateOrThrow(newListSchema, { name, description, visibility });

  const user = await getUser();
  if (!user) {
    throw new Error("You must be logged in to edit a list");
  }

  const list = await prisma.list.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      visibility,
    },
  });

  if (!list) {
    throw new Error("Failed to edit list");
  }

  return list;
}

export async function deleteList({ id }: { id: string }) {
  const user = await getUser();
  if (!user) {
    throw new Error("You must be logged in to delete a list");
  }

  const list = await prisma.list.delete({
    where: {
      id,
    },
  });

  if (!list) {
    throw new Error("Failed to delete list");
  }

  return list;
}

export async function getListDetails(listId: string) {
  const list = await prisma.list.findUnique({
    where: {
      id: listId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      listProjects: {
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
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          listProjects: true,
        },
      },
    },
  });

  if (!list) {
    throw new Error("List not found");
  }

  return list;
}

export async function submitProjectsToList({
  listId,
  projectIds,
}: {
  listId: string;
  projectIds: string[];
}) {
  const user = await getUser();
  if (!user) {
    throw new Error("You must be logged in to manage projects");
  }

  // Verify all projects belong to user (if any are provided)
  if (projectIds.length > 0) {
    const projects = await prisma.project.findMany({
      where: {
        id: { in: projectIds },
        userId: user.id,
      },
    });

    if (projects.length !== projectIds.length) {
      throw new Error("Some projects not found or you don't have permission");
    }
  }

  // Get all existing submissions for this list
  const existingSubmissions = await prisma.listProject.findMany({
    where: {
      listId,
      project: {
        userId: user.id,
      },
    },
    select: {
      projectId: true,
    },
  });

  const existingProjectIds = new Set(
    existingSubmissions.map((sub) => sub.projectId),
  );
  const selectedProjectIds = new Set(projectIds);

  // Projects to add: selected but not existing
  const projectsToAdd = projectIds.filter((id) => !existingProjectIds.has(id));

  // Projects to remove: existing but not selected
  const projectsToRemove = Array.from(existingProjectIds).filter(
    (id) => !selectedProjectIds.has(id),
  );

  // Execute all operations in a transaction
  const operations = [];

  // Add new projects
  if (projectsToAdd.length > 0) {
    operations.push(
      ...projectsToAdd.map((projectId) =>
        prisma.listProject.create({
          data: {
            listId,
            projectId,
            order: 0,
          },
        }),
      ),
    );
  }

  // Remove deselected projects
  if (projectsToRemove.length > 0) {
    operations.push(
      prisma.listProject.deleteMany({
        where: {
          listId,
          projectId: { in: projectsToRemove },
        },
      }),
    );
  }

  if (operations.length > 0) {
    await prisma.$transaction(operations);
  }

  revalidatePath(`/lists/${listId}`);

  return {
    added: projectsToAdd.length,
    removed: projectsToRemove.length,
    total: projectIds.length,
  };
}

export async function getLists({
  search,
  cursor,
  limit = 12,
}: {
  search?: string;
  cursor?: string;
  limit?: number;
}) {
  const where = {
    visibility: "PUBLIC" as const,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const lists = await prisma.list.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      listProjects: {
        take: 5,
        include: {
          project: {
            include: {
              user: {
                select: {
                  id: true,
                  image: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          listProjects: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit + 1,
    ...(cursor && {
      skip: 1,
      cursor: {
        id: cursor,
      },
    }),
  });

  const hasMore = lists.length > limit;
  const data = hasMore ? lists.slice(0, limit) : lists;
  const nextCursor = hasMore ? data[data.length - 1]?.id : null;

  return {
    lists: data,
    nextCursor,
    hasMore,
  };
}
