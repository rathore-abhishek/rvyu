"use server";

import { getUser } from "@/actions/user";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { NewProject, ProjectMetadata } from "./types";

export async function getProjects() {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Fetch minimal data for grid display - exclude body field for performance
  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      liveLink: true,
      codeLink: true,
      visibility: true,
      createdAt: true,
      updatedAt: true,
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

export async function getSiteMetadata(
  url: string,
): Promise<ProjectMetadata | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MetadataFetcher/1.0)",
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) return null;

    const html = await response.text();

    // Extract Open Graph metadata
    const ogTitle = html.match(
      /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i,
    );
    const ogDescription = html.match(
      /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i,
    );
    const ogImage = html.match(
      /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
    );

    // Extract Twitter Card metadata
    const twitterCard = html.match(
      /<meta\s+name=["']twitter:card["']\s+content=["']([^"']+)["']/i,
    );
    const twitterTitle = html.match(
      /<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i,
    );
    const twitterDescription = html.match(
      /<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i,
    );
    const twitterImage = html.match(
      /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i,
    );

    // Helper function to decode HTML entities
    const decodeHtmlEntities = (text: string | null): string | null => {
      if (!text) return null;
      return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&apos;/g, "'");
    };

    // Extract HTML metadata
    const htmlTitle = html.match(/<title>([^<]+)<\/title>/i);
    const htmlDescription = html.match(
      /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i,
    );

    return {
      openGraph: {
        title: decodeHtmlEntities(ogTitle?.[1] || null),
        description: decodeHtmlEntities(ogDescription?.[1] || null),
        image: ogImage?.[1] || null,
      },
      twitter: {
        card: twitterCard?.[1] || null,
        title: decodeHtmlEntities(twitterTitle?.[1] || null),
        description: decodeHtmlEntities(twitterDescription?.[1] || null),
        image: twitterImage?.[1] || null,
      },
      html: {
        title: decodeHtmlEntities(htmlTitle?.[1] || null),
        description: decodeHtmlEntities(htmlDescription?.[1] || null),
      },
    };
  } catch (error) {
    console.error("Error fetching site metadata:", error);
    return null;
  }
}
