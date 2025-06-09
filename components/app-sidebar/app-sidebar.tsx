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
import { BookUser, Plus, Tags } from "lucide-react";
import { NavGroups } from "./nav-groups";
import { NavMain } from "./nav-main";
import { NavHeader } from "./nav-header";
import { fetchUserGroups } from "@/lib/data";
import ExpenseCreatorDialog from "../expenses/create/dialog";

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
    {
      title: "Tags",
      href: "/tags",
      icon: Tags,
    },
  ],
};

export async function AppSidebar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const groups = await fetchUserGroups();
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="gap-1">
          <ExpenseCreatorDialog />
          <NavMain items={data.navMain} />
          <NavGroups groups={groups} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
