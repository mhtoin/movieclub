import Providers from "@/utils/provider";
import "./globals.css";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

export const metadata = {
  title: "movieclub",
  description: "Th app for your long-distance movie club",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
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
        className={`${inter.className} antialiased min-h-screen no-scrollbar relative bg-background`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
