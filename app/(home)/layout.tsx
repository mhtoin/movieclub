import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { NavBar } from "../components/Navigation/Navbar";
import ReplaceDialog from "../components/search/ReplaceDialog";
import getQueryClient from "@/lib/getQueryClient";
import RaffleDialog from "../components/raffle/RaffleDialog";
import { getAllShortlistsGroupedById } from "@/lib/shortlist";

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

  await queryClient.prefetchQuery({
    queryKey: ["shortlists"],
    queryFn: getAllShortlistsGroupedById,
  });
  return (
    <>
      <NavBar
        theme={theme as { value: string; name: string }}
        accent={accent as { value: string; name: string }}
      />
      <Toaster position="top-center" />

      <ReplaceDialog />
      {searchModal}
      {children}
    </>
  );
}
