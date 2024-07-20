import SearchModal from "@/app/components/search/SearchModal";
import { searchMovies } from "@/lib/utils";
import { getQueryClient } from "@/utils/provider";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default function Page() {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient!)}>
      <SearchModal />
    </HydrationBoundary>
  );
}
