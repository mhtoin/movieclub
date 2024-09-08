import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import AllShortlistsContainer from "./components/AllShortlistsContainer";
import getQueryClient from "@/lib/getQueryClient";
import { getAllShortlistsGroupedById } from "@/lib/utils";
import Shortlists from "@/app/components/Navigation/shortlist/Shortlists";

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
