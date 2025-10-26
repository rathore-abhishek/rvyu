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
  metadata: {
    openGraph: {
      title: string | null;
      description: string | null;
      image: string | null;
    };
    twitter: {
      card: string | null;
      title: string | null;
      description: string | null;
      image: string | null;
    };
    html: {
      title: string | null;
      description: string | null;
    };
  } | null;
}

export function ProjectDetailModalClient({
  project,
  metadata,
}: ProjectDetailModalClientProps) {
  const router = useRouter();

  return (
    <ProjectDetailModal
      project={project}
      open={true}
      onClose={() => router.back()}
      metadata={metadata}
    />
  );
}
