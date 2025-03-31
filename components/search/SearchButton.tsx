"use client";

import RecommendedTab from "@/components/search/RecommendedTab";
import ResultTab from "@/components/search/ResultTab";
import SkeletonRecommendedTab from "@/components/search/SkeletonRecommendedTab";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { getQueryClient } from "@/lib/getQueryClient";
import { SEARCH_ROUTE } from "@/lib/globals";
import { useDebounce, useIsMobile, useValidateSession } from "@/lib/hooks";
import { userKeys } from "@/lib/users/userKeys";
import { useDialogStore } from "@/stores/useDialogStore";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

export default function SearchButton() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isMobile = useIsMobile();
	const { data: user } = useValidateSession();
	const { setInitialRoute } = useDialogStore();
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [inputValue, setInputValue] = useState(searchParams.get("query") || "");
	const showOnlyAvailable = searchParams.get("showOnlyAvailable") === "true";
	const [activeTab, setActiveTab] = useState<"results" | "recommended">(
		(searchParams.get("query")?.length ?? 0) > 0 ? "results" : "recommended",
	);
	const modalRef = useRef<HTMLDivElement>(null);
	const queryClient = getQueryClient();

	useEffect(() => {
		const currentQuery = searchParams.get("query") || "";
		setInputValue(currentQuery);

		// Maintain focus after URL parameter updates
		if (inputRef.current?.matches(":focus")) {
			inputRef.current.focus();
		}
	}, [searchParams]);

	// Effect to invalidate the search query when showOnlyAvailable changes
	useEffect(() => {
		if (inputValue.length > 0) {
			// Invalidate and refetch the search query
			queryClient.invalidateQueries({
				queryKey: ["search", inputValue, showOnlyAvailable.toString()],
			});
		}
	}, [showOnlyAvailable, inputValue, queryClient]);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				const params = new URLSearchParams(searchParams.toString());
				params.set("showOnlyAvailable", "true");
				setOpen(true);

				inputRef.current?.focus();
				router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
	}, [pathname, router, searchParams]);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.addEventListener("focus", () => {
				const params = new URLSearchParams(searchParams.toString());
				params.set("showOnlyAvailable", "true");
				setOpen(true);

				router.push(`${pathname}?${params.toString()}`, { scroll: false });
			});
		}
	}, [pathname, router, searchParams]);

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

	const handleShowOnlyAvailable = (value: boolean) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("showOnlyAvailable", value.toString());
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
					open ? "w-[600px] h-[90vh] max-h-[90vh] py-2" : ""
				}`}
			>
				<div className="flex flex-col gap-2 relative h-full">
					<div
						className={`flex px-2 items-center justify-center bg-transparent h-[38px] ${
							open ? "rounded-md border" : ""
						} ${inputRef.current?.matches(":focus") ? "border-2" : ""}`}
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
							onMouseEnter={() => {
								// prefetch recommended movies
								queryClient.prefetchQuery(userKeys.recommended(user?.id ?? ""));
							}}
							className="bg-transparent focus:outline-none focus:outline-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-none z-20 flex-1 w-full"
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
							<div className="flex flex-col items-center bg-transparent overflow-hidden gap-2">
								<div className="flex w-full h-full overflow-hidden bg-transparent">
									<TabsList className="h-[38px] bg-transparent flex flex-row items-center justify-between w-full">
										<div className="flex flex-row gap-2 bg-transparent">
											<TabsTrigger
												value="recommended"
												className="bg-background/40 [&[data-state=active]]:bg-accent border-b border-border data-[state=active]:text-accent-foreground"
											>
												Recommended
											</TabsTrigger>
											<TabsTrigger
												value="results"
												className="bg-background/40 [&[data-state=active]]:bg-accent border-b border-border data-[state=active]:text-accent-foreground"
											>
												Results
											</TabsTrigger>
										</div>
										<div className="flex flex-row gap-2 bg-transparent items-center">
											<Input
												type="checkbox"
												className="w-4 h-4 accent-accent"
												checked={showOnlyAvailable}
												onChange={(e) => {
													handleShowOnlyAvailable(e.target.checked);
												}}
											/>
											<span className="text-sm text-muted-foreground">
												Show only available
											</span>
										</div>
									</TabsList>
								</div>
								<div className="h-0.5 w-full bg-accent" />
								<Suspense fallback={null}>
									<ResultTab />
								</Suspense>
								<Suspense fallback={<SkeletonRecommendedTab />}>
									<RecommendedTab />
								</Suspense>
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
