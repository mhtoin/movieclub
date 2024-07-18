import SearchModal from "@/app/components/search/SearchModal";
import { searchMovies } from "@/lib/utils";
import { getQueryClient } from "@/utils/getQueryClient";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default function Page() {
  const queryClient = getQueryClient();

  void queryClient?.prefetchInfiniteQuery({
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
    <HydrationBoundary state={dehydrate(queryClient!)}>
      <SearchModal />
    </HydrationBoundary>
  );
}
