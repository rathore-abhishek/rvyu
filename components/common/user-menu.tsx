"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/actions/auth";
import Link from "next/link";
import { Logout, User } from "../icons";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || user.email[0].toUpperCase();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0"
          aria-label="User menu"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback className="text-sm">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            size="sm"
            asChild
          >
            <Link href="/dashboard">
              <User className="mr-2" />
              Profile
            </Link>
          </Button>
          <form action={logout}>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/8"
              size="sm"
              type="submit"
            >
              <Logout className="mr-2" />
              Logout
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
