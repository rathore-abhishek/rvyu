import { z } from "zod";

const urlSchema = z.string().url("Please enter a valid URL");

const techStackSchema = z.object({
  label: z.string().min(1, "Tech name is required"),
  image: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export const newProjectWithoutTechStackSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  body: z
    .string()
    .max(10000, "Content must be less than 10000 characters")
    .optional()
    .or(z.literal("")),
  liveLink: urlSchema,
  codeLink: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  // techStack: z
  //   .array(techStackSchema)
  //   .min(1, "At least one technology is required")
  //   .max(10, "Maximum 10 technologies allowed"),
});

export const newProjectSchema = newProjectWithoutTechStackSchema.extend({
  techStack: z
    .array(techStackSchema)
    .min(1, "At least one technology is required")
    .max(10, "Maximum 10 technologies allowed"),
});

export type NewProjectSchema = z.infer<typeof newProjectWithoutTechStackSchema>;
