"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import Shuffle from "@/components/icons/shuffle";

import { Edit, Plus } from "@/components/icons";

import { EditListDialog } from "./edit-list-dialog";
import { SubmitProjectDialog } from "./submit-project-dialog";

const ListDetailActions = ({
  listId,
  listName,
  isOwner,
}: {
  isOwner: boolean;
  listId: string;
  listName: string;
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  return (
    <>
      <div className="flex shrink-0 gap-2">
        {isOwner && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setEditDialogOpen(true)}
          >
            <Edit />
          </Button>
        )}
        <Button
          size="default"
          variant={isOwner ? "secondary" : "default"}
          onClick={() => setSubmitDialogOpen(true)}
        >
          <Plus />
          Submit Project
        </Button>
        {isOwner && (
          <Button size="default" onClick={() => setSubmitDialogOpen(true)}>
            <Shuffle />
            Pick Random
          </Button>
        )}
      </div>
      {isOwner && (
        <EditListDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          listId={listId}
        />
      )}
      <SubmitProjectDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        listId={listId}
        listName={listName}
      />
    </>
  );
};

export default ListDetailActions;
