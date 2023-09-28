import Providers from "@/utils/provider";
import "./globals.css";
import RaffleNotification from "./components/RaffleNotification";
import Notification from "./components/Notification";
import MobileNavbar from "./home/components/MobileNavbar";
import { NextAuthProvider } from "@/utils/NextAuthProvider";
import WebNavbar from "./home/components/ClientNav";


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
        <WebNavbar />
        
        <RaffleNotification />
        <Providers>{children}</Providers>
         
       <NextAuthProvider><MobileNavbar /></NextAuthProvider> 
      </body>
    </html>
  );
}
