"use client";

import { useState } from "react";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Textarea } from "@/components/ui/textarea";

import { Globe, Loader, ProjectLock } from "@/components/icons";
import { validateWithSchema } from "@/validation";

import { createProject } from "../lib/actions";
import { NewProject } from "../lib/types";
import {
  newProjectSchema,
  newProjectWithoutTechStackSchema,
} from "../lib/validation";
import { TechStackInput } from "./tech-stack-input";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
}: CreateProjectDialogProps) {
  const queryClient = useQueryClient();
  const [techStack, setTechStack] = useState<
    { label: string; image?: string }[]
  >([]);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      body: "",
      liveLink: "",
      codeLink: "",
      visibility: "PRIVATE" as const,
    } as Omit<NewProject, "techStack">,
    validators: { onSubmit: newProjectWithoutTechStackSchema },
    onSubmit: async () => {
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

      await createProjectMutation(data!);
    },
  });

  const { mutateAsync: createProjectMutation, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Project created successfully!");
      form.reset();
      setTechStack([]);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  const addTech = (tech: { label: string; image?: string }) => {
    setTechStack([...techStack, tech]);
  };

  const removeTech = (index: number) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Share your amazing work with the community.
          </DialogDescription>
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
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
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
                <Label htmlFor="body">
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
                <Label htmlFor="liveLink">Live URL</Label>
                <Input
                  id="liveLink"
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
                <Label htmlFor="codeLink">
                  Code URL{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="codeLink"
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
                  <Loader className="h-4 w-4" />
                  Creating...
                </>
              ) : (
                "Create project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
