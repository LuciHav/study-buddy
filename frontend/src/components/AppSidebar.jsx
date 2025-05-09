import {
  ChevronUp,
  GraduationCap,
  Home,
  MessageSquareWarning,
  Newspaper,
  User2,
  Mail,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useAuth from "@/contexts/AuthProvider";
import { NavLink, useNavigate } from "react-router";
import Logo from "./Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Tutors",
    url: "/admin/tutors",
    icon: GraduationCap,
  },
  {
    title: "Posts",
    url: "/admin/posts",
    icon: Newspaper,
  },
  {
    title: "Report",
    url: "/admin/reports",
    icon: MessageSquareWarning,
  },
  {
    title: "Contacts",
    url: "/admin/contacts",
    icon: Mail,
  },
];

export function AppSidebar() {
  const { currentUser, clearUser } = useAuth();
  const navigate = useNavigate();

  function handleNavigateToProfile() {
    navigate("/admin/profile");
  }

  function handleSignout() {
    clearUser();
    navigate("/login");
  }
  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {currentUser.firstName + " " + currentUser.lastName}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem
                  onClick={handleNavigateToProfile}
                  className="cursor-pointer"
                >
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignout}
                  className="cursor-pointer"
                >
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
