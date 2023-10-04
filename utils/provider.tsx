"use client";

import { PusherPovider } from "@/utils/PusherProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Pusher from "pusher-js";
import { useState } from "react";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 0, cacheTime: 0 } } })
  );

  const [pusher] = useState(
    new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })
  );
  return (
    <QueryClientProvider client={client}>
      <PusherPovider pusher={pusher}>
      {children}
      </PusherPovider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;