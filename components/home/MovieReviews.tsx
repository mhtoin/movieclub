import CreateReviewDialog from "@/components/home/CreateReviewDialog";
import { useValidateSession } from "@/lib/hooks";
import type { MovieReview } from "@/types/movie.type";
import { type JSONContent, generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import StarRadio from "components/tierlist/StarRadio";
import { Button } from "components/ui/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function MovieReviews({
	movieReviews,
	movieId,
}: { movieReviews: MovieReview[]; movieId: string }) {
	const validReviews = movieReviews.filter(
		(review) =>
			review?.tier?.tierlist?.user && (review?.review || review?.rating !== "0"),
	);

	if (!validReviews.length) {
		return (
			<div className="absolute inset-0 top-16 flex flex-col gap-4 items-center justify-center">
				<div className="p-6 border border-border/30 bg-card/50 backdrop-blur-sm rounded-md">
					<h2 className="text-lg font-bold">No reviews available</h2>
					<p>There are no reviews for this movie yet.</p>
				</div>
				<CreateReviewDialog movieId={movieId} />
			</div>
		);
	}

	const reviews = validReviews;
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);
	const { data: user } = useValidateSession();

	const scroll = (direction: "left" | "right") => {
		if (!scrollContainerRef.current) return;

		const container = scrollContainerRef.current;
		const scrollAmount =
			direction === "left" ? -container.offsetWidth : container.offsetWidth;

		container.scrollBy({ left: scrollAmount, behavior: "smooth" });
	};

	const updateScrollButtonsState = useCallback(() => {
		if (!scrollContainerRef.current) return;

		const container = scrollContainerRef.current;
		setCanScrollLeft(container.scrollLeft > 0);
		setCanScrollRight(
			container.scrollLeft < container.scrollWidth - container.offsetWidth,
		);
	}, []);

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (container) {
			container.addEventListener("scroll", updateScrollButtonsState);
			updateScrollButtonsState();

			return () => {
				container.removeEventListener("scroll", updateScrollButtonsState);
			};
		}
	}, [updateScrollButtonsState]);

	return (
		<div className="absolute inset-0 top-5 flex flex-col gap-4 p-4 items-center justify-center w-full h-full">
			<div className="relative w-full max-w-3xl">
				{canScrollLeft && (
					<Button
						onClick={() => scroll("left")}
						variant="outline"
						disabled={!canScrollLeft}
						className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 p-2 rounded-full bg-opaqueCard/80 backdrop-blur-sm border border-border disabled:opacity-30 disabled:cursor-not-allowed"
						aria-label="Previous review"
					>
						<ChevronLeftIcon className="h-5 w-5" />
					</Button>
				)}
				{canScrollRight && (
					<Button
						onClick={() => scroll("right")}
						disabled={!canScrollRight}
						className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 p-2 rounded-full bg-opaqueCard/80 backdrop-blur-sm border border-border disabled:opacity-30 disabled:cursor-not-allowed"
						aria-label="Next review"
						variant="outline"
					>
						<ChevronRightIcon className="h-5 w-5" />
					</Button>
				)}

				<div
					ref={scrollContainerRef}
					className="w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
				>
					<div className="flex flex-row w-full">
						{reviews?.map((review, index) => {
							const reviewText = review.review
								? generateHTML(review?.review as JSONContent, [StarterKit])
								: "";
							return (
								<div
									key={`${review?.tier?.tierlist?.user?.id || index}`}
									className="flex-shrink-0 w-full snap-center flex flex-col rounded-md p-6 gap-5 border border-border/30 bg-opaqueCard/50 backdrop-blur-sm"
								>
									<h2 className="text-lg font-bold text-primary-foreground">
										{review.tier?.tierlist?.user?.name}
									</h2>
									<div className="flex flex-row gap-5 items-center border-b pb-5">
										<img
											src={review.tier?.tierlist?.user?.image}
											alt={review.tier?.tierlist?.user?.name ?? ""}
											className="w-10 h-10 rounded-full"
										/>
										<StarRadio
											value={Number.parseFloat(review.rating)}
											id={review.tier?.tierlist?.user?.id ?? ""}
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

				{reviews.length > 1 && (
					<div className="flex justify-center gap-2 mt-4">
						{reviews.map((_, index) => (
							<Button
								type="button"
								key={index}
								variant="ghost"
								onClick={() => {
									if (!scrollContainerRef.current) return;
									const container = scrollContainerRef.current;
									const itemWidth = container.offsetWidth;
									container.scrollTo({
										left: itemWidth * index,
										behavior: "smooth",
									});
								}}
								className={`w-4 h-4 p-0 rounded-full bg-border hover:bg-primary/70 transition-colors ${
									scrollContainerRef.current &&
									Math.round(
										scrollContainerRef.current.scrollLeft /
											scrollContainerRef.current.offsetWidth,
									) === index
										? "bg-primary/70"
										: !scrollContainerRef.current && index === 0
											? "bg-primary/70"
											: ""
								}`}
								aria-label={`Go to review ${index + 1}`}
							/>
						))}
						{reviews.find(
							(review) => review.tier?.tierlist?.user?.id === user?.id,
						) && (
							<Button
								type="button"
								variant="ghost"
								onClick={() => {}}
								className="w-4 h-4 p-0 rounded-full bg-border hover:bg-primary/70 transition-colors"
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
