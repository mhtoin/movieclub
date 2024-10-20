import SearchModal from "@/app/components/search/SearchModal";

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
