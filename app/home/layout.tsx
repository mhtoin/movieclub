"use client";

import Pusher from "pusher-js";
import { PusherPovider } from "./components/PusherProvider";

export default function HomeLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      });

      console.log('created connection')
  return (
    <PusherPovider pusher={pusher}>{children}</PusherPovider>
    );
}