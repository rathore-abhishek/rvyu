"use client";

import { ProjectsGrid } from "@/features/projects/components";
import { ProjectDetailModal } from "@/features/projects/components/project-detail-modal";
import { useRouter } from "next/navigation";

interface ProjectDetailPageClientProps {
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

export function ProjectDetailPageClient({
  project,
  metadata,
}: ProjectDetailPageClientProps) {
  const router = useRouter();

  return (
    <div>
      <ProjectsGrid />
      <ProjectDetailModal
        project={project}
        open={true}
        onClose={() => router.push("/dashboard/projects")}
        metadata={metadata}
      />
    </div>
  );
}
