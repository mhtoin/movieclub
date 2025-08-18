"use client"
import { SEARCH_ROUTE } from "@/lib/globals"
import { useIsMobile, useMagneticHover, useValidateSession } from "@/lib/hooks"
import * as Ariakit from "@ariakit/react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "../ui/Button"
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/Drawer"
import HamburgerMenu from "./HamburgerMenu"
import styles from "./menu.module.css"
import MenuItem from "./MenuItem"

export default function Menubar() {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()
  const menu = Ariakit.useMenuStore({ open, setOpen })
  const { data: user } = useValidateSession()

  const navRef = useMagneticHover()

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
              className="flex flex-col border-b p-2"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">Home</span>
              <span className={styles["menu-label"]}>View home page</span>
            </Link>
            <Link
              href={"/dashboard"}
              className="flex flex-col border-b p-2"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">Dashboard</span>
              <span className={styles["menu-label"]}>View stats</span>
            </Link>
            <Link
              href={"/history"}
              className="flex flex-col border-b p-2"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">History</span>
              <span className={styles["menu-label"]}>View watch history</span>
            </Link>
            <Link
              href={"/home/shortlist"}
              className="flex flex-col border-b p-2"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">Shortlist</span>
              <span className={styles["menu-label"]}>View all shortlists</span>
            </Link>
            <Link
              href={`/home/${SEARCH_ROUTE}`}
              className="ml-5 flex flex-col border-b p-2"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">Discover</span>
              <span className={styles["menu-label"]}>Discover movies</span>
            </Link>
            <Link
              href={"/home/shortlist/edit/watchlist"}
              className="ml-5 flex flex-col border-b p-2"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">Watchlist</span>
              <span className={styles["menu-label"]}>View your watchlist</span>
            </Link>
            <Link
              href={"/tierlists"}
              className="flex flex-col border-b p-2"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">Tierlists</span>
              <span className={styles["menu-label"]}>
                View all tierlists from users
              </span>
            </Link>
            <Link
              href={`/tierlists/${user?.id}`}
              className="ml-5 flex flex-col border-b p-2"
              onClick={() => setOpen(false)}
            >
              <span className="text-foreground">Edit</span>
              <span className={styles["menu-label"]}>Edit your tierlist</span>
            </Link>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Ariakit.MenuProvider>
      <Ariakit.MenuButton
        store={menu}
        onMouseEnter={() => menu.show()}
        onMouseLeave={() => menu.hide()}
        className="focus:outline-hidden"
      >
        <HamburgerMenu open={open} />
      </Ariakit.MenuButton>

      <Ariakit.Menu
        gutter={10}
        className={`${styles.menu} z-9999 focus:outline-hidden`}
        store={menu}
        onMouseLeave={() => menu.hide()}
      >
        <nav data-magnetic className="z-9999" ref={navRef}>
          <ul>
            <MenuItem store={menu} className="group">
              <Link href={"/home"}>
                <span className="text-foreground group-[&:hover]:text-accent-foreground">
                  Home
                </span>
                <span className={styles["menu-label"]}>View home page</span>
              </Link>
            </MenuItem>
            <MenuItem store={menu} className="group">
              <Link href={"/dashboard"}>
                <span className="text-foreground group-[&:hover]:text-accent-foreground">
                  Dashboard
                </span>
                <span className={styles["menu-label"]}>View stats</span>
              </Link>
            </MenuItem>
            <MenuItem store={menu} className="group">
              <Link href={"/history"}>
                <span className="text-foreground group-[&:hover]:text-accent-foreground">
                  History
                </span>
                <span className={styles["menu-label"]}>View watch history</span>
              </Link>
            </MenuItem>
            <MenuItem store={menu} className="group">
              <Link href={"/home/shortlist"}>
                <span className="text-foreground group-[&:hover]:text-accent-foreground">
                  Shortlist
                </span>
                <span className={styles["menu-label"]}>
                  View all shortlists
                </span>
              </Link>
            </MenuItem>
            <MenuItem className="ml-6 group" store={menu}>
              <Link href={`/home/${SEARCH_ROUTE}`}>
                <span className="text-foreground group-[&:hover]:text-accent-foreground">
                  Discover
                </span>
                <span className={styles["menu-label"]}>Discover movies</span>
              </Link>
            </MenuItem>
            <MenuItem className="ml-6 group" store={menu}>
              <Link href={"/home/shortlist/edit/watchlist"}>
                <span className="text-foreground group-[&:hover]:text-accent-foreground">
                  Watchlist
                </span>
                <span className={styles["menu-label"]}>
                  View your watchlist
                </span>
              </Link>
            </MenuItem>
            <MenuItem store={menu} className="group">
              <Link href={"/tierlists"}>
                <span className="text-foreground group-[&:hover]:text-accent-foreground">
                  Tierlists
                </span>
                <span className={styles["menu-label"]}>
                  View all tierlists from users
                </span>
              </Link>
            </MenuItem>
            <MenuItem className="ml-6 group" store={menu}>
              <Link href={`/tierlists/${user?.id}`}>
                <span className="text-foreground group-[&:hover]:text-accent-foreground">
                  Edit
                </span>
                <span className={styles["menu-label"]}>Edit your tierlist</span>
              </Link>
            </MenuItem>
          </ul>
        </nav>
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  )
}
