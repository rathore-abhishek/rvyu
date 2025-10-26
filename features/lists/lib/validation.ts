import z from "zod";

export const newListSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must not exceed 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
  visibility: z.enum(["PUBLIC", "UNLISTED"]),
});
