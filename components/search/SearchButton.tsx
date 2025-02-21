"use client";
import MovieCard from "@/components/search/MovieCard";
import { Input } from "@/components/ui/Input";
import { SEARCH_ROUTE } from "@/lib/globals";
import {
	useDebounce,
	useIsMobile,
	useSearchSuspenseInfiniteQuery,
} from "@/lib/hooks";
import { useDialogStore } from "@/stores/useDialogStore";
import type { TMDBMovieResponse } from "@/types/tmdb.type";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/Button";
import { ArrowDownToLineIcon, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

export default function SearchButton() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isMobile = useIsMobile();
	const { setInitialRoute } = useDialogStore();
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const resultsContainerRef = useRef<HTMLDivElement>(null);
	const [inputValue, setInputValue] = useState(searchParams.get("query") || "");
	const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
		useSearchSuspenseInfiniteQuery();
	const modalRef = useRef<HTMLDivElement>(null);
	const sentinelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const currentQuery = searchParams.get("query") || "";
		setInputValue(currentQuery);

		// Maintain focus after URL parameter updates
		if (inputRef.current?.matches(":focus")) {
			inputRef.current.focus();
		}
	}, [searchParams]);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen(true);
				inputRef.current?.focus();
			}
		};
		const up = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setOpen(false);
			}
		};
		document.addEventListener("keydown", down);
		document.addEventListener("keyup", up);
		return () => document.removeEventListener("keydown", down);
	}, []);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.addEventListener("focus", () => setOpen(true));
		}
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			},
			{
				root: modalRef.current,
				rootMargin: "1000px",
				threshold: 0.1,
			},
		);

		if (sentinelRef.current) {
			observer.observe(sentinelRef.current);
		}

		return () => observer.disconnect();
	}, [hasNextPage, fetchNextPage]);

	const handleSearch = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("query", value);
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const handleClose = () => {
		setOpen(false);
	};

	const debouncedSearch = useDebounce(handleSearch, 500);

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
		<>
			<div
				ref={modalRef}
				className={`fixed top-4 left-1/2 -translate-x-1/2 border px-4 flex flex-col gap-5 transition-all duration-300 rounded-md bg-input hover:bg-input/80 z-20 w-[300px] h-10 ${
					open ? "w-[600px] h-[800px] max-h-[80vh] py-2" : ""
				}`}
			>
				<div
					className={`flex px-2 items-center justify-center bg-transparent h-[38px] ${
						open ? "rounded-md border" : ""
					}`}
				>
					<Input
						placeholder="Search movies..."
						ref={inputRef}
						value={inputValue}
						onChange={(e) => {
							setInputValue(e.target.value);
							debouncedSearch(e.target.value);
						}}
						onFocus={() => setOpen(true)}
						className="bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-opacity-0 focus-visible:ring-offset-0 border-none z-20"
					/>
					<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 z-20">
						<span className="text-xs">⌘</span>K
					</kbd>
				</div>
				{open && (
					<div className="flex flex-col gap-2 bg-transparent overflow-hidden">
						<div className="flex w-full justify-between items-center">
							<div className="flex items-center justify-center gap-2">
								<h3 className="text-sm font-medium">Search for movies</h3>
								<span className="text-xs text-muted-foreground">
									{`Found ${data?.pages[0].total_results} results`}
								</span>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => {
									resultsContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
								}}
							>
								<ChevronUp className="w-4 h-4" />
							</Button>
						</div>
						<div className="h-[0.5px] w-full bg-accent" />

						<div
							ref={resultsContainerRef}
							className="flex flex-wrap gap-2 py-2 h-full w-full items-center justify-center overflow-y-scroll relative"
						>
							{data?.pages.map((page) => (
								<Fragment key={page.page}>
									{page.results.map((result: TMDBMovieResponse) => (
										<MovieCard key={result.id} movie={result} />
									))}
								</Fragment>
							))}
							<div ref={sentinelRef} className="flex h-10 w-full justify-center">
								<Button
									variant="ghost"
									size="icon"
									isLoading={isFetchingNextPage}
									onClick={() => {
										fetchNextPage();
									}}
								>
									<ArrowDownToLineIcon className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>

			{open && (
				<div
					className="fixed top-0 left-0 w-screen h-screen bg-background/50 backdrop-blur-sm z-10"
					onClick={handleClose}
					onKeyDown={handleClose}
				/>
			)}
		</>
	);
}
