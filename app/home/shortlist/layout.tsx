import { getServerSession } from "next-auth";
import ShortlistContainer from "./components/ShortlistContainer";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAllShortlistsGroupedById, getUserShortlist } from "@/lib/utils";
import getQueryClient from "@/lib/getQueryClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
export default async function ShortlistLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  /*
  const session = await getServerSession(authOptions);
  await queryClient.prefetchQuery({
    queryKey: ["shortlist", session?.user?.shortlistId],
    queryFn: async () => {
      return getUserShortlist(session?.user?.shortlistId)
    },
  });*/

  await queryClient.prefetchQuery({
    queryKey: ["shortlists"],
    queryFn: getAllShortlistsGroupedById,
  });
  return (
    <div className="pt-20">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ShortlistContainer />
        {children}
      </HydrationBoundary>
    </div>
  );
}
