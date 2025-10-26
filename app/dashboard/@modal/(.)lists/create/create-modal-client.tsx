"use client";

import { CreateListFormContent } from "@/features/lists/components";
import { useRouter } from "next/navigation";

export function CreateListModalClient() {
  const router = useRouter();

  return (
    <CreateListFormContent
      onSuccess={() => router.back()}
      onCancel={() => router.back()}
    />
  );
}
