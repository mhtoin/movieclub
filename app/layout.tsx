import Providers from "@/utils/provider";
import "./globals.css";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
      <head>
        <script
          id="theme-script"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = document.documentElement.className || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                const accent = document.documentElement.getAttribute('data-accent') || '';
                
                document.documentElement.classList.toggle('light', theme === 'light');
                document.documentElement.classList.toggle('dark', theme === 'dark');
                
                if (accent) {
                  document.documentElement.setAttribute('data-accent', accent);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} antialiased min-h-screen no-scrollbar relative bg-background`}
      >
        <Providers>
          {children}
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
