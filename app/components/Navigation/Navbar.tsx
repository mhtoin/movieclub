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
import SearchButton from "../search/SearchButton";
import Menubar from "./Menubar";
import MagneticNav from "./MagneticNav";
import ProfileMenu from "./ProfileMenu";
export const NavBar = () => {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  return (
    <div className="min-w-screen flex items-center justify-center border-b p-2">
      <div className="w-full lg:w-9/12 h-[70px] p-5 rounded hidden sm:flex justify-between items-center">
        {/**Right side */}
        <div className="flex items-center justify-center gap-5">
          {<Menubar />}
          <span className="font-bold">leffaseura</span>
        </div>
        <div className="flex gap-10 h-full items-center">
          <SearchButton />
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
};
