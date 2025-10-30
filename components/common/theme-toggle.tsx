"use client";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import Moon from "../icons/moon";
import Sun from "../icons/sun";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="text-muted-foreground size-5" />
      ) : (
        <Moon className="text-muted-foreground size-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
