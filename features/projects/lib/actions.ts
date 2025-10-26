"use server";

import { getUser } from "@/actions/user";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NewProject } from "./types";

export async function getProjects() {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    include: {
      techStack: {
        select: {
          id: true,
          label: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
}

export async function createProject(data: NewProject) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      liveLink: data.liveLink,
      codeLink: data.codeLink || null,
      body: data.body,
      visibility: data.visibility,
      userId: user.id,
      techStack: {
        create: data.techStack.map((tech) => ({
          label: tech.label,
          image: tech.image || null,
        })),
      },
    },
    include: {
      techStack: true,
    },
  });

  revalidatePath("/dashboard/projects");
  return project;
}

export async function getProjectById(id: string) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: { techStack: true },
  });

  if (!project || project.userId !== user.id) {
    throw new Error("Project not found");
  }

  return project;
}

export async function editProject(id: string, data: NewProject) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const existingProject = await prisma.project.findUnique({
    where: { id },
  });

  if (!existingProject || existingProject.userId !== user.id) {
    throw new Error("Project not found or unauthorized");
  }

  // Delete existing tech stack and create new ones
  const project = await prisma.project.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      liveLink: data.liveLink,
      codeLink: data.codeLink || null,
      body: data.body,
      visibility: data.visibility,
      techStack: {
        deleteMany: {},
        create: data.techStack.map((tech) => ({
          label: tech.label,
          image: tech.image || null,
        })),
      },
    },
    include: {
      techStack: true,
    },
  });

  revalidatePath("/dashboard/projects");
  return project;
}

export async function deleteProject(id: string) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const existingProject = await prisma.project.findUnique({
    where: { id },
  });

  if (!existingProject || existingProject.userId !== user.id) {
    throw new Error("Project not found or unauthorized");
  }

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/dashboard/projects");
}
