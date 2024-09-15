import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import Shortlists from "@/app/components/Navigation/shortlist/Shortlists";
import { getAllShortlistsGroupedById } from "@/lib/shortlist";

export default async function ShortList() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["shortlists"],
    queryFn: getAllShortlistsGroupedById,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Shortlists />
    </HydrationBoundary>
  );
}
