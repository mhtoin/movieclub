"use client";
import { useIsMobile } from "@/lib/hooks";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useState } from "react";
import SearchButton from "../search/SearchButton";
import Menubar from "./Menubar";
import ProfileMenu from "./ProfileMenu";

const ThemeSwitcher = dynamic(() => import("../theme/ThemeSwitcher"), {
	ssr: false,
});

export default function NavBar() {
	const isMobile = useIsMobile();

	// detect if the user has scrolled down
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		// detect if the user has scrolled down an entire screen
		const handleScroll = () => {
			setIsScrolled(window.scrollY > window.innerHeight);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	if (isMobile) {
		return (
			<div
				className={`min-w-screen w-screen flex items-center justify-center p-2 z-[100] fixed top-0 h-[70px] min-h-[70px] transition-all duration-300 ${
					isScrolled
						? "bg-background/80 backdrop-blur-md border-b"
						: "bg-transparent"
				}`}
			>
				<div className="w-full py-5 px-1 rounded flex justify-between items-center">
					<div className="flex items-center justify-center gap-2">
						<ProfileMenu />
						<span className="font-bold">leffaseura</span>
					</div>
					<div className="flex gap-2 h-full items-center">
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
			className={`min-w-screen w-screen flex items-center justify-center p-2 z-[100] fixed top-0 h-[70px] min-h-[70px] transition-all duration-300 ${
				isScrolled
					? "bg-background/80 backdrop-blur-md border-b"
					: "bg-transparent"
			}`}
		>
			<div className="w-[90%] h-[70px] min-h-[70px] p-5 rounded hidden sm:flex justify-between items-center">
				{/**Right side */}
				<div className="flex items-center justify-center gap-5">
					{<Menubar />}
					<span className="font-bold">leffaseura</span>
				</div>
				<div className="flex gap-10 h-full items-center">
					<SearchButton />
					<ThemeSwitcher />
					<ProfileMenu />
				</div>
			</div>
		</div>
	);
}
