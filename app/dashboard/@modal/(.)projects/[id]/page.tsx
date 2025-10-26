import {
  getProjectById,
  getSiteMetadata,
} from "@/features/projects/lib/actions";
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

  // Fetch site metadata
  const metadata = await getSiteMetadata(project.liveLink);

  return (
    <ProjectDetailModalClient
      project={{
        ...project,
        body:
          typeof project.body === "string"
            ? project.body
            : JSON.stringify(project.body),
      }}
      metadata={metadata}
    />
  );
}
