import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import Shortlists from "@/app/components/Navigation/shortlist/Shortlists";
import { getAllShortlistsGroupedById } from "@/lib/shortlist";
import { getQueryClient } from "@/lib/getQueryClient";

export default async function ShortList() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["shortlists"],
    queryFn: getAllShortlistsGroupedById,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Shortlists />
    </HydrationBoundary>
  );
}
