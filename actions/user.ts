"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { UTApi } from "uploadthing/server";

import { editProfileSchema } from "@/features/profile/lib/validation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractUploadThingKey } from "@/lib/utils";

import { User } from "@/types";
import { validateOrThrow } from "@/validation";

const utapi = new UTApi();

export async function getUser(): Promise<User | null> {
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
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}

export async function updateUserProfile(data: {
  name: string;
  bio?: string;
  image?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  peerlist?: string;
  portfolio?: string;
}) {
  try {
    validateOrThrow(editProfileSchema, data);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get current user to check for old image
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    // Delete old image from uploadthing if it exists and a new image is provided
    if (currentUser?.image && data.image && currentUser.image !== data.image) {
      const oldImageKey = extractUploadThingKey(currentUser.image);
      if (oldImageKey) {
        try {
          await utapi.deleteFiles(oldImageKey);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
    }

    // Update user profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name.trim(),
        bio: data.bio?.trim() || null,
        image: data.image || undefined,
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
