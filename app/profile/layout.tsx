"use client";
import { SessionProvider } from "next-auth/react";

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
