import { ListsGrid } from "@/features/lists/components";
import { ModalWrapper } from "../../../@modal/modal-wrapper";
import { getLists } from "@/features/lists/lib/actionts";
import { EditListFormContent } from "@/features/lists/components";

export default async function EditListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const lists = await getLists();
  const list = lists.find((l) => l.id === id);

  if (!list) {
    return <div>List not found</div>;
  }

  return (
    <>
      <ListsGrid />
      <ModalWrapper title="Edit list" description="Update your review list details.">
        <EditListFormContent
          initialData={{
            id: list.id,
            name: list.name,
            description: list.description || "",
            visibility: list.visibility,
          }}
        />
      </ModalWrapper>
    </>
  );
}
