"use client";

import {
  Home,
  GitBranch,
  ContainerIcon,
  Layers,
  SquareStackIcon,
  TreePine,
  Share2,
  Hash,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
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

const items = [
  { title: "Array", url: "/array", icon: ContainerIcon },
  { title: "Linked List", url: "/linked-list", icon: GitBranch },
  { title: "Stack", url: "/stack", icon: SquareStackIcon },
  { title: "Queue", url: "/queue", icon: Layers },
  { title: "Binary Tree", url: "/binary-tree", icon: TreePine },
  { title: "Graph", url: "/graph", icon: Share2 },
  { title: "Hash Table", url: "/hash-table", icon: Hash },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Sidebar className="bg-white/90 dark:bg-black/80 backdrop-blur-lg border-r border-gray-200 dark:border-cyan-500/20 transition-colors duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-cyan-500/20">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
          Syntaxview
        </h1>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 dark:text-white/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "text-gray-600 dark:text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-700 dark:hover:text-white transition-colors",
                    pathname === "/" && "bg-cyan-500/15 text-cyan-700 dark:text-white"
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
          <SidebarGroupLabel className="text-gray-500 dark:text-white/60">
            Data Structures
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "text-gray-600 dark:text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-700 dark:hover:text-white transition-colors",
                      pathname === item.url &&
                        "bg-cyan-500/15 text-cyan-700 dark:text-white font-medium"
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

      {session?.user && (
        <div className="border-t border-gray-200 dark:border-cyan-500/20 p-4 space-y-2">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-700 dark:hover:text-white transition-colors w-full",
              pathname === "/settings" && "bg-cyan-500/15 text-cyan-700 dark:text-white"
            )}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {session.user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-800 dark:text-white">
                {session.user.name}
              </p>
              <p className="text-xs truncate text-gray-400 dark:text-white/50">
                {session.user.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Sidebar>
  );
};

export { AppSidebar };