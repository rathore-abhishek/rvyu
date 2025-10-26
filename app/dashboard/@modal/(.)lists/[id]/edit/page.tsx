import { ModalWrapper } from "../../../modal-wrapper";
import { getLists } from "@/features/lists/lib/actionts";
import { EditListModalClient } from "./edit-modal-client";

export default async function EditListModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const lists = await getLists();
  const list = lists.find((l) => l.id === id);

  if (!list) {
    return null;
  }

  return (
    <ModalWrapper
      title="Edit list"
      description="Update your review list details."
    >
      <EditListModalClient
        initialData={{
          id: list.id,
          name: list.name,
          description: list.description || "",
          visibility: list.visibility,
        }}
      />
    </ModalWrapper>
  );
}
