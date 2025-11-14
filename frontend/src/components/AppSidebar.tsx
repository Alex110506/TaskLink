import {
  Home,
  Users,
  Map,
  CheckSquare,
  User,
  Briefcase,
  FileText,
  PlusSquare,
  Bot,
  Building,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AccountType } from "@/lib/utils";

// --------------------------
// HARDCODED TOGGLE
// Schimbă între true / false
// trb legat la login cel mai prob un const din app
// --------------------------
interface SidebarLayoutProps {
  accountType: AccountType
}

const userMenuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Chat", url: "/team", icon: Users },
  { title: "Map", url: "/map", icon: Map },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "AI CV Builder", url: "/ai-cv-builder", icon: Bot },
  { title: "Profile", url: "/profile", icon: User },
];

const businessMenuItems = [
  { title: "Home", url: "/business/home", icon: Building },
  { title: "Chat", url: "/business/chat", icon: Users },
  { title: "Post Job Offer", url: "/business/post-job", icon: FileText },
  { title: "Create Task", url: "/business/create-task", icon: PlusSquare },
  { title: "Tasks", url: "/business/tasks", icon: CheckSquare },
  { title: "Profile", url: "/business/profile", icon: Briefcase },
];

export function AppSidebar({ accountType }: SidebarLayoutProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-semibold uppercase tracking-wider mb-2">
            <NavLink to="/landing">TaskLink</NavLink>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* PERSONAL USER MENU */}
        {accountType === "personal" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-primary text-xs font-semibold uppercase tracking-wider mt-4 mb-2">
              User
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "hover:bg-sidebar-accent/50"
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* BUSINESS USER MENU */}
        {accountType === "business" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-accent text-xs font-semibold uppercase tracking-wider mt-4 mb-2">
              Business
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {businessMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "hover:bg-sidebar-accent/50"
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
