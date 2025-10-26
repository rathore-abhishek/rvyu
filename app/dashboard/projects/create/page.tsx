import { ProjectsGrid } from "@/features/projects/components";
import { ModalWrapper } from "../../../../components/common/modal-wrapper";
import { CreateProjectFormContent } from "@/features/projects/components";

export default function CreateProjectPage() {
  return (
    <div>
      <ProjectsGrid />
      <ModalWrapper
        title="Create new project"
        description="Share your amazing work with the community."
      >
        <CreateProjectFormContent />
      </ModalWrapper>
    </div>
  );
}
