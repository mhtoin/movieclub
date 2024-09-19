import { getQueryClient } from "@/lib/getQueryClient";
import Filters from "./components/Filters";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import {
  getWatchProviders,
  searchMovies,
  getFilters,
} from "@/lib/movies/queries";

export default async function SearchLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["watchProviders"],
    queryFn: getWatchProviders,
  });

  await queryClient.prefetchInfiniteQuery({
    queryKey: [
      "search",
      "discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&watch_region=FI&release_date.gte=1900&release_date.lte=2023&vote_average.gte=0&vote_average.lte=10&with_watch_providers=8|119|323|337|384|1773",
    ],
    queryFn: async () => {
      return await searchMovies(1, "");
    },
    initialPageParam: 1,
  });

  await queryClient.prefetchQuery({
    queryKey: ["genres"],
    queryFn: getFilters,
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Filters />
        {children}
      </HydrationBoundary>
    </>
  );
}
