"use client";
import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export default function Notification() {
  const [notifications, setNotifications] = useState<RaffleNotification[]>([]);
  useEffect(() => {
    const channel = pusher.subscribe("movieclub-raffle");

    channel.bind("result", (data: RaffleNotification) => {
      setNotifications([...notifications, data]);
    });

    return () => {
      pusher.unsubscribe("raffle");
    };
  }, [notifications]);

  return (
    <div className="flex flex-col items-center gap-5">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>{notification.message}</li>
        ))}
      </ul>
      <button className="btn">Start</button>
    </div>
  );
}
