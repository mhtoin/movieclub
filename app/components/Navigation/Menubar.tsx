import * as Ariakit from "@ariakit/react";
import Link from "next/link";

export default function Menubar() {
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
      <Ariakit.Menu
        gutter={10}
        className="relative gap-2 flex z-50 max-h-76 min-w-[180px] flex-col overflow-auto overscroll-contain rounded border bg-popoverbg p-5 border-white/15"
      >
        <Ariakit.MenuItem className="flex cursor-default scroll-m-1 items-center gap-1 rounded p-1 data-[active-item]:bg-primary active:bg-primary data-[data-active]:bg:primary data-[data-active]:py-2">
          <Link href={"/dashboard"}>Dashboard</Link>
        </Ariakit.MenuItem>
        <Ariakit.MenuItem className="flex cursor-default scroll-m-1 items-center gap-1 rounded p-1 data-[active-item]:bg-primary active:bg-primary data-[data-active]:bg:primary data-[data-active]:py-2">
          <Link href={"/home/shortlist"}>Shortlist</Link>
        </Ariakit.MenuItem>
        <Ariakit.MenuItem className="flex cursor-default ml-10 scroll-m-1 items-center gap-1 rounded p-1 data-[active-item]:bg-primary active:bg-primary data-[data-active]:bg:primary data-[data-active]:py-2">
          <Link href={"/home/shortlist"}>Edit</Link>
        </Ariakit.MenuItem>
        <Ariakit.MenuItem className="flex cursor-default ml-10 scroll-m-1 items-center gap-1 rounded p-1 data-[active-item]:bg-primary active:bg-primary data-[data-active]:bg:primary data-[data-active]:py-2">
          <Link href={"/home/shortlist"}>Watchlist</Link>
        </Ariakit.MenuItem>
        <Ariakit.MenuItem className="flex cursor-default scroll-m-1 items-center gap-1 rounded p-1 data-[active-item]:bg-primary active:bg-primary data-[data-active]:bg:primary data-[data-active]:py-2">
          <Link href={"/tierlists"}>Tierlists</Link>
        </Ariakit.MenuItem>
        <Ariakit.MenuItem className="flex cursor-default ml-10 scroll-m-1 items-center gap-1 rounded p-1 data-[active-item]:bg-primary active:bg-primary data-[data-active]:bg:primary data-[data-active]:py-2">
          <Link href={"/home/shortlist"}>Edit</Link>
        </Ariakit.MenuItem>
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  );
}
