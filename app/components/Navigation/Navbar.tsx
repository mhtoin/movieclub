"use client";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { ShortlistDropdown } from "./ShortlistDropdown";
import { TierlistDropdown } from "./TierlistDropwdown";
export const NavBar = () => {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  return (
    <div className="min-w-screen h-[70px] hidden justify-evenly bg-slate-800/30 items-center sm:flex border-b-[0.5px] border-slate-400">
      <a className="btn btn-ghost normal-case text-xl">leffaseura</a>
      <div className="flex flex-row justify-center gap-5">
        <Link href="/home">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <ShortlistDropdown />
        <TierlistDropdown />
      </div>
      <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img src={session?.user?.image} alt="P" />
        </div>
      </div>
    </div>
  );
};
