import type { MovieWithReviews } from "@/types/movie.type";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function DetailsView({
	movie,
}: {
	movie: MovieWithReviews;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [aspectRatio, setAspectRatio] = useState(8); // Default aspect ratio

	// Adjust aspect ratio based on screen size
	useEffect(() => {
		const handleResize = () => {
			// Increase aspect ratio as screen gets smaller to prevent squishing
			if (window.innerWidth < 640) {
				// Small screens
				setAspectRatio(4); // Less wide, more height proportionally
			} else if (window.innerWidth < 1024) {
				// Medium screens
				setAspectRatio(6);
			} else {
				// Large screens
				setAspectRatio(8);
			}
		};

		handleResize(); // Initial calculation
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="grid grid-cols-8 w-full h-full mt-20">
			{/* Main content column (80%) */}
			<div
				className="col-span-6 relative flex flex-col justify-end p-8 overflow-hidden border"
				ref={containerRef}
			>
				{(() => {
					const title = movie.title;
					const midpoint = Math.ceil(title.length / 2);
					const firstHalf = title.substring(0, midpoint);
					const secondHalf = title.substring(midpoint);

					return (
						<div className="w-full max-w-full border flex flex-col h-full">
							<AnimatePresence mode="wait">
								<svg
									width="100%"
									height="120"
									viewBox={`0 0 ${title.length * aspectRatio} 80`}
									preserveAspectRatio="xMinYMid meet"
									className="w-full h-full"
									style={{
										fontSize: "clamp(2rem, 5cw, 5rem)",
									}}
								>
									<title>{title}</title>
									{/* First half of text as separate motion.text element */}
									<motion.text
										x="0"
										y="60"
										fontFamily="sans-serif"
										fontSize="1em"
										fontWeight="bold"
										fill="white"
										dominantBaseline="hanging"
										initial={{ y: -25, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										exit={{ y: -25, opacity: 0 }}
										transition={{ duration: 0.6, ease: "easeOut" }}
										{...(window.innerWidth > 640
											? {
													textLength: `${firstHalf.length * aspectRatio}`,
													lengthAdjust: "spacingAndGlyphs",
												}
											: {})}
									>
										{firstHalf}
									</motion.text>

									{/* Second half of text as separate motion.text element */}
									<motion.text
										x={`${firstHalf.length * aspectRatio * 1}`} // Position right after first half (with slight adjustment)
										y="60"
										fontFamily="sans-serif"
										fontSize="1em"
										fontWeight="bold"
										fill="transparent"
										stroke="white"
										strokeWidth="0.03em"
										dominantBaseline="hanging"
										initial={{ y: 25, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										exit={{ y: 25, opacity: 0 }}
										transition={{ duration: 0.6, ease: "easeOut" }}
										{...(window.innerWidth > 640
											? {
													textLength: `${secondHalf.length * aspectRatio}`,
													lengthAdjust: "spacingAndGlyphs",
												}
											: {})}
									>
										{secondHalf}
									</motion.text>
								</svg>
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
