"use client";

import * as React from "react";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import { Globe, Loader, UnList } from "@/components/icons";

import { editList, getListDetails } from "../lib/actionts";
import { NewList } from "../lib/types";
import { newListSchema } from "../lib/validation";

interface EditListDialogProps {
  listId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditListDialog({
  listId,
  open,
  onOpenChange,
}: EditListDialogProps) {
  const queryClient = useQueryClient();

  // Fetch list details when dialog opens
  const { data: listData, isLoading } = useQuery({
    queryKey: ["list-details", listId],
    queryFn: () => getListDetails(listId!),
    enabled: !!listId && open,
  });

  const form = useForm({
    defaultValues: {
      name: listData?.name || "",
      description: listData?.description || "",
      visibility: listData?.visibility || "UNLISTED",
    } as NewList,
    validators: {
      onSubmit: newListSchema,
    },
    onSubmit: async () => {
      if (!listData) return;
      await editListMutation({
        id: listData.id,
        ...form.state.values,
      });
    },
  });

  const { mutateAsync: editListMutation, isPending } = useMutation({
    mutationFn: editList,
    onSuccess: () => {
      toast.success("List updated successfully!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["list-details", listId] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update list");
    },
  });

  // Reset form when listData changes
  React.useEffect(() => {
    if (listData && open) {
      form.setFieldValue("name", listData.name);
      form.setFieldValue("description", listData.description || "");
      form.setFieldValue("visibility", listData.visibility);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listData, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={listId}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit list</DialogTitle>
          <DialogDescription>
            Update your review list details.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ) : !listData ? null : (
          <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g. Frontend Projects"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                  aria-invalid={field.state.meta.errors.length > 0}
                  maxLength={50}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="edit-description">
                  Description{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="edit-description"
                  placeholder="Brief description of this review list..."
                  value={(field.state.value as string) || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                  maxLength={500}
                  disabled={isPending}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.value && (
                  <p className="text-muted-foreground text-xs">
                    {(field.state.value as string).length}/500 characters
                  </p>
                )}
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="visibility">
            {(field) => (
              <div className="space-y-2">
                <Label>Visibility</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={
                      field.state.value === "UNLISTED" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => field.handleChange("UNLISTED")}
                    disabled={isPending}
                    className="flex-1"
                  >
                    <UnList className="h-4 w-4" />
                    Unlisted
                  </Button>
                  <Button
                    type="button"
                    variant={
                      field.state.value === "PUBLIC" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => field.handleChange("PUBLIC")}
                    disabled={isPending}
                    className="flex-1"
                  >
                    <Globe className="h-4 w-4" />
                    Public
                  </Button>
                </div>
              </div>
            )}
          </form.Field>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? (
                <>
                  <Loader className="h-4 w-4" />
                  Updating...
                </>
              ) : (
                "Update list"
              )}
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
