import { getUser } from "@/actions/user";
import { FolderCode, List, Login, Plus } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DashboardHeader } from "@/features/dashboard/components/header";
import { DashboardTabs } from "@/features/dashboard/components/tabs";
import Link from "next/link";

const DashboardLayout = async ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  const user = await getUser();

  if (!user) {
    return (
      <div className="container mx-auto mt-6 mb-32 max-w-6xl px-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Login />
            </EmptyMedia>
            <EmptyTitle>Authentication Required</EmptyTitle>
            <EmptyDescription>
              Please log in to view and manage your content.
            </EmptyDescription>
          </EmptyHeader>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/auth/login">
                <Login className="h-4 w-4" />
                Log In
              </Link>
            </Button>
          </div>
        </Empty>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-6 mb-32 max-w-6xl space-y-8 px-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <DashboardHeader />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Plus />
                Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/projects/create"
                  className="flex items-center gap-2"
                >
                  <FolderCode className="h-4 w-4" />
                  New Project
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/lists/create"
                  className="flex items-center gap-2"
                >
                  <List className="h-4 w-4" />
                  New List
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DashboardTabs />
        {children}
        {modal}
      </div>
    </div>
  );
};

export default DashboardLayout;
