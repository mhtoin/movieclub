"use client"

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import RaffleResultModal from "./RaffleResultModal";
import RaffleResultCard from "./RaffleResultCard";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  });


export default function RaffleNotification() {
    const [open, setOpen] = useState(false)
    const [notification, setNotification] = useState<RaffleNotification>();

    useEffect(() => {
        const channel = pusher.subscribe("movieclub-raffle");
    
        channel.bind("result", (data: RaffleNotification) => {
          console.log("received data from pusher", data);
          setNotification(data);
          setOpen(true)
        });
    
        return () => {
          pusher.unsubscribe("movieclub-raffle");
        };
      }, [notification]);
    
      console.log('notification modal')
      return (
        <RaffleResultModal open={open}>
        {notification ? (
            <div className="flex flex-col items-center gap-5">
                <h1 className="text-xl font-bold">{notification.message}</h1>
                <RaffleResultCard chosenMovie={notification.data!} />
            </div>
          
        ) : (
          <div>
            <p>{notification}</p>
          </div>
        )}
        <div className="modal-action">
          {/* closes the modal */}
          <button className="btn btn-primary" onClick={() => setOpen(!open)}>
            Close
          </button>
        </div>
      </RaffleResultModal>
      )
}