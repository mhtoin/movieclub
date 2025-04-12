"use client";
import { useIsMobile } from "@/lib/hooks";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useState } from "react";
import SearchButton from "../search/SearchButton";
import Menubar from "./Menubar";
import ProfileMenu from "./ProfileMenu";

const ThemeSwitcher = dynamic(() => import("../theme/ThemeSwitcher"), {
	ssr: false,
});

export default function NavBar() {
	const pathname = usePathname();
	const isMobile = useIsMobile();

	// Define paths where transparent background is wanted (e.g. homepage)
	const transparentBgPaths = ["/home"]; // Add other paths as needed

	// detect if the user has scrolled down
	const [isTransparent, setIsTransparent] = useState(false);

	useEffect(() => {
		if (transparentBgPaths.includes(pathname)) {
			setIsTransparent(true);
		} else {
			setIsTransparent(false);
		}
	}, [pathname]); // Re-run effect when path changes

	const isHome = pathname === "/home";

	if (isMobile) {
		return (
			<div
				className={`min-w-screen w-screen flex items-center justify-center p-2 z-100 fixed top-0 h-[70px] min-h-[70px] transition-all duration-300 ${
					isTransparent
						? "bg-transparent"
						: "bg-background/80 backdrop-blur-md border-b"
				}`}
			>
				<div className="w-full py-5 px-1 rounded flex justify-between items-center">
					<div className="flex items-center justify-center gap-2">
						<ProfileMenu />
						<span
							className={`font-bold ${isHome ? "text-primary-foreground" : "text-foreground"}`}
						>
							leffaseura
						</span>
					</div>
					<div className="flex gap-2 h-full items-center relative">
						<ThemeSwitcher />
						<SearchButton />
						<Menubar />
					</div>
				</div>
			</div>
		);
	}
	return (
		<div
			className={`min-w-screen w-screen flex items-center justify-center p-2 z-100 fixed top-0 h-[70px] min-h-[70px] transition-all duration-300 ${
				isTransparent
					? "bg-transparent  "
					: "bg-background/80 backdrop-blur-md border-b border-border/10 dark:border-border/40"
			}`}
		>
			<div className="w-[90%] h-[70px] min-h-[70px] p-5 rounded hidden sm:flex justify-between items-center">
				{/**Right side */}
				<div className="flex items-center justify-center gap-5 lg:gap-10">
					{<Menubar />}
					<span
						className={`font-bold text-xl lg:text-2xl siteTitle ${isHome ? "text-primary-foreground" : "text-foreground"}`}
					>
						leffaseura
					</span>
				</div>
				<div className="flex gap-10 h-full items-center">
					<Suspense fallback={null}>
						<SearchButton />
					</Suspense>
					<ThemeSwitcher />
					<Suspense fallback={null}>
						<ProfileMenu />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
