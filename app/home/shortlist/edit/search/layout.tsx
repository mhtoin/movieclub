"use client";
import { SessionProvider } from "next-auth/react";
import Filters from "./components/Filters";
import ShortlistContainer from "./components/ShortlistContainer";

export default function SearchLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-5 z-10">
      <ShortlistContainer />
      <Filters />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 z-30">
        {children}
      </div>
    </div>
  );
}
