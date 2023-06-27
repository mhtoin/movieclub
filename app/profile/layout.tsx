"use client";
import { SessionProvider } from "next-auth/react";
import NavBar from "./components/NavBar";
import { getColours } from "./shortlist/edit/actions/actions";
import Navigation from "./components/Navigation";

export default async function ProfileLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
