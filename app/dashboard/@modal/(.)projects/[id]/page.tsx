import { getProjectById } from "@/features/projects/lib/actions";
import { getOGImage } from "@/features/projects/lib/og-image";
import { ProjectDetailModalClient } from "./detail-modal-client";

export default async function ProjectDetailModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const project = await getProjectById(id);

  if (!project) {
    return null;
  }

  // Fetch OG image
  const ogImage = await getOGImage(project.liveLink);

  return (
    <ProjectDetailModalClient
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
