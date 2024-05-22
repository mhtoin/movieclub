"use client";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { ShortlistDropdown } from "./ShortlistDropdown";
import { TierlistDropdown } from "./TierlistDropwdown";
import { Button } from "../ui/Button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/app/components/ui/NavigationMenu";
import { ListItem } from "./ListItem";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import SearchInput from "../search/SearchInput";
export const NavBar = () => {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  return (
    <div className="min-w-screen flex items-center justify-center py-10 px-2">
      <div className="w-full lg:w-9/12 h-[70px] p-5 border-[0.5px] rounded hidden justify-evenly items-center sm:flex border-slate-400">
        <a className="btn btn-ghost normal-case text-xl">leffaseura</a>
        <div className="flex flex-row justify-center items-center gap-3 w-full">
          <Link href="/home">
            <Button variant={"ghost"}>Home</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant={"ghost"}>Dashboard</Button>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Shortlist</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="flex flex-col p-5 w-[300px]">
                    <ListItem href="/home/shortlist" title="All">
                      All shortlists
                    </ListItem>
                    <ListItem href="/home/shortlist/edit/search" title="Search">
                      Search movies from differnt providers
                    </ListItem>
                    <ListItem
                      href="/home/shortlist/edit/watchlist"
                      title="Watchlist"
                    >
                      View your watchlist
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Tierlist</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="flex flex-col p-5 w-[300px]">
                    <ListItem href="/tierlists" title="All tierlists">
                      View the list of tierlists
                    </ListItem>
                    <ListItem
                      href={`/tierlists/${session?.user.userId}`}
                      title="Edit"
                    >
                      Edit your tierlist
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
            <SearchInput />
          </NavigationMenu>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-fit">
                <Avatar>
                  <AvatarImage src={session?.user?.image} alt="P" />
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex flex-col p-5 w-[200px]">
                  <ListItem href="/profile" title="Account">
                    View your account
                  </ListItem>
                  <ListItem href="/api/auth/signout" title="Sign out">
                    Sign out of the application
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};
