"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@supabase/auth-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function NavUser({ user }: { user: User | null }) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
    router.refresh();
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar user={user} />
              <UserInfo user={user} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar user={user} />
                <UserInfo user={user} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

const UserAvatar = ({ user }: { user: User | null }) => {
  const initials = user?.user_metadata.full_name
    ?.split(" ")
    .map((name: string) => name[0])
    .join("");

  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage
        src={user?.user_metadata.avatar_url}
        alt={user?.user_metadata.full_name}
      />
      <AvatarFallback className="uppercase text-center text-sidebar-accent-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

const UserInfo = ({ user }: { user: User | null }) => {
  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-semibold">
        {user?.user_metadata.full_name}
      </span>
      <span className="truncate text-xs">{user?.email}</span>
    </div>
  );
};
