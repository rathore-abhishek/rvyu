"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/actions/auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dashboard, List, SidebarOpen } from "../icons";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <SidebarOpen className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[340px] px-0 flex flex-col"
      >
        {/* Header with Logo */}
        <SheetHeader className="px-6 pb-4">
          <SheetTitle>
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <Image src="/logo.png" alt="Logo" width={36} height={36} />
              <span className="text-2xl font-serif font-semibold">rvyu.</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* User Profile Section */}
        {user && (
          <>
            <div className="px-6 py-4 bg-accent">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-background">
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                isActive("/dashboard")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Dashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/lists"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                isActive("/lists")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <List className="h-5 w-5" />
              <span>Lists</span>
            </Link>
          </div>

          {user && (
            <>
              <Separator className="my-4" />
              <div className="px-3">
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </form>
              </div>
            </>
          )}

          {!user && (
            <>
              <Separator className="my-4" />
              <div className="px-6">
                <Button asChild className="w-full" size="lg">
                  <Link href="/auth/login" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="text-primary font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
