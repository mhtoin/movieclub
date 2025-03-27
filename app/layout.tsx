import Providers from "@/utils/provider";
import "./globals.css";
import { getAccent, getTheme } from "@/lib/getTheme";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
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
	return (
		<html lang="en">
			<head>
				<script dangerouslySetInnerHTML={{ __html: getTheme }} />
				<script dangerouslySetInnerHTML={{ __html: getAccent }} />
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
