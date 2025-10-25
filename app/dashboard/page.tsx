import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Mail, User, Hash } from "lucide-react";
import { logout } from "@/actions/auth";
import { SonnerTypes } from "@/components/common/sonner";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user.emailVerified) {
    redirect("/auth/login");
  }

  const { user } = session;
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <form action={logout}>
            <Button variant="destructive" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Name</span>
                </div>
                <p className="text-base pl-6">{user.name}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">Email</span>
                </div>
                <p className="text-base pl-6">{user.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  <span className="font-medium">User ID</span>
                </div>
                <p className="text-sm pl-6 font-mono">{user.id}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">Email Verified</span>
                </div>
                <p className="text-base pl-6">
                  {user.emailVerified ? (
                    <span className="text-green-600 dark:text-green-400">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="text-yellow-600 dark:text-yellow-400">
                      ⚠ Not Verified
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <SonnerTypes />
      </div>
    </div>
  );
}
