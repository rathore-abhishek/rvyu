"use client";

import { CreateProjectFormContent } from "@/features/projects/components";
import { useRouter } from "next/navigation";

export function CreateProjectModalClient() {
  const router = useRouter();

  return (
    <CreateProjectFormContent
      onSuccess={() => router.back()}
      onCancel={() => router.back()}
    />
  );
}
