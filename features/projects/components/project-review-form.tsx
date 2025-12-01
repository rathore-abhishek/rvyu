"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Slider } from "@/components/ui/slider";

import { submitReview } from "../lib/actions";
import { reviewSchema } from "../lib/validation";

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ProjectReviewFormProps {
  projectId: string;
  onSuccess?: () => void;
}

export function ProjectReviewForm({
  projectId,
  onSuccess,
}: ProjectReviewFormProps) {
  const { mutateAsync: submitReviewMutation, isPending } = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit review");
    },
  });

  const form = useForm({
    defaultValues: {
      projectId,
      design: 5,
      userExperience: 5,
      creativity: 5,
      functionality: 5,
      hireability: 5,
      remark: "",
    } as ReviewFormValues,
    validators: {
      onChange: reviewSchema,
    },
    onSubmit: async ({ value }) => {
      await submitReviewMutation(value);
    },
  });

  const ratingCategories = [
    { name: "design", label: "Design and Aesthetics" },
    { name: "userExperience", label: "User Experience" },
    { name: "creativity", label: "Creativity and Innovation" },
    { name: "functionality", label: "Functionality and Execution Quality" },
    { name: "hireability", label: "Hireability" },
  ] as const;

  return (
    <div className="flex flex-col py-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-6"
      >
        <div className="space-y-6 overflow-y-auto">
          {/* Overall Rating Display */}
          <form.Subscribe
            selector={(state) => [
              state.values.design,
              state.values.userExperience,
              state.values.creativity,
              state.values.functionality,
              state.values.hireability,
            ]}
          >
            {([
              design,
              userExperience,
              creativity,
              functionality,
              hireability,
            ]) => {
              const overall =
                (design +
                  userExperience +
                  creativity +
                  functionality +
                  hireability) /
                5;
              return (
                <div className="bg-muted/30 flex flex-col items-center justify-center gap-2 rounded-xl border p-6 text-center">
                  <span className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                    Overall Rating
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-5xl font-bold">
                      {overall.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground text-xl">/ 10</span>
                  </div>
                </div>
              );
            }}
          </form.Subscribe>

          <div className="space-y-6">
            {ratingCategories.map((category) => (
              <form.Field key={category.name} name={category.name}>
                {(field) => (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        {category.label}
                      </Label>
                      <span className="text-muted-foreground font-mono text-sm font-medium">
                        {field.state.value} / 10
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                      value={[field.state.value]}
                      onValueChange={(vals) => field.handleChange(vals[0])}
                      className="py-1"
                      disabled={isPending}
                    />
                  </div>
                )}
              </form.Field>
            ))}

            <form.Field name="remark">
              {(field) => (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Remarks{" "}
                    <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <RichTextEditor
                    value={field.state.value ?? ""}
                    onChange={field.handleChange}
                    placeholder="Add your detailed review here..."
                    disabled={isPending}
                  />
                </div>
              )}
            </form.Field>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </div>
  );
}
