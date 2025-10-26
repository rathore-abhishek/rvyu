"use client";

import { FolderCode, List } from "@/components/icons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardTabs() {
  const pathname = usePathname();
  const activeTab = pathname.includes("/projects") ? "projects" : "lists";

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList>
        <TabsTrigger value="lists" asChild>
          <Link href="/dashboard/lists">
            <FolderCode className="h-4 w-4" />
            Lists
          </Link>
        </TabsTrigger>
        <TabsTrigger value="projects" asChild>
          <Link href="/dashboard/projects">
            <List className="h-4 w-4" />
            Projects
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
