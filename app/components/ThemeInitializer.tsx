"use client";

import { useEffect } from "react";

export default function ThemeInitializer({
	theme,
	accent,
}: {
	theme?: string;
	accent?: string;
}) {
	useEffect(() => {
		const currentTheme =
			theme ||
			(window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light");

		document.documentElement.classList.toggle(
			"light",
			currentTheme === "light",
		);
		document.documentElement.classList.toggle("dark", currentTheme === "dark");

		if (accent) {
			document.documentElement.setAttribute("data-accent", accent);
		}
	}, [theme, accent]);

	return null;
}
