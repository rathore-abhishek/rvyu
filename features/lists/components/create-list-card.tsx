import Plus from "@/components/icons/plus";

interface CreateListCardProps {
  onClick: () => void;
}

export function CreateListCard({ onClick }: CreateListCardProps) {
  return (
    <button
      onClick={onClick}
      className="hover:border-primary hover:bg-accent/30 flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center transition-colors"
    >
      <figure className="bg-accent rounded-full p-3">
        <Plus className="text-muted-foreground h-5 w-5" />
      </figure>
      <span className="font-medium">Create new list</span>
    </button>
  );
}
