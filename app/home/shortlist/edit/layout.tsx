"use client";

import ShortlistContainer from "./search/components/ShortlistContainer";
import Filters from "./search/components/Filters";


export default function SearchLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-5 z-10">
      <ShortlistContainer />
      {children}
    </div>
  );
}
