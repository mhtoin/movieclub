import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { NavBar } from "../components/Navigation/Navbar";
import ReplaceDialog from "../components/search/ReplaceDialog";

export default function HomeLayout({
  searchModal,
  children,
}: {
  searchModal: React.ReactNode;
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const accent = cookieStore.get("accent");
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
