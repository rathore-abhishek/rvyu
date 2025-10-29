import { getUser } from "@/actions/user";
import { Login, Mail } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DashboardCreateMenu } from "@/features/dashboard/components/dashboard-create-menu";
import { DashboardHeader } from "@/features/dashboard/components/header";
import { DashboardTabs } from "@/features/dashboard/components/tabs";
import Link from "next/link";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
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

  if (!user.emailVerified) {
    return (
      <div className="container mx-auto mt-6 mb-32 max-w-6xl px-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Mail />
            </EmptyMedia>
            <EmptyTitle>Email Verification Required</EmptyTitle>
            <EmptyDescription>
              Please verify your email address to access the dashboard. Check
              your inbox for the verification link. If you haven&apos;t received
              it, login again.
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
          <DashboardCreateMenu />
        </div>
        <DashboardTabs />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
