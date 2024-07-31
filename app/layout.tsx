import Providers from "@/utils/provider";
import "./globals.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Notification from "./components/Notification";
import MobileNavbar from "./home/components/MobileNavbar";
import { NextAuthProvider } from "@/utils/NextAuthProvider";

import RaffleDialog from "./components/RaffleDialog";
import { NavBar } from "./components/Navigation/Navbar";
import { Toaster } from "./components/ui/Toaster";
import { cookies } from "next/headers";

export const metadata = {
  title: "movieclub",
  description: "Th app for your long-distance movie club",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const monaspace = localFont({
  src: "../assets/fonts/MonaspaceNeonVarVF[wght,wdth,slnt].woff2",
  display: "swap",
});

export default function RootLayout({
  searchModal,
  children,
}: {
  searchModal?: React.ReactNode;
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const accent = cookieStore.get("accent");
  return (
    <html
      lang="en"
      className={theme ? theme.value : ""}
      data-accent={accent ? accent.value : ""}
    >
      <body
        className={`${inter.className} antialiased min-h-screen no-scrollbar relative`}
      >
        <Notification />
        <NextAuthProvider>
          <NavBar />
          <Toaster position="bottom-center" />
          <Providers>
            <RaffleDialog />
            {searchModal}
            {children}
            <MobileNavbar />
          </Providers>
        </NextAuthProvider>
      </body>
    </html>
  );
}
