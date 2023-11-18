import { getServerSession } from "next-auth";
import ShortlistContainer from "./components/ShortlistContainer";
import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getUserShortlist } from "@/lib/utils";
import getQueryClient from "@/lib/getQueryClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
export default async function ShortlistLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  const session = await getServerSession(authOptions);
  await queryClient.prefetchQuery({
    queryKey: ["shortlist", session?.user?.shortlistId],
    queryFn: async () => {
      return getUserShortlist(session?.user?.shortlistId)
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ['otherShortlists'],
    queryFn: async () => {
      const res = await fetch(`/api/shortlists`)
      const data = await res.json()
      return data
    }
  })
  return (
    <div className="">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ShortlistContainer />
        {children}
      </HydrationBoundary>
    </div>
  );
}
