import Providers from "@/utils/provider";
import "./globals.css";
import { Inter } from "next/font/google";
import Navigation from "./home/components/Navigation";
import NavBar from "./home/components/NavBar";
import RaffleNotification from "./components/RaffleNotification";
import Notification from "./components/Notification";
import WebNavbar from "./home/components/WebNavbar";
const inter = Inter({ subsets: ["latin"] });

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
      <body className="min-h-screen bg-black">
      <Notification />
         {/* @ts-expect-error Server Component */}
        <WebNavbar />
        
        <RaffleNotification />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
