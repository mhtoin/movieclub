import getQueryClient from "@/lib/getQueryClient";
import Filters from "./components/Filters";
import { getFilters, getWatchProviders, searchMovies } from "@/lib/utils";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function SearchLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["watchProviders"],
    queryFn: async () => getWatchProviders(),
  });

  await queryClient.prefetchQuery({
    queryKey: [
      "search",
      "discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&watch_region=FI&release_date.gte=1900&release_date.lte=2023&vote_average.gte=0&vote_average.lte=10&with_watch_providers=8|119|323|337|384|1773",
    ],
    queryFn: async () => searchMovies(1, ""),
  });

  await queryClient.prefetchQuery({
    queryKey: ["genres"],
    queryFn: getFilters,
  });

  return (
    <>
    <HydrationBoundary state={dehydrate(queryClient)} >
      <Filters />
      {children}
      </HydrationBoundary>
    </>
  );
}
