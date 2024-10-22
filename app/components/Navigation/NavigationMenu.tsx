import { MenuItem, MenuStore, Menu } from "@ariakit/react";
import { useValidateSession } from "@/lib/hooks";
import Link from "next/link";
import { SEARCH_ROUTE } from "@/lib/globals";

export default function NavigationMenu({ menu }: { menu: MenuStore }) {
  const { data: session } = useValidateSession();
  return (
    <Menu
      gutter={10}
      className="menu z-[9999]"
      store={menu}
      onMouseLeave={() => menu.hide()}
    >
      <nav data-magnetic className="z-[9999]">
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
              <span className="menu-label">View all tierlists from users</span>
            </Link>
          </MenuItem>
          <MenuItem className="ml-6" store={menu}>
            <Link href={`/tierlists/${session?.id}`}>
              <span className="text-foreground">Edit</span>
              <span className="menu-label">Edit your tierlist</span>
            </Link>
          </MenuItem>
        </ul>
      </nav>
    </Menu>
  );
}
