"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function URLSearchUpdater({ watchDate }: { watchDate: string }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					const params = new URLSearchParams(searchParams);
					const dateParts = watchDate.split("-");
					const day = dateParts[2];
					const month = dateParts.slice(0, 2).join("-");

					params.set("month", month);
					params.set("date", day);
					window.history.replaceState({}, "", `${pathname}?${params}`);

					// Disconnect after first successful observation
					observer.disconnect();
				}
			},
			{ threshold: 0.1 },
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	}, [watchDate, pathname, searchParams]);

	// Render a tiny invisible marker element
	return (
		<div
			ref={ref}
			className="absolute top-0 left-0 w-px h-px opacity-0"
			aria-hidden="true"
		/>
	);
}
