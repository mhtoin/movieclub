"use client";

import getQueryClient from "@/lib/getQueryClient";
import { PusherPovider } from "@/utils/PusherProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Pusher from "pusher-js";
import { useState } from "react";

function Providers({ children }: React.PropsWithChildren) {
  const client = getQueryClient();

  const [pusher] = useState(
    new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })
  );
  return (
    <QueryClientProvider client={client}>
      <PusherPovider pusher={pusher}>{children}</PusherPovider>
      {<ReactQueryDevtools initialIsOpen={false} position="top" />}
    </QueryClientProvider>
  );
}

export default Providers;
