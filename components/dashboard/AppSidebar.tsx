"use client";

import { Home, Code, GitBranch, ContainerIcon, Layers, SquareStackIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

// Menu items.
const items = [
  {
    title: "Array",
    url: "/array",
    icon: ContainerIcon,
  },
  {
    title: "Linked List",
    url: "/linked-list",
    icon: GitBranch,
  },
  {
    title: "Stack",
    url: "/stack",
    icon: SquareStackIcon,
  },
  {
    title: "Queue",
    url: "/queue",
    icon: Layers,
  },
];

const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="bg-black/80 backdrop-blur-lg border-r border-cyan-500/20">
      <div className="p-4 border-b border-cyan-500/20">
        <h1 className="text-2xl font-bold text-white text-center">Syntaxview</h1>
      </div>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel className="text-white/80">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                        "text-gray-300 hover:bg-cyan-500/10 hover:text-white transition-colors",
                        pathname === "/" && "bg-cyan-500/20 text-white"
                    )}
                  >
                    <Link href="/">
                      <Home className="h-5 w-5" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80">Data Structures</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "text-gray-300 hover:bg-cyan-500/10 hover:text-white transition-colors",
                      pathname === item.url && "bg-cyan-500/20 text-white"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
export { AppSidebar };