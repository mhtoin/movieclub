"use client";
import { SessionProvider } from "next-auth/react";
import { DndProvider } from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

export default function TierlistLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}
