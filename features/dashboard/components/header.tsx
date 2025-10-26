"use client";

import { usePathname } from "next/navigation";

export function DashboardHeader() {
  const pathname = usePathname();

  // Determine the current route and set appropriate content
  let heading = "";
  let description = "";

  if (pathname === "/dashboard/projects") {
    heading = "Your Projects";
    description = "Look at your secy projects";
  } else if (pathname === "/dashboard/projects/create") {
    heading = "Create Project";
    description = "Make something people drool over";
  } else if (
    pathname.startsWith("/dashboard/projects/") &&
    pathname.endsWith("/edit")
  ) {
    heading = "Edit Project";
    description = "Make it even hotter";
  } else if (pathname === "/dashboard/lists") {
    heading = "Your Lists";
    description = "Your taste is showing";
  } else if (pathname === "/dashboard/lists/create") {
    heading = "Create List";
    description = "Flex your curation skills";
  } else if (
    pathname.startsWith("/dashboard/lists/") &&
    pathname.endsWith("/edit")
  ) {
    heading = "Edit List";
    description = "Refine your taste";
  } else if (pathname.startsWith("/dashboard/projects/")) {
    heading = "Project Details";
    description = "This one's a banger";
  } else if (pathname.startsWith("/dashboard/lists/")) {
    heading = "List Details";
    description = "Someone's got taste";
  } else {
    // Default fallback
    heading = "Dashboard";
    description = "Where the magic happens";
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold tracking-wider">
        {heading}
      </h2>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
