import { getUser } from "@/actions/user";
import { DashboardTabs } from "../../features/dashboard/components/tabs";
import { DashboardHeader } from "../../features/dashboard/components/header";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import Plus from "@/components/icons/plus";

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
              <LogIn />
            </EmptyMedia>
            <EmptyTitle>Authentication Required</EmptyTitle>
            <EmptyDescription>
              Please log in to view and manage your content.
            </EmptyDescription>
          </EmptyHeader>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/auth/login">
                <LogIn className="h-4 w-4" />
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
          <Button size="sm" asChild>
            <Link href="/dashboard/lists/create">
              <Plus />
              Create new list
            </Link>
          </Button>
        </div>
        <DashboardTabs />
        {children}
        {modal}
      </div>
    </div>
  );
};

export default DashboardLayout;
