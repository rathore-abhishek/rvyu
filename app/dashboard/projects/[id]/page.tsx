import { getProjectById } from "@/features/projects/lib/actions";
import { getOGImage } from "@/features/projects/lib/og-image";
import { notFound } from "next/navigation";
import { ProjectDetailPageClient } from "./page-client";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  // Fetch OG image
  const ogImage = await getOGImage(project.liveLink);

  return (
    <ProjectDetailPageClient
      project={{
        ...project,
        body:
          typeof project.body === "string"
            ? project.body
            : JSON.stringify(project.body),
      }}
      ogImage={ogImage}
    />
  );
}
