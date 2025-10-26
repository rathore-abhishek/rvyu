"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createList } from "../lib/actionts";
import { newListSchema } from "../lib/validation";
import { NewList } from "../lib/types";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Globe, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateListFormContentProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateListFormContent({ onSuccess, onCancel }: CreateListFormContentProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      visibility: "UNLISTED" as const,
    } as NewList,
    validators: {
      onSubmit: newListSchema,
    },
    onSubmit: async () => {
      await createListMutation(form.state.values);
    },
  });

  const { mutateAsync: createListMutation, isPending } = useMutation({
    mutationFn: createList,
    onSuccess: () => {
      toast.success("List created successfully!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/lists");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create list");
    },
  });

  return (
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
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
            <Label htmlFor="description">
              Description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="description"
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
                variant={field.state.value === "UNLISTED" ? "default" : "outline"}
                size="sm"
                onClick={() => field.handleChange("UNLISTED")}
                disabled={isPending}
                className="flex-1"
              >
                <Link2 className="h-4 w-4" />
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
          onClick={() => (onCancel ? onCancel() : router.push("/dashboard/lists"))}
          disabled={isPending}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create list"
          )}
        </Button>
      </div>
    </form>
  );
}
