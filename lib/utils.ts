import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to extract UploadThing file key from URL
export function extractUploadThingKey(url: string): string | null {
  try {
    // UploadThing URLs typically look like: https://utfs.io/f/{fileKey}
    const match = url.match(/\/f\/([^\/\?]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
