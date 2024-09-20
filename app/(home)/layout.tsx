import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { NavBar } from "../components/Navigation/Navbar";
import ReplaceDialog from "../components/search/ReplaceDialog";
import { getAllShortlistsGroupedById } from "@/lib/shortlist";
import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SocketClient } from "../components/common/SocketClient";
import Chat from "../components/common/Chat";

export default async function HomeLayout({
  searchModal,
  children,
}: {
  searchModal: React.ReactNode;
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const accent = cookieStore.get("accent");

  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["shortlists"],
    queryFn: getAllShortlistsGroupedById,
  });
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NavBar
          theme={theme as { value: string; name: string }}
          accent={accent as { value: string; name: string }}
        />
        <SocketClient />

        <Toaster position="top-center" />
        <ReplaceDialog />
        {searchModal}

        {children}
      </HydrationBoundary>
    </>
  );
}
