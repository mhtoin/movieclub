import Providers from "@/utils/provider";
import "./globals.css";
import { inter } from "@/app/fonts";
import Notification from "./components/Notification";
import MobileNavbar from "./home/components/MobileNavbar";
import { NextAuthProvider } from "@/utils/NextAuthProvider";

import RaffleDialog from "./components/RaffleDialog";
import { Toaster } from "react-hot-toast";
import { NavBar } from "./components/Navigation/Navbar";

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
        className={`${inter.className} antialiased min-h-screen bg-black no-scrollbar`}
      >
        <Notification />
        <NextAuthProvider>
          <NavBar />
          <div>
            <Toaster
              toastOptions={{
                style: {
                  border: "1px solid black",
                  padding: "10px",
                },
                success: {
                  style: {
                    background: "#333",
                    color: "#fff",
                  },
                },
                error: {
                  style: {
                    background: "#E5484D",
                    color: "#fff",
                  },
                },
                loading: {
                  style: {
                    background: "#333",
                    color: "#fff",
                  },
                },
              }}
            />
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
