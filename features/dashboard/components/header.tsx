"use client";

import { usePathname } from "next/navigation";

export function DashboardHeader() {
  const pathname = usePathname();
  const isProjectsPage = pathname.includes("/projects");

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold tracking-wider">
        {isProjectsPage ? "Your Projects" : "Your Lists"}
      </h2>
      <p className="text-muted-foreground text-sm">
        {isProjectsPage
          ? "View all your submitted projects"
          : "Manage your review lists"}
      </p>
    </div>
  );
}
