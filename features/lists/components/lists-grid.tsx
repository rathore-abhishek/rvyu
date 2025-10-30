"use client";

import { useState } from "react";

import Link from "next/link";

import { useProgress } from "@bprogress/next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ArrowRight, Calendar, Delete, Edit } from "@/components/icons";
import { Error as ErrorIcon, Globe, Loader, UnList } from "@/components/icons";
import { List } from "@/types";

import { deleteList, getLists } from "../lib/actionts";
import { formatDate } from "../lib/utis";
import { CreateListCard } from "./create-list-card";
import { CreateListDialog } from "./create-list-dialog";
import { EditListDialog } from "./edit-list-dialog";
import { ListsGridSkeleton } from "./lists-grid-skeleton";

export function ListsGrid() {
  const {
    data: lists,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["lists"],
    queryFn: getLists,
  });
  const queryClient = useQueryClient();
  const { start, stop } = useProgress();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [listToEdit, setListToEdit] = useState<List | null>(null);
  const [isManualRetrying, setIsManualRetrying] = useState(false);

  const { mutate: deleteListMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      toast.success("List deleted successfully!");
      setDeleteDialogOpen(false);
      setListToDelete(null);
      // Refetch lists after deletion
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete list",
      );
    },
  });

  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    setListToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!listToDelete) return;
    deleteListMutation({ id: listToDelete.id });
  };

  const handleEdit = (e: React.MouseEvent, list: List) => {
    e.preventDefault();
    e.stopPropagation();
    start();
    setListToEdit(list);
    setEditDialogOpen(true);
    stop();
  };

  // Loading state - show skeleton on initial load or manual retry
  if ((isLoading && !lists) || isManualRetrying) {
    return <ListsGridSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ErrorIcon className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Failed to load lists</EmptyTitle>
          <EmptyDescription>
            {error instanceof Error
              ? error.message
              : "An error occurred while fetching your lists."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            onClick={async () => {
              setIsManualRetrying(true);
              await refetch();
              setIsManualRetrying(false);
            }}
            variant="outline"
          >
            Try Again
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  // Success state - show lists
  return (
    <>
      <CreateListDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      {listToEdit && (
        <EditListDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          initialData={{
            id: listToEdit.id,
            name: listToEdit.name,
            description: listToEdit.description || "",
            visibility: listToEdit.visibility,
          }}
        />
      )}
      <div className="grid auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateListCard
          onClick={() => {
            start();
            setCreateDialogOpen(true);
            stop();
          }}
        />
        {lists &&
          lists.map((list) => (
            <Link
              key={list.id}
              href={`/lists/${list.id}`}
              className="group bg-card hover:shadow-primary/5 relative flex cursor-pointer flex-col overflow-hidden rounded-xl border"
            >
              {/* Gradient overlay on hover */}
              <div className="from-primary/5 absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col gap-4 p-6">
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-lg leading-tight font-semibold tracking-tight transition-colors">
                          {list.name}
                        </h3>
                        {list.visibility === "PUBLIC" ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex">
                                <Globe className="text-primary h-4 w-4 shrink-0" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Public</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex">
                                <UnList className="text-muted-foreground h-4 w-4 shrink-0" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Unlisted</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      {list.description && (
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                          {list.description}
                        </p>
                      )}
                    </div>

                    {/* Action buttons - appears on hover */}
                    <div className="flex scale-95 gap-1.5 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 lg:opacity-0">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={(e) => handleEdit(e, list)}
                        className="text-muted-foreground shrink-0 rounded-lg"
                      >
                        <Edit />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={(e) =>
                          handleDeleteClick(e, list.id, list.name)
                        }
                        className="text-destructive lg:text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0 rounded-lg"
                      >
                        <Delete />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto border-t pt-3">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>{formatDate(list.createdAt)}</span>
                    </div>

                    {/* Arrow indicator - hidden on mobile, shows on desktop hover */}
                    <div className="text-accent-foreground hidden -translate-x-2 items-center gap-1 text-xs font-medium opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:flex">
                      <span>View</span>
                      <ArrowRight className="text-muted-foreground h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif tracking-wider">
              Delete List
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                &quot;{listToDelete?.name}&quot;
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader className="h-4 w-4" />
                  Deleting...
                </>
              ) : (
                <>
                  <Delete />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
