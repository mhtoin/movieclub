import Providers from "@/utils/provider";
import "./globals.css";
import { inter } from "@/app/fonts";
import Notification from "./components/Notification";
import MobileNavbar from "./home/components/MobileNavbar";
import { NextAuthProvider } from "@/utils/NextAuthProvider";

import RaffleDialog from "./components/RaffleDialog";
import { NavBar } from "./components/Navigation/Navbar";
import { Toaster } from "./components/ui/Toaster";

export const metadata = {
  title: "movieclub",
  description: "Th app for your long-distance movie club",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased min-h-screen no-scrollbar`}
      >
        <Notification />
        <NextAuthProvider>
          <NavBar />
          <div>
            <Toaster position="bottom-center" />
          </div>
          <Providers>
            <RaffleDialog />
            {children}
            <MobileNavbar />
          </Providers>
        </NextAuthProvider>
      </body>
    </html>
  );
}
