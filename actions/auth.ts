"use server";

import { auth } from "@/lib/auth";
import { validateOrThrow } from "@/validation";
import { signInSchema, signUpSchema } from "@/validation/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInSocial(provider: "google" | "github") {
  const { url, redirect: shouldRedirect } = await auth.api.signInSocial({
    body: { provider: provider, callbackURL: "/dashboard" },
  });

  if (shouldRedirect && url) {
    redirect(url);
  }
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  validateOrThrow(signInSchema, { email, password });

  console.log(email, password);

  const { user } = await auth.api.signInEmail({
    body: { email, password },
    headers: await headers(),
  });

  console.log(user);

  if (!user) {
    throw new Error("Failed to sign in");
  }

  auth.api.sendVerificationEmail({
    body: { email, callbackURL: "/dashboard" },
    headers: await headers(),
  });
}

export async function signUp({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  validateOrThrow(signUpSchema, { name, email, password });

  const { user } = await auth.api.signUpEmail({
    body: { name, email, password },
    headers: await headers(),
  });

  if (!user) {
    throw new Error("Failed to sign up");
  }

  auth.api.sendVerificationEmail({
    body: { email, callbackURL: "/dashboard" },
    headers: await headers(),
  });
}

export async function logout() {
  await auth.api.signOut({
    headers: await headers(),
  });

  revalidatePath("/dashboard");
}
