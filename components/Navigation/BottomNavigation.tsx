"use client";
import { useDebounce } from "@/lib/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BottomNavigation() {
	const _pathname = usePathname();
	const _router = useRouter();
	const [prevScrollPos, setPrevScrollPos] = useState(0);
	const [_visible, setVisible] = useState(true);

	const handleScroll = useDebounce(() => {
		const currentScrollPos = window.scrollY;
		const visible = prevScrollPos >= currentScrollPos;

		setPrevScrollPos(currentScrollPos);
		setVisible(visible);
	}, 30);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	return <div className="fixed w-full bottom-0 left-0 right-0 h-10 border" />;
}
