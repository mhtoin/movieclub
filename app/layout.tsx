import Providers from "@/utils/provider";
import "./globals.css";
import ThemeInitializer from "@/app/components/ThemeInitializer";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
				<ThemeInitializer theme={theme?.value} accent={accent?.value} />
				<Providers>
					{children}
					<SpeedInsights />
				</Providers>
			</body>
		</html>
	);
}
