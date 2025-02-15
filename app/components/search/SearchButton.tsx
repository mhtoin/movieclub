"use client";
import { SEARCH_ROUTE } from "@/lib/globals";
import { useIsMobile } from "@/lib/hooks";
import { useDialogStore } from "@/stores/useDialogStore";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../ui/Button";

export default function SearchButton() {
	const router = useRouter();
	const pathname = usePathname();
	const isMobile = useIsMobile();
	const { setInitialRoute } = useDialogStore();
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setInitialRoute(pathname);
				router.push(`/${SEARCH_ROUTE}`);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [pathname, router, setInitialRoute]);

	if (isMobile) {
		return (
			<Button
				onClick={() => {
					setInitialRoute(pathname);
					router.push(`/${SEARCH_ROUTE}`);
				}}
				variant={"ghost"}
				size={"icon"}
				className="rounded-full p-0"
			>
				<MagnifyingGlassIcon className="w-5 h-5" />
			</Button>
		);
	}

	return (
		<button
			type="button"
			className="border py-2 px-4 flex gap-5 items-center rounded-md bg-input hover:bg-input/80"
			onClick={() => {
				setInitialRoute(pathname);
				router.push(`/${SEARCH_ROUTE}`);
			}}
			onMouseEnter={() => {
				router.prefetch(`/${SEARCH_ROUTE}`);
			}}
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					setInitialRoute(pathname);
					router.push(`/${SEARCH_ROUTE}`);
				}
			}}
		>
			Search movies...
			<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
				<span className="text-xs">⌘</span>K
			</kbd>
		</button>
	);
}
