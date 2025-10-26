"use client";

import { EditProjectFormContent } from "@/features/projects/components";
import { useRouter } from "next/navigation";

interface EditProjectModalClientProps {
  initialData: {
    id: string;
    name: string;
    description: string;
    body?: string;
    liveLink: string;
    codeLink?: string | null;
    visibility: "PUBLIC" | "PRIVATE";
    techStack: { label: string; image?: string | null }[];
  };
}

export function EditProjectModalClient({
  initialData,
}: EditProjectModalClientProps) {
  const router = useRouter();

  return (
    <EditProjectFormContent
      initialData={initialData}
      onSuccess={() => router.back()}
      onCancel={() => router.back()}
    />
  );
}
