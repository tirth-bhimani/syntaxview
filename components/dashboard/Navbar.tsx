import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed inset-x-0 top-4 z-50 flex justify-center">
      <div className="w-full max-w-4xl h-16 flex items-center justify-between p-4 rounded-2xl bg-black/50 backdrop-blur-lg border border-cyan-500/20">
        <Link href="/" className="text-2xl font-black text-white">
          Syntaxview
        </Link>
        <div className="flex flex-row items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-cyan-500/10 focus:bg-cyan-500/10 data-[active]:bg-cyan-500/10 data-[state=open]:bg-cyan-500/10">
                  Data Structures
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-1 p-2 w-[200px] bg-white rounded-xl text-black">
                    <ListItem href="/array" title="Array" />
                    <ListItem href="/linked-list" title="Linked List" />
                    <ListItem href="/stack" title="Stack" />
                    <ListItem href="/queue" title="Queue" />
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Button
            asChild
            variant="ghost"
            className="text-white hover:bg-cyan-500/10 hover:text-white"
          >
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, ...props }, ref) => {
  return (
    <li>
      <NavigationMenu>
        <Link
          ref={ref}
          className={cn(
            "select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-200 focus:bg-gray-300 hover:text-black",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </Link>
      </NavigationMenu>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;