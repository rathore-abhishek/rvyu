"use client";

import { EditListFormContent } from "@/features/lists/components";
import { useRouter } from "next/navigation";

interface EditListModalClientProps {
  initialData: {
    id: string;
    name: string;
    description: string;
    visibility: "PUBLIC" | "UNLISTED";
  };
}

export function EditListModalClient({ initialData }: EditListModalClientProps) {
  const router = useRouter();

  return (
    <EditListFormContent
      initialData={initialData}
      onSuccess={() => router.back()}
      onCancel={() => router.back()}
    />
  );
}
