"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { editProject } from "../lib/actions";
import {
  newProjectSchema,
  newProjectWithoutTechStackSchema,
} from "../lib/validation";
import { NewProject } from "../lib/types";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Globe, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TechStackInput } from "./tech-stack-input";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { validateWithSchema } from "@/validation";

interface EditProjectFormContentProps {
  initialData: {
    id: string;
    name: string;
    description: string;
    body?: string;
    liveLink: string;
    codeLink?: string | null;
    visibility: "PUBLIC" | "PRIVATE";
    techStack: { label: string; image?: string | null }[];
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditProjectFormContent({
  initialData,
  onSuccess,
  onCancel,
}: EditProjectFormContentProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [techStack, setTechStack] = useState<
    { label: string; image?: string }[]
  >(
    initialData.techStack.map((t) => ({
      label: t.label,
      image: t.image || undefined,
    })),
  );

  const form = useForm({
    defaultValues: {
      name: initialData.name,
      description: initialData.description,
      body: initialData.body || "",
      liveLink: initialData.liveLink,
      codeLink: initialData.codeLink || "",
      visibility: initialData.visibility,
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

      await editProjectMutation({
        id: initialData.id,
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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/projects");
      }
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
                <Lock className="h-4 w-4" />
                Private
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
          onClick={() =>
            onCancel ? onCancel() : router.push("/dashboard/projects")
          }
          disabled={isPending}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update project"
          )}
        </Button>
      </div>
    </form>
  );
}
