"use client";

import { ProjectDetailModal } from "@/features/projects/components/project-detail-modal";
import { useRouter } from "next/navigation";

interface ProjectDetailModalClientProps {
  project: {
    id: string;
    name: string;
    description: string;
    body?: string | null;
    liveLink: string;
    codeLink?: string | null;
    visibility: "PUBLIC" | "PRIVATE";
    techStack: { id: string; label: string; image?: string | null }[];
    createdAt: Date;
    updatedAt: Date;
  };
  ogImage?: string | null;
}

export function ProjectDetailModalClient({
  project,
  ogImage,
}: ProjectDetailModalClientProps) {
  const router = useRouter();

  return (
    <ProjectDetailModal
      project={project}
      open={true}
      onClose={() => router.back()}
      ogImage={ogImage}
    />
  );
}
