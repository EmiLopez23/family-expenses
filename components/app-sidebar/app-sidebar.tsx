import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { NavUser } from "./nav-user";
import { BookUser } from "lucide-react";
import { NavGroups } from "./nav-groups";
import { NavMain } from "./nav-main";
import { NavHeader } from "./nav-header";

const data = {
  groups: [
    {
      name: "Familia Lopez",
      href: "/familia-lopez",
    },
  ],
  navMain: [
    {
      title: "Mis gastos",
      href: "/",
      icon: BookUser,
    },
  ],
};

export async function AppSidebar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="gap-1">
          <NavMain items={data.navMain} />
          <NavGroups groups={data.groups} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
