import { ProjectsGrid } from "@/features/projects/components";
import { ModalWrapper } from "../../../../../components/common/modal-wrapper";
import { getProjectById } from "@/features/projects/lib/actions";
import { EditProjectFormContent } from "@/features/projects/components";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const project = await getProjectById(id);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <ProjectsGrid />
      <ModalWrapper
        title="Edit project"
        description="Update your project details."
      >
        <EditProjectFormContent
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
    </div>
  );
}
