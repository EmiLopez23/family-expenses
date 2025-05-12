import { ChevronRight, Users } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { headers } from "next/headers";
import { cn } from "@/lib/utils";

export async function NavGroups({
  groups,
}: {
  groups: {
    name: string;
    href: string;
  }[];
}) {
  const headersList = await headers();
  const currentPath = headersList.get("x-current-path") ?? "";
  const isActive = (path: string) => currentPath === path;
  return (
    <SidebarMenu>
      <Collapsible asChild className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip="Grupos">
              <Users />
              <span>Grupos</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {groups?.map((subItem) => (
                <SidebarMenuSubItem key={subItem.name}>
                  <SidebarMenuSubButton
                    asChild
                    className={cn({
                      "bg-accent text-accent-foreground": isActive(
                        subItem.href
                      ),
                    })}
                  >
                    <Link href={subItem.href}>
                      <span>{subItem.name}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}
