"use client";
import { SessionProvider } from "next-auth/react";

export default function ProfileLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    children
  );
}
