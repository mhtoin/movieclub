import * as Ariakit from "@ariakit/react";
import Link from "next/link";
import { useState } from "react";

export default function Menubar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Ariakit.MenuProvider>
      <Ariakit.MenuButton>
        {/* Hamburger icon */}
        <div className="flex flex-col gap-1">
          <div className="w-6 h-1 bg-white rounded" />
          <div className="w-6 h-1 bg-white rounded"></div>
          <div className="w-6 h-1 bg-white rounded"></div>
        </div>
      </Ariakit.MenuButton>
      <Ariakit.Menu gutter={10} className="menu">
        <Ariakit.MenuItem className="menu-item">
          <Link href={"/dashboard"}>Dashboard</Link>
          <span className="text-xs text-white/50">View stats</span>
        </Ariakit.MenuItem>
        <Ariakit.MenuItem className="menu-item">
          <Link href={"/home/shortlist"}>Shortlist</Link>
          <span className="text-xs text-white/50">
            View all shortlists from users
          </span>
        </Ariakit.MenuItem>
        <Ariakit.MenuItem className="menu-item menu-item-inner">
          <div className="column">
            <Link href={"/home/shortlist"}>Search</Link>
            <span className="text-xs text-white/50">Search for movies</span>
          </div>
        </Ariakit.MenuItem>
        <Ariakit.MenuItem className="menu-item menu-item-inner">
          <div className="column">
            <Link href={"/home/shortlist"}>Watchlist</Link>
            <span className="text-xs text-white/50">View your watchlist</span>
          </div>
        </Ariakit.MenuItem>
        <Ariakit.MenuItem className="menu-item">
          <Link href={"/tierlists"}>Tierlists</Link>
          <span className="text-xs text-white/50">
            View all tierlists from users
          </span>
        </Ariakit.MenuItem>
        <Ariakit.MenuItem className="menu-item menu-item-inner">
          <div className="column">
            <Link href={"/home/shortlist"}>Edit</Link>
            <span className="text-xs text-white/50">Edit your tierlist</span>
          </div>
        </Ariakit.MenuItem>
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  );
}
