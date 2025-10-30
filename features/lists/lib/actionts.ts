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

export async function getLists() {
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
