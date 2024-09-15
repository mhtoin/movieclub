import getQueryClient from "@/lib/getQueryClient";
import { searchMovies } from "@/lib/movies/queries";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function SearchLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  void queryClient.prefetchInfiniteQuery({
    queryKey: ["search", "with_watch_providers=8"],
    queryFn: async ({ pageParam = 1 }) => {
      return await searchMovies(pageParam, "with_watch_providers=8");
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, total_pages: totalPages } = lastPage;

      return page < totalPages ? page + 1 : undefined;
    },
    pages: 2,
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
      </HydrationBoundary>
    </>
  );
}