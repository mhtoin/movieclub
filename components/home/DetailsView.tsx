import type { MovieWithReviews } from "@/types/movie.type";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function DetailsView({
	movie,
}: {
	movie: MovieWithReviews;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isWrapped, setIsWrapped] = useState(false);
	const [containerWidth, setContainerWidth] = useState(0);

	// Calculate if text will wrap BEFORE rendering animation
	useEffect(() => {
		// Get container width on mount and when it changes
		const updateContainerWidth = () => {
			if (containerRef.current) {
				const width = containerRef.current.clientWidth;
				setContainerWidth(width);
			}
		};

		updateContainerWidth();

		// Use ResizeObserver for more accurate detection of container size changes
		const resizeObserver = new ResizeObserver(updateContainerWidth);
		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		return () => {
			if (containerRef.current) {
				resizeObserver.unobserve(containerRef.current);
			}
		};
	}, []);

	// Calculate wrapping whenever title or container width changes
	useEffect(() => {
		if (containerWidth > 0) {
			// Calculate text width using canvas (pre-render measurement)
			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");

			if (context) {
				// Make sure this exactly matches your CSS
				// The font property syntax needs to be "weight size family"
				context.font = "bold 64px monospace";

				// Split the title as you do in the render
				const words = movie.title.split(" ");
				let firstHalf = "";
				let secondHalf = "";

				if (words.length <= 1) {
					const midpoint = Math.ceil(movie.title.length / 2);
					firstHalf = movie.title.substring(0, midpoint);
					secondHalf = movie.title.substring(midpoint);
				} else {
					const midWordIndex = Math.floor(words.length / 2);
					firstHalf = words.slice(0, midWordIndex).join(" ");
					secondHalf = words.slice(midWordIndex).join(" ");
				}

				// Get text metrics
				const firstHalfWidth = context.measureText(
					firstHalf.toLocaleUpperCase(),
				).width;
				const secondHalfWidth = context.measureText(
					secondHalf.toLocaleUpperCase(),
				).width;
				const spaceWidth = words.length > 1 ? context.measureText(" ").width : 0;

				// Account for padding (p-10 = 2.5rem = 40px on each side)
				const availableWidth = containerWidth - 80;

				// Check if text will wrap - this considers the flex-wrap behavior
				const willWrap =
					firstHalfWidth + spaceWidth + secondHalfWidth > availableWidth;

				// Debug the actual measurements
				console.log({
					firstHalfWidth,
					secondHalfWidth,
					spaceWidth,
					totalWidth: firstHalfWidth + spaceWidth + secondHalfWidth,
					availableWidth,
					willWrap,
				});

				setIsWrapped(willWrap);
			}
		}
	}, [movie.title, containerWidth]);

	console.log(movie.title, isWrapped);

	return (
		<div className="grid grid-cols-8 w-full h-full mt-20">
			{/* Main content column (80%) */}
			<div
				className="col-span-6 relative flex flex-col justify-center overflow-hidden border"
				ref={containerRef}
			>
				{(() => {
					const title = movie.title;
					const words = title.split(" ");
					let firstHalf = "";
					let secondHalf = "";

					if (words.length <= 1) {
						const midpoint = Math.ceil(title.length / 2);
						firstHalf = title.substring(0, midpoint);
						secondHalf = title.substring(midpoint);
					} else {
						const midWordIndex = Math.floor(words.length / 2);
						firstHalf = words.slice(0, midWordIndex).join(" ");
						secondHalf = words.slice(midWordIndex).join(" ");
					}

					// Add a key to force re-render when isWrapped changes
					return (
						<div className="w-full max-w-full border flex flex-col flex-wrap">
							<AnimatePresence mode="wait">
								<div className="flex flex-wrap p-10">
									<motion.span
										key={`first-${isWrapped ? "wrapped" : "unwrapped"}`}
										className="text-[64px] font-bold font-mono whitespace-nowrap"
										initial={isWrapped ? { opacity: 0, x: -50 } : { opacity: 0, y: -100 }}
										animate={isWrapped ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }}
										exit={isWrapped ? { opacity: 0, x: 50 } : { opacity: 0, y: 100 }}
										transition={{ duration: 0.5 }}
									>
										{firstHalf.toLocaleUpperCase()}
									</motion.span>
									{words.length > 1 && (
										<span className="text-[64px] font-bold font-mono whitespace-nowrap">
											&nbsp;
										</span>
									)}
									<motion.span
										key={`second-${isWrapped ? "wrapped" : "unwrapped"}`}
										className="text-[64px] font-bold font-mono whitespace-nowrap"
										initial={isWrapped ? { opacity: 0, x: 50 } : { opacity: 0, y: 100 }}
										animate={isWrapped ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }}
										exit={isWrapped ? { opacity: 0, x: -50 } : { opacity: 0, y: -100 }}
										transition={
											isWrapped ? { duration: 0.5, delay: 0.2 } : { duration: 0.5 }
										}
										style={{
											font: "Arial",
											WebkitTextStroke: "1px",
											WebkitTextStrokeColor: "white",
											WebkitTextFillColor: "transparent",
										}}
									>
										{secondHalf.toLocaleUpperCase()}
									</motion.span>
								</div>
							</AnimatePresence>
						</div>
					);
				})()}
			</div>

			{/* Side column (20%) */}
			<div className="col-span-2 border">
				{/* Content for the smaller right column */}
			</div>
		</div>
	);
}
