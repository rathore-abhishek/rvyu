import { ModalWrapper } from "@/components/common/modal-wrapper";
import { CreateProjectModalClient } from "./create-modal-client";

export default function CreateProjectModal() {
  return (
    <ModalWrapper
      title="Create new project"
      description="Share your amazing work with the community."
    >
      <CreateProjectModalClient />
    </ModalWrapper>
  );
}
