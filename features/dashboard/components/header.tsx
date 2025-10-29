"use client";

import { usePathname } from "next/navigation";

export function DashboardHeader() {
  const pathname = usePathname();

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold tracking-wider">
        {pathname.startsWith("/dashboard/projects") ? "Projects" : "Lists"}
      </h2>
      <p className="text-muted-foreground text-sm">
        {pathname.startsWith("/dashboard/projects") ? (
          <>
            Look at your{" "}
            <span className="font-serif tracking-wider italic"> amazing </span>
            projects
          </>
        ) : (
          <>
            Your <span className="font-serif tracking-wider italic">taste</span>{" "}
            looks good
          </>
        )}
      </p>
    </div>
  );
}
