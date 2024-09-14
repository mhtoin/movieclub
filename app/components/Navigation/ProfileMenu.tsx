"use client";
import * as Ariakit from "@ariakit/react";
import Image from "next/image";
import MenuItem from "./MenuItem";
import { Link } from "react-aria-components";
import { useState } from "react";
import { useValidateSession } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

export default function ProfileMenu() {
  const { data: user, status } = useValidateSession();
  const [open, setOpen] = useState(false);
  const menu = Ariakit.useMenuStore({ open, setOpen });
  return (
    <Ariakit.MenuProvider>
      <Ariakit.MenuButton
        className="relative w-12 h-12 border rounded-full overflow-hidden flex items-center justify-center"
        store={menu}
        onMouseEnter={() => menu.show()}
        onMouseLeave={() => menu.hide()}
      >
        {user && status === "success" ? (
          <Image src={user?.image || ""} alt="P" fill />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Ariakit.MenuButton>
      <Ariakit.Menu
        className="menu z-[9999]"
        shift={-70}
        gutter={10}
        onMouseLeave={() => menu.hide()}
        store={menu}
      >
        <nav data-magnetic className="z-[9999]">
          <ul>
            <MenuItem store={menu}>
              <Link href={"/dashboard"} className="text-lg text-foreground">
                Profile
              </Link>
            </MenuItem>
            <MenuItem store={menu}>
              <Link href={"/logout"} className="text-lg text-foreground">
                Logout
              </Link>
            </MenuItem>
          </ul>
        </nav>
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  );
}
