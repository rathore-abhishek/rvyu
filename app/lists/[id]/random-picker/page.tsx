import RandomProjectPicker from "@/features/lists/components/random-project-picker";

import { getUser } from "@/actions/user";

const RandomPickerPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const user = await getUser();

  return <RandomProjectPicker listId={id} currentUserId={user?.id || null} />;
};

export default RandomPickerPage;
