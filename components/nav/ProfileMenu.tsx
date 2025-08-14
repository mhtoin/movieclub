"use client"

import { useSocket, useSSE, useValidateSession } from "@/lib/hooks"
import * as Ariakit from "@ariakit/react"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Link } from "react-aria-components"
import styles from "./menu.module.css"
import MenuItem from "./MenuItem"

export default function ProfileMenu() {
  const { data: user, status } = useValidateSession()
  const [open, setOpen] = useState(false)
  const menu = Ariakit.useMenuStore({ open, setOpen })
  const { isConnected } = useSSE()

  return (
    <Ariakit.MenuProvider>
      <Ariakit.MenuButton
        className="relative flex h-12 w-12 items-center justify-center rounded-full border focus:outline-hidden"
        store={menu}
        onMouseEnter={() => menu.show()}
        onMouseLeave={() => menu.hide()}
      >
        {user && status === "success" ? (
          <Image
            src={user?.image || ""}
            alt="P"
            fill
            className="rounded-full object-cover"
          />
        ) : (
          <Loader2 className="animate-spin" />
        )}
        <div
          className={`absolute right-0 bottom-0 h-3 w-3 rounded-full ${
            isConnected ? "bg-success" : "bg-error"
          }`}
        />
      </Ariakit.MenuButton>
      <Ariakit.Menu
        className={`${styles.menu} z-9999 focus:outline-hidden`}
        shift={-60}
        gutter={12}
        onMouseLeave={() => menu.hide()}
        store={menu}
      >
        <nav data-magnetic className="z-9999">
          <ul>
            <MenuItem store={menu}>
              <Link href={"/profile"} className="text-foreground text-lg">
                Profile
              </Link>
            </MenuItem>
            <MenuItem store={menu}>
              <Link href={"/logout"} className="text-foreground text-lg">
                Logout
              </Link>
            </MenuItem>
          </ul>
        </nav>
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  )
}
