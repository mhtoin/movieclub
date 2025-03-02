import StarRadio from "@/components/tierlist/StarRadio";
import type { MovieReview } from "@/types/movie.type";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { type JSONContent, generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef, useState } from "react";

export default function MovieReviews({
	movieReviews,
}: { movieReviews: MovieReview[] }) {
	const reviews = [...movieReviews].concat(movieReviews);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	// Function to scroll to the next or previous review
	const scroll = (direction: "left" | "right") => {
		if (!scrollContainerRef.current) return;

		const container = scrollContainerRef.current;
		const scrollAmount =
			direction === "left" ? -container.offsetWidth : container.offsetWidth;

		container.scrollBy({ left: scrollAmount, behavior: "smooth" });
	};

	// Update scroll buttons state
	const updateScrollButtonsState = useCallback(() => {
		if (!scrollContainerRef.current) return;

		const container = scrollContainerRef.current;
		setCanScrollLeft(container.scrollLeft > 0);
		setCanScrollRight(
			container.scrollLeft < container.scrollWidth - container.offsetWidth,
		);
	}, []);

	// Add scroll event listener
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (container) {
			container.addEventListener("scroll", updateScrollButtonsState);
			// Initial check
			updateScrollButtonsState();

			return () => {
				container.removeEventListener("scroll", updateScrollButtonsState);
			};
		}
	}, [updateScrollButtonsState]);

	return (
		<div className="absolute inset-0 top-16 flex flex-col gap-4 p-4 items-center  w-full h-full">
			<div className="relative w-full max-w-3xl">
				{/* Scroll buttons */}
				<button
					type="button"
					onClick={() => scroll("left")}
					disabled={!canScrollLeft}
					className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border disabled:opacity-30 disabled:cursor-not-allowed"
					aria-label="Previous review"
				>
					<ChevronLeftIcon className="h-5 w-5" />
				</button>

				<button
					type="button"
					onClick={() => scroll("right")}
					disabled={!canScrollRight}
					className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border disabled:opacity-30 disabled:cursor-not-allowed"
					aria-label="Next review"
				>
					<ChevronRightIcon className="h-5 w-5" />
				</button>

				{/* Carousel container */}
				<div
					ref={scrollContainerRef}
					className="w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
				>
					<div className="flex flex-row w-full">
						{reviews?.map((review) => {
							const reviewText = review.review
								? generateHTML(review?.review as JSONContent, [StarterKit])
								: "";
							return (
								<div
									key={review?.tier.tierlist.user?.id}
									className="flex-shrink-0 w-full snap-center flex flex-col rounded-md p-6 gap-5 border border-border/30 bg-card/50 backdrop-blur-sm"
								>
									<h2 className="text-lg font-bold">
										{review.tier.tierlist.user?.name}
									</h2>
									<div className="flex flex-row gap-5 items-center">
										<img
											src={review.tier.tierlist.user?.image}
											alt={review.tier.tierlist.user?.name ?? ""}
											className="w-10 h-10 rounded-full"
										/>
										<StarRadio
											value={Number.parseFloat(review.rating)}
											id={review.tier.tierlist.user?.id ?? ""}
											disabled={true}
										/>
									</div>
									<div className="flex flex-col gap-2 overflow-y-auto max-h-[50vh] no-scrollbar">
										<div
											className="no-scrollbar overflow-y-auto prose prose-sm sm:prose-base prose-neutral dark:prose-invert ul-li-p-reset h-full focus:outline-none"
											dangerouslySetInnerHTML={{ __html: reviewText }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Pagination dots */}
				<div className="flex justify-center gap-2 mt-4">
					{reviews.map((_, index) => (
						<button
							type="button"
							key={index}
							onClick={() => {
								if (!scrollContainerRef.current) return;
								const container = scrollContainerRef.current;
								const itemWidth = container.offsetWidth;
								container.scrollTo({
									left: itemWidth * index,
									behavior: "smooth",
								});
							}}
							className="w-2 h-2 rounded-full bg-border hover:bg-primary/70 transition-colors"
							aria-label={`Go to review ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
