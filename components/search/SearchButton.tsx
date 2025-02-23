"use client";
import MovieCard from "@/components/search/MovieCard";
import RecommendedCard from "@/components/search/RecommendedCard";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { SEARCH_ROUTE } from "@/lib/globals";
import {
	useDebounce,
	useIsMobile,
	useSearchSuspenseInfiniteQuery,
	useValidateSession,
} from "@/lib/hooks";
import { userKeys } from "@/lib/users/userKeys";
import { useDialogStore } from "@/stores/useDialogStore";
import type { TMDBMovieResponse } from "@/types/tmdb.type";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useSuspenseQuery } from "@tanstack/react-query";
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
	const { data: user } = useValidateSession();
	const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
		useSearchSuspenseInfiniteQuery();
	const { data: recommended } = useSuspenseQuery(
		userKeys.recommended(user?.id || ""),
	);
	const [activeTab, setActiveTab] = useState<"results" | "recommended">(
		(searchParams.get("query")?.length ?? 0) > 0 ? "results" : "recommended",
	);
	const modalRef = useRef<HTMLDivElement>(null);
	const sentinelRef = useRef<HTMLButtonElement>(null);

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
		const params = new URLSearchParams(searchParams.toString());
		params.delete("query");
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const debouncedSearch = useDebounce(handleSearch, 500);
	const hasResults = data?.pages?.[0]?.total_results > 0;

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
					open ? "w-[600px] h-[90vh] max-h-[90vh] py-2" : ""
				}`}
			>
				<div className="flex flex-col gap-2 relative h-full">
					<Button
						variant="outline"
						size="icon"
						className={`absolute bottom-0 right-0 z-30 ${
							open ? "visible" : "invisible"
						}`}
						onClick={() => {
							resultsContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
						}}
					>
						<ChevronUp className="w-4 h-4" />
					</Button>
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
								const nextValue = e.target.value;

								setInputValue(nextValue);
								debouncedSearch(nextValue);
								if (activeTab !== "results" && nextValue.length > 0) {
									setActiveTab("results");
								}

								if (activeTab === "results" && nextValue.length === 0) {
									setActiveTab("recommended");
								}
							}}
							onFocus={() => setOpen(true)}
							className="bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-opacity-0 focus-visible:ring-offset-0 border-none z-20"
						/>
						<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 z-20">
							<span className="text-xs">⌘</span>K
						</kbd>
					</div>
					{open && (
						<Tabs
							value={activeTab}
							onValueChange={(value) => {
								setActiveTab(value as "results" | "recommended");
							}}
							activationMode="automatic"
							className="overflow-hidden"
						>
							<div className="flex flex-col items-center bg-transparent overflow-hidden">
								<div className="flex w-full justify-between items-center h-full overflow-hidden">
									<TabsList className="h-[38px]">
										<TabsTrigger value="recommended">Recommended</TabsTrigger>
										<TabsTrigger value="results">Results</TabsTrigger>
									</TabsList>
								</div>
								<div className="h-[0.5px] w-full bg-accent" />
								<TabsContent value="results" className="flex-1 justify-center">
									<div
										ref={resultsContainerRef}
										className="flex flex-wrap gap-5 py-2 w-full items-center justify-center overflow-y-auto max-h-[calc(90vh-150px)] relative"
									>
										{data?.pages.map((page) => (
											<Fragment key={page.page}>
												{page.results.map((result: TMDBMovieResponse) => (
													<MovieCard key={result.id} movie={result} />
												))}
											</Fragment>
										))}
										{hasResults && (
											<div className="flex h-10 w-full justify-center">
												<Button
													variant="ghost"
													ref={sentinelRef}
													size="icon"
													isLoading={isFetchingNextPage}
													onClick={() => {
														fetchNextPage();
													}}
												>
													<ArrowDownToLineIcon className="w-4 h-4" />
												</Button>
											</div>
										)}
									</div>
								</TabsContent>
								<TabsContent
									value="recommended"
									className="overflow-y-auto"
									style={{ maxHeight: "calc(90vh - 150px)" }}
								>
									<div className="flex flex-wrap gap-2 py-2 w-full items-center justify-center">
										{Object.keys(recommended).map((sourceMovie) => (
											<div key={sourceMovie} className="w-full">
												<h3 className="sticky top-0 z-10 text-sm font-semibold mb-2 p-2 bg-accent/40 rounded-md w-fit">
													Because you liked: {sourceMovie}
												</h3>
												<div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] auto-rows-[min-content] gap-y-5 place-items-center w-full">
													{recommended[sourceMovie].map((rec, index) => (
														<RecommendedCard
															key={`${sourceMovie}-${index}`}
															movie={rec.movie}
															showActions={true}
														/>
													))}
												</div>
											</div>
										))}
										<div className="flex h-10 w-full justify-center">
											<Button
												variant="ghost"
												ref={sentinelRef}
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
								</TabsContent>
							</div>
						</Tabs>
					)}
				</div>
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
