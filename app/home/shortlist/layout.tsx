"use client";

import ShortlistContainer from "./components/ShortlistContainer";



export default function SearchLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <ShortlistContainer />
      {children}
    </div>
  );
}
