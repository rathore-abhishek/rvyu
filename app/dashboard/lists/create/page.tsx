import { ListsGrid } from "@/features/lists/components";
import { ModalWrapper } from "../../../../components/common/modal-wrapper";
import { CreateListFormContent } from "@/features/lists/components";

export default function CreateListPage() {
  return (
    <div>
      <ListsGrid />
      <ModalWrapper
        title="Create new list"
        description="Add a new review list."
      >
        <CreateListFormContent />
      </ModalWrapper>
    </div>
  );
}
