import { ModalWrapper } from "@/components/common/modal-wrapper";
import { getProjectById } from "@/features/projects/lib/actions";
import { EditProjectModalClient } from "./edit-modal-client";

export default async function EditProjectModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const project = await getProjectById(id);

  if (!project) {
    return null;
  }

  return (
    <ModalWrapper
      title="Edit project"
      description="Update your project details."
    >
      <EditProjectModalClient
        initialData={{
          id: project.id,
          name: project.name,
          description: project.description,
          body: typeof project.body === 'string' ? project.body : JSON.stringify(project.body),
          liveLink: project.liveLink,
          codeLink: project.codeLink,
          visibility: project.visibility,
          techStack: project.techStack,
        }}
      />
    </ModalWrapper>
  );
}
