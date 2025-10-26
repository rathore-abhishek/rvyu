"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, FileCode } from "lucide-react";

export function DashboardTabs() {
  const pathname = usePathname();
  const activeTab = pathname.includes("/projects") ? "projects" : "lists";

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList>
        <TabsTrigger value="lists" asChild>
          <Link href="/dashboard/lists">
            <Folder className="h-4 w-4" />
            Lists
          </Link>
        </TabsTrigger>
        <TabsTrigger value="projects" asChild>
          <Link href="/dashboard/projects">
            <FileCode className="h-4 w-4" />
            Projects
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
