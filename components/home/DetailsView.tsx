import type { MovieWithReviews } from "@/types/movie.type";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

export default function DetailsView({
	movie,
}: {
	movie: MovieWithReviews;
}) {
	const containerRef = useRef<HTMLDivElement>(null); // Default aspect ratio

	return (
		<div className="grid grid-cols-8 w-full h-full mt-20">
			{/* Main content column (80%) */}
			<div
				className="col-span-6 relative flex flex-col justify-center p-8 overflow-hidden border"
				ref={containerRef}
			>
				{(() => {
					const title = movie.title;
					const midpoint = Math.ceil(title.length / 2);
					const firstHalf = title.substring(0, midpoint);
					const secondHalf = title.substring(midpoint);

					return (
						<div className="w-full max-w-full border flex flex-col items-center">
							<AnimatePresence mode="wait">
								<svg
									width="100%"
									height="80"
									viewBox="0 0 250 60"
									preserveAspectRatio="xMidYMid meet"
									className="w-full h-full max-w-4xl z-[9999]"
									style={{
										fontSize: `${Math.max(1, 3 - title.length / 12)}em`,
									}}
								>
									<title>{title}</title>
									{/* First half of text as separate motion.text element */}
									<motion.text
										x="50%"
										y="25"
										fontFamily="sans-serif"
										fontSize="1em"
										fontWeight="bold"
										fill="white"
										dominantBaseline="hanging"
										textAnchor="end"
										initial={{ y: -25, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										exit={{ y: -25, opacity: 0 }}
										transition={{ duration: 0.6, ease: "easeOut" }}
									>
										{firstHalf}
									</motion.text>

									{/* Second half of text as separate motion.text element */}
									<motion.text
										x="50%"
										y="25"
										fontFamily="sans-serif"
										fontSize="1em"
										fontWeight="bold"
										fill="transparent"
										stroke="white"
										strokeWidth="0.03em"
										dominantBaseline="hanging"
										textAnchor="start"
										initial={{ y: 25, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										exit={{ y: 25, opacity: 0 }}
										transition={{ duration: 0.6, ease: "easeOut" }}
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
