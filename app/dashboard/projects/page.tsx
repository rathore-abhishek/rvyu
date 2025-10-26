import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FileCode } from "lucide-react";

const Projects = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileCode />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          Submit projects to your lists to see them here.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default Projects;
