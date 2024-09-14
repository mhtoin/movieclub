import WatchlistContainer from "./components/WatchlistContainer";
import getQueryClient from "@/lib/getQueryClient";
import { getServerSession } from "next-auth";
import { getUserShortlist, getWatchlist } from "@/lib/utils";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export default async function Watchlist() {
  const queryClient = getQueryClient();
  const session = await getServerSession(authOptions);

  await queryClient.prefetchQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const data = await getWatchlist(session?.user);
      return data;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["shortlist", session?.user?.shortlistId],
    queryFn: async () => {
      return await getUserShortlist(session?.user?.shortlistId);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WatchlistContainer />
    </HydrationBoundary>
  );
}
