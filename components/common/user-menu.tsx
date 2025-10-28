"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/actions/auth";
import { Logout, User } from "../icons";
import { ProfileDialog } from "@/components/profile/profile-dialog";

interface UserMenuProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    bio?: string | null;
    github?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
    peerlist?: string | null;
    portfolio?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || user.email[0].toUpperCase();

  return (
    <>
      <ProfileDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        user={user}
      />
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
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
            <p className="text-sm leading-none font-medium">{user.name}</p>
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </div>
        </div>
        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            size="sm"
            onClick={() => {
              setPopoverOpen(false);
              setProfileOpen(true);
            }}
          >
            <User className="mr-2" />
            Profile
          </Button>
          <form action={logout}>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/8 w-full justify-start"
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
    </>
  );
}
