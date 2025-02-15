"use client";
import * as Ariakit from "@ariakit/react";
import Link from "next/link";
import { useState } from "react";
import MenuItem from "./MenuItem";
import HamburgerMenu from "./HamburgerMenu";
import { useIsMobile, useMagneticHover, useValidateSession } from "@/lib/hooks";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/Drawer";
import { Button } from "../ui/Button";
import { SEARCH_ROUTE } from "@/lib/globals";

export default function Menubar() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const menu = Ariakit.useMenuStore({ open, setOpen });
  const { data: user, status } = useValidateSession();

  const navRef = useMagneticHover();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onTouchStart={() => setOpen(true)}
          >
            <HamburgerMenu open={open} />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="flex flex-col gap-4 p-5 pb-10">
            <Link
              href={"/home"}
              className="flex flex-col p-2 border-b"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">Home</span>
              <span className="menu-label">View home page</span>
            </Link>
            <Link
              href={"/dashboard"}
              className="flex flex-col p-2 border-b"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">Dashboard</span>
              <span className="menu-label">View stats</span>
            </Link>
            <Link
              href={"/home/shortlist"}
              className="flex flex-col p-2 border-b"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">Shortlist</span>
              <span className="menu-label">View all shortlists</span>
            </Link>
            <Link
              href={`/home/${SEARCH_ROUTE}`}
              className="flex flex-col ml-5 p-2 border-b"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">Search</span>
              <span className="menu-label">Search for movies</span>
            </Link>
            <Link
              href={"/home/shortlist/edit/watchlist"}
              className="flex flex-col ml-5 p-2 border-b"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">Watchlist</span>
              <span className="menu-label">View your watchlist</span>
            </Link>
            <Link
              href={"/tierlists"}
              className="flex flex-col p-2 border-b"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">Tierlists</span>
              <span className="menu-label">View all tierlists from users</span>
            </Link>
            <Link
              href={`/tierlists/${user?.tierlistId}`}
              className="flex flex-col ml-5 p-2 border-b"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">Edit</span>
              <span className="menu-label">Edit your tierlist</span>
            </Link>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Ariakit.MenuProvider>
      <Ariakit.MenuButton
        store={menu}
        onMouseEnter={() => menu.show()}
        onMouseLeave={() => menu.hide()}
        className="focus:outline-none"
      >
        <HamburgerMenu open={open} />
      </Ariakit.MenuButton>

      <Ariakit.Menu
        gutter={10}
        className="menu z-[9999] focus:outline-none"
        store={menu}
        onMouseLeave={() => menu.hide()}
      >
        <nav data-magnetic className="z-[9999]" ref={navRef}>
          <ul>
            <MenuItem store={menu}>
              <Link href={"/home"}>
                <span className="text-foreground">Home</span>
                <span className="menu-label">View home page</span>
              </Link>
            </MenuItem>
            <MenuItem store={menu}>
              <Link href={"/dashboard"}>
                <span className="text-foreground">Dashboard</span>
                <span className="menu-label">View stats</span>
              </Link>
            </MenuItem>
            <MenuItem store={menu}>
              <Link href={"/home/shortlist"}>
                <span className="text-foreground">Shortlist</span>
                <span className="menu-label">View all shortlists</span>
              </Link>
            </MenuItem>
            <MenuItem className="ml-6 " store={menu}>
              <Link href={`/home/${SEARCH_ROUTE}`}>
                <span className="text-foreground">Search</span>
                <span className="menu-label">Search for movies</span>
              </Link>
            </MenuItem>
            <MenuItem className="ml-6" store={menu}>
              <Link href={"/home/shortlist/edit/watchlist"}>
                <span className="text-foreground">Watchlist</span>
                <span className="menu-label">View your watchlist</span>
              </Link>
            </MenuItem>
            <MenuItem store={menu}>
              <Link href={"/tierlists"}>
                <span className="text-foreground">Tierlists</span>
                <span className="menu-label">
                  View all tierlists from users
                </span>
              </Link>
            </MenuItem>
            <MenuItem className="ml-6" store={menu}>
              <Link href={`/tierlists/${user?.tierlistId}`}>
                <span className="text-foreground">Edit</span>
                <span className="menu-label">Edit your tierlist</span>
              </Link>
            </MenuItem>
          </ul>
        </nav>
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  );
}
