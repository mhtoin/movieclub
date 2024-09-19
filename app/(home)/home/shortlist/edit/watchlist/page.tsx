import WatchlistContainer from "./components/WatchlistContainer";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getUserShortlist, getWatchlist } from "@/lib/movies/queries";
import { getQueryClient } from "@/lib/getQueryClient";
import { validateRequest } from "@/lib/auth";
export default async function Watchlist() {
  const queryClient = getQueryClient();
  const { user, session } = await validateRequest();

  await queryClient.prefetchQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const data = await getWatchlist(user || null);
      return data;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["shortlist", user?.shortlistId],
    queryFn: async () => {
      return await getUserShortlist(user?.shortlistId || "");
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WatchlistContainer />
    </HydrationBoundary>
  );
}
