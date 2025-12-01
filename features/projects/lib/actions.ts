"use server";

import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";

import { getUser } from "@/actions/user";

import db from "@/db";
import { project, review, techStack, user as userTable } from "@/db/schema";
import { validateOrThrow } from "@/validation";

import { NewProject, ProjectMetadata } from "./types";
import { ReviewSchema, newProjectSchema, reviewSchema } from "./validation";

/**
 * Creates a new project with associated tech stack
 * Note: Not using transactions as neon-http driver doesn't support them
 */
export async function submitProject(data: NewProject) {
  // Validate input data
  validateOrThrow(newProjectSchema, data);

  // 1. Insert the project
  const [projectResult] = await db
    .insert(project)
    .values({
      name: data.name,
      description: data.description,
      body: data.body || null,
      liveLink: data.liveLink,
      codeLink: data.codeLink || null,
    })
    .returning();

  if (!projectResult) {
    throw new Error("Failed to create project");
  }

  // 2. Insert tech stack items if provided
  if (data.techStack && data.techStack.length > 0) {
    const techStackValues = data.techStack.map((tech) => ({
      label: tech.label,
      image: tech.image || null,
      projectId: projectResult.id,
    }));

    try {
      await db.insert(techStack).values(techStackValues);
    } catch {
      // If tech stack insertion fails, delete the project to maintain consistency
      await db.delete(project).where(eq(project.id, projectResult.id));
      throw new Error("Failed to create project with tech stack");
    }
  }

  revalidatePath("/dashboard/projects");

  return projectResult;
}

// export async function getProjects() {
//   const user = await getUser();

//   if (!user) {
//     throw new Error("Unauthorized");
//   }

//   // Fetch minimal data for grid display - exclude body field for performance
//   const projects = await db.query.project.findMany({
//     where: eq(project.userId, user.id),
//     columns: {
//       id: true,
//       name: true,
//       description: true,
//       liveLink: true,
//       codeLink: true,
//       visibility: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//     with: {
//       techStack: {
//         columns: {
//           id: true,
//           label: true,
//           image: true,
//         },
//       },
//     },
//     orderBy: (projects, { desc }) => [desc(projects.createdAt)],
//   });

//   return projects;
// }

export async function getProjectById(id: string) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const projectData = await db.query.project.findFirst({
    where: eq(project.id, id),
    with: { techStack: true },
  });

  return projectData;
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

export async function submitReview(data: ReviewSchema) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Validate input data
  validateOrThrow(reviewSchema, data);

  // Get user's current video info from DB
  const userData = await db.query.user.findFirst({
    where: eq(userTable.id, user.id),
    columns: {
      currentVideoNumber: true,
      currentVideoLink: true,
    },
  });

  // Insert the review
  const [reviewResult] = await db
    .insert(review)
    .values({
      projectId: data.projectId,
      userId: user.id,
      design: data.design,
      userExperience: data.userExperience,
      creativity: data.creativity,
      functionality: data.functionality,
      hireability: data.hireability,
      remark: data.remark ? JSON.stringify(data.remark) : null,
      videoNumber: userData?.currentVideoNumber || null,
      videoLink: userData?.currentVideoLink || null,
    })
    .returning();

  if (!reviewResult) {
    throw new Error("Failed to submit review");
  }

  revalidatePath(`/lists/[id]`); // Revalidate list pages where this project might appear
  revalidatePath(`/projects/${data.projectId}`);

  return reviewResult;
}
