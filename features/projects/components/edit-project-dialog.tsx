"use client";

import { Error as ErrorIcon, Globe, Loader, ProjectLock } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
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
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Textarea } from "@/components/ui/textarea";
import { validateWithSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { editProject, getProjectById } from "../lib/actions";
import { NewProject } from "../lib/types";
import {
  newProjectSchema,
  newProjectWithoutTechStackSchema,
} from "../lib/validation";
import { TechStackInput } from "./tech-stack-input";

interface EditProjectDialogProps {
  projectId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProjectDialog({
  projectId,
  open,
  onOpenChange,
}: EditProjectDialogProps) {
  const queryClient = useQueryClient();
  const [isManualRetrying, setIsManualRetrying] = useState(false);

  const {
    data: project,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId!),
    enabled: !!projectId && open,
  });

  // Initialize tech stack from project data
  const [techStack, setTechStack] = useState<
    { label: string; image?: string }[]
  >(() =>
    project?.techStack.map((t) => ({
      label: t.label,
      image: t.image || undefined,
    })) || [],
  );

  const form = useForm({
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      body:
        typeof project?.body === "string"
          ? project.body
          : JSON.stringify(project?.body || ""),
      liveLink: project?.liveLink || "",
      codeLink: project?.codeLink || "",
      visibility: project?.visibility || "PRIVATE",
    } as Omit<NewProject, "techStack">,
    validators: { onSubmit: newProjectWithoutTechStackSchema },
    onSubmit: async () => {
      if (!project) return;

      const projectData = {
        ...form.state.values,
        techStack,
      };

      const { success, errors, data } = validateWithSchema(
        newProjectSchema,
        projectData,
      );
      if (!success) {
        const firstError = errors?.issues[0]?.message;
        toast.error(firstError || "Please check your inputs");
        return;
      }

      await editProjectMutation({
        id: project.id,
        data: data!,
      });
    },
  });

  const { mutateAsync: editProjectMutation, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: NewProject }) =>
      editProject(id, data),
    onSuccess: () => {
      toast.success("Project updated successfully!");
      form.reset();
      // Invalidate both projects list and individual project queries
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update project");
    },
  });

  const addTech = (tech: { label: string; image?: string }) => {
    setTechStack([...techStack, tech]);
  };

  const removeTech = (index: number) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  // Loading state
  if ((isLoading && !project) || isManualRetrying) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sr-only">Loading project...</DialogTitle>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-48" />
          </DialogHeader>
          <div className="space-y-4">
            {/* Name Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Description Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Rich Content Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-40 w-full" />
            </div>

            {/* URL Fields Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Tech Stack Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>

            {/* Visibility Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (isError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle className="sr-only">Error loading project</DialogTitle>
          <div className="flex flex-col items-center justify-center py-12">
            <ErrorIcon className="text-destructive mb-4 h-8 w-8" />
            <p className="text-muted-foreground mb-4 text-sm">
              {error?.message || "Failed to load project"}
            </p>
            <Button
              variant="outline"
              onClick={async () => {
                setIsManualRetrying(true);
                await refetch();
                setIsManualRetrying(false);
              }}
            >
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={projectId}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>Update your project details.</DialogDescription>
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
                <Label htmlFor="edit-name">Project Name</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g. My Awesome App"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                  aria-invalid={field.state.meta.errors.length > 0}
                  maxLength={100}
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
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Tell us about your project..."
                  value={(field.state.value as string) || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  disabled={isPending}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.value && (
                  <p className="text-muted-foreground text-xs">
                    {(field.state.value as string).length}/1000 characters
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

          <form.Field name="body">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="edit-body">
                  Rich Content{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <RichTextEditor
                  value={(field.state.value as string) || ""}
                  onChange={(value) => field.handleChange(value)}
                  disabled={isPending}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="liveLink">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="edit-liveLink">Live URL</Label>
                <Input
                  id="edit-liveLink"
                  type="url"
                  placeholder="https://example.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="codeLink">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="edit-codeLink">
                  Code URL{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="edit-codeLink"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={(field.state.value as string) || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Tech Stack */}
          <TechStackInput
            techStack={techStack}
            onAdd={addTech}
            onRemove={removeTech}
            disabled={isPending}
          />

          <form.Field name="visibility">
            {(field) => (
              <div className="space-y-2">
                <Label>Visibility</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={
                      field.state.value === "PRIVATE" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => field.handleChange("PRIVATE")}
                    disabled={isPending}
                    className="flex-1"
                  >
                    <ProjectLock className="h-4 w-4" />
                    Private
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
                  <Loader className="w-4n h-4" />
                  Updating...
                </>
              ) : (
                "Update project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
