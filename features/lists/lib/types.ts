import z from "zod";
import { newListSchema } from "./validation";

export type NewList = z.infer<typeof newListSchema>;
