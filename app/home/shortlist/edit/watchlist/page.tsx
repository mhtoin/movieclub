import WatchlistContainer from "./components/WatchlistContainer";
import getQueryClient from "@/lib/getQueryClient";
import { getServerSession } from "next-auth";
import { getWatchlist } from "@/lib/utils";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function Watchlist() {
  const queryClient = getQueryClient();
  const session = await getServerSession();
  await queryClient.prefetchQuery({
    queryKey: ["watchlist"],
    queryFn: async () => getWatchlist(session?.user),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WatchlistContainer />
    </HydrationBoundary>
  );
}
