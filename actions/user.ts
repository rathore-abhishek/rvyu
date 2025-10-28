"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getUser(): Promise<{
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image: string | null;
  bio: string | null;
  github: string | null;
  twitter: string | null;
  linkedin: string | null;
  peerlist: string | null;
  portfolio: string | null;
} | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  // Fetch complete user data from database including social links
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      image: true,
      bio: true,
      github: true,
      twitter: true,
      linkedin: true,
      peerlist: true,
      portfolio: true,
    },
  });

  if (!user) {
    return null;
  }

  // Ensure name is always a strin
  // g (fallback to email)
  return {
    ...user,
    name: user.name || user.email,
  };
}

export async function updateUserProfile(data: {
  name: string;
  bio?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  peerlist?: string;
  portfolio?: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate name
    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Name is required" };
    }

    if (data.name.length > 100) {
      return { success: false, error: "Name must be less than 100 characters" };
    }

    // Validate bio length
    if (data.bio && data.bio.length > 500) {
      return { success: false, error: "Bio must be less than 500 characters" };
    }

    // Validate social links length
    const socialFields = ["github", "twitter", "linkedin", "peerlist"] as const;
    for (const field of socialFields) {
      if (data[field] && data[field]!.length > 100) {
        return {
          success: false,
          error: `${field.charAt(0).toUpperCase() + field.slice(1)} must be less than 100 characters`,
        };
      }
    }

    if (data.portfolio && data.portfolio.length > 200) {
      return {
        success: false,
        error: "Portfolio URL must be less than 200 characters",
      };
    }

    // Update user profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name.trim(),
        bio: data.bio?.trim() || null,
        github: data.github?.trim() || null,
        twitter: data.twitter?.trim() || null,
        linkedin: data.linkedin?.trim() || null,
        peerlist: data.peerlist?.trim() || null,
        portfolio: data.portfolio?.trim() || null,
      },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath(`/users/${session.user.id}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
