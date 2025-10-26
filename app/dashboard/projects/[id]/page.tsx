import {
  getProjectById,
  getSiteMetadata,
} from "@/features/projects/lib/actions";
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

  // Fetch site metadata
  const metadata = await getSiteMetadata(project.liveLink);

  return (
    <ProjectDetailPageClient
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
