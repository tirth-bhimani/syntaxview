"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-5xl h-16 flex items-center justify-between px-5 rounded-2xl bg-white/80 dark:bg-black/50 backdrop-blur-lg border border-gray-200 dark:border-cyan-500/20 shadow-sm dark:shadow-none transition-colors duration-300">
        <Link
          href="/"
          className="text-2xl font-black bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent"
        >
          Syntaxview
        </Link>

        <div className="flex flex-row items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-gray-700 dark:text-white hover:bg-cyan-500/10 focus:bg-cyan-500/10 data-[active]:bg-cyan-500/10 data-[state=open]:bg-cyan-500/10">
                  Data Structures
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-1 p-2 w-[200px] bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 shadow-lg">
                    {[
                      ["Array", "/array"],
                      ["Linked List", "/linked-list"],
                      ["Stack", "/stack"],
                      ["Queue", "/queue"],
                      ["Binary Tree", "/binary-tree"],
                      ["Graph", "/graph"],
                      ["Hash Table", "/hash-table"],
                    ].map(([label, href]) => (
                      <li key={href}>
                        <Link
                          href={href}
                          className="block select-none rounded-md px-3 py-2.5 text-sm font-medium leading-none text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Button
            asChild
            variant="ghost"
            className="text-gray-700 dark:text-white hover:bg-cyan-500/10"
          >
            <Link href="/">Home</Link>
          </Button>

          {status === "loading" ? (
            <div className="w-20 h-9 rounded-lg bg-gray-200 dark:bg-white/5 animate-pulse" />
          ) : session?.user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                {session.user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                className="text-gray-700 dark:text-white hover:bg-cyan-500/10"
              >
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
              >
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;