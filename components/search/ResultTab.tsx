import MovieCard from "@/components/search/MovieCard";
import { TabsContent } from "@/components/ui/Tabs";
import { useSearchQuery } from "@/lib/hooks";
import type { TMDBMovieResponse } from "@/types/tmdb.type";
import { Button } from "components/ui/Button";
import { ArrowDownToLineIcon, Loader2 } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";

export default function ResultTab() {
	const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
		useSearchQuery();
	const modalRef = useRef<HTMLDivElement>(null);
	const sentinelRef = useRef<HTMLButtonElement>(null);
	const resultsContainerRef = useRef<HTMLDivElement>(null);
	const hasResults = data?.pages?.[0]?.total_results > 0;
	const isInitialLoading = isFetching && !isFetchingNextPage && !data;
	const noSearchPerformed = !data;
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
	return (
		<TabsContent value="results" className="flex-1 justify-center">
			<div
				ref={resultsContainerRef}
				className="flex flex-wrap gap-5 py-2 w-full items-center justify-center overflow-y-auto max-h-[calc(90vh-150px)] relative"
			>
				{isInitialLoading && (
					<div className="flex flex-col items-center justify-center p-8">
						<div className="animate-spin w-8 h-8 mb-2">
							<Loader2 className="w-full h-full" />
						</div>
						<span className="text-center text-sm text-muted-foreground">
							Searching...
						</span>
					</div>
				)}

				{noSearchPerformed && !isInitialLoading && (
					<span className="text-center text-sm text-muted-foreground">
						No search performed yet
					</span>
				)}

				{data && !hasResults && !isInitialLoading && (
					<span className="text-center text-sm text-muted-foreground">
						No results found
					</span>
				)}

				{data?.pages.map((page) => (
					<Fragment key={page.page}>
						{page.results.map((result: TMDBMovieResponse) => (
							<MovieCard key={result.id} movie={result} showActions />
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
	);
}
