import { ModalWrapper } from "../../../../../components/common/modal-wrapper";
import { CreateListModalClient } from "./create-modal-client";

export default function CreateListModal() {
  return (
    <ModalWrapper title="Create new list" description="Add a new review list.">
      <CreateListModalClient />
    </ModalWrapper>
  );
}
