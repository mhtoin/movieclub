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
    <>
      <Filters />
      {children}
    </>
  );
}
