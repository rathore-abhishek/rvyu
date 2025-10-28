"use client";

import { Globe, Loader, UnList } from "@/components/icons";
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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { editList } from "../lib/actionts";
import { NewList } from "../lib/types";
import { newListSchema } from "../lib/validation";

interface EditListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    id: string;
    name: string;
    description: string;
    visibility: "PUBLIC" | "UNLISTED";
  };
}

export function EditListDialog({
  open,
  onOpenChange,
  initialData,
}: EditListDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: initialData.name,
      description: initialData.description,
      visibility: initialData.visibility,
    } as NewList,
    validators: {
      onSubmit: newListSchema,
    },
    onSubmit: async () => {
      await editListMutation({
        id: initialData.id,
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
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update list");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit list</DialogTitle>
          <DialogDescription>Update your review list details.</DialogDescription>
        </DialogHeader>
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
                    variant={field.state.value === "PUBLIC" ? "default" : "outline"}
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
                  <Loader className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update list"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
