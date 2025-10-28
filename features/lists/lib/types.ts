import z from "zod";

import { newListSchema } from "./validation";

export type NewList = z.infer<typeof newListSchema>;

export interface List {
  id: string;
  name: string;
  description: string | null;
  visibility: "PUBLIC" | "UNLISTED";
  createdAt: Date;
  updatedAt: Date;
}
