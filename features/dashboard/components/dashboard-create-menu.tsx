"use client";

import { useState } from "react";
import { FolderCode, List, Plus } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateProjectDialog } from "@/features/projects/components";
import { CreateListDialog } from "@/features/lists/components";

export function DashboardCreateMenu() {
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createListOpen, setCreateListOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCreateProject = () => {
    setDropdownOpen(false);
    setCreateProjectOpen(true);
  };

  const handleCreateList = () => {
    setDropdownOpen(false);
    setCreateListOpen(true);
  };

  return (
    <>
      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
      />
      <CreateListDialog
        open={createListOpen}
        onOpenChange={setCreateListOpen}
      />
      
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="sm">
            <Plus />
            Create
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCreateProject}>
            <FolderCode className="h-4 w-4" />
            New Project
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCreateList}>
            <List className="h-4 w-4" />
            New List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
