import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import Shortlists from "@/app/components/shortlist/Shortlists";
import { getAllShortlistsGroupedById } from "@/lib/shortlist";
import { getQueryClient } from "@/lib/getQueryClient";
import { getCurrentSession } from "@/lib/authentication/session";
import { redirect } from "next/navigation";

export default async function ShortList() {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }
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
