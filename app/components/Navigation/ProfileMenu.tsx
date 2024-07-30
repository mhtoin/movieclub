"use client";
import * as Ariakit from "@ariakit/react";
import { Button } from "../ui/Button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import MenuItem from "./MenuItem";
import { Link } from "react-aria-components";
import { useState } from "react";

export default function ProfileMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menu = Ariakit.useMenuStore({ open, setOpen });
  return (
    <Ariakit.MenuProvider>
      <Ariakit.MenuButton
        className="relative w-12 h-12"
        store={menu}
        onMouseEnter={() => menu.show()}
      >
        <Image
          src={session?.user?.image || ""}
          alt="P"
          fill
          className="rounded-full"
        />
      </Ariakit.MenuButton>
      <Ariakit.Menu
        className="menu"
        shift={-70}
        gutter={10}
        onMouseLeave={() => menu.hide()}
        store={menu}
      >
        <nav data-magnetic>
          <ul>
            <MenuItem store={menu}>
              <Link href={"/dashboard"}>Profile</Link>
            </MenuItem>
            <MenuItem store={menu}>
              <Link href={"/logout"}>Logout</Link>
            </MenuItem>
          </ul>
        </nav>
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  );
}
