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
  ogImage?: string | null;
}

export function ProjectDetailPageClient({
  project,
  ogImage,
}: ProjectDetailPageClientProps) {
  const router = useRouter();

  return (
    <div>
      <ProjectsGrid />
      <ProjectDetailModal
        project={project}
        open={true}
        onClose={() => router.push("/dashboard/projects")}
        ogImage={ogImage}
      />
    </div>
  );
}
