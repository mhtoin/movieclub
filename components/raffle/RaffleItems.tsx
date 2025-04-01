import type { MovieWithUser } from "@/types/movie.type";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { RefObject } from "react";

export default function RaffleItems({
	shuffledMovies,
	currentIndex,
	started,
	containerRef,
}: {
	shuffledMovies: MovieWithUser[];
	currentIndex: number;
	started: boolean;
	containerRef: RefObject<HTMLDivElement>;
}): JSX.Element {
	return (
		<div
			className="flex flex-col gap-5 items-center overflow-scroll"
			ref={containerRef}
		>
			<motion.div
				layout
				className="grid @5xl/items:grid-cols-4 @4xl/items:grid-cols-5 @3xl/items:grid-cols-4 @2xl/items:grid-cols-3 @lg/items:grid-cols-2 @xl/items:grid-cols-3 @xs/items:grid-cols-2 gap-7 p-5"
			>
				<AnimatePresence mode="sync" initial={false}>
					{shuffledMovies.map((movie, index) => {
						return (
							<motion.div
								key={`movie-${movie?.id}-${movie.user?.id}`}
								className="relative"
								id={`movie-${movie?.id}-${movie.user?.id}`}
								layout
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{
									opacity: 1,
									scale: index === currentIndex && started ? 1.1 : 1,
									transition: {
										type: "spring",
										stiffness: 300,
										damping: 20,
									},
								}}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{
									duration: 0.5,
									layout: {
										type: "spring",
										stiffness: 200,
										damping: 25,
									},
								}}
							>
								<Image
									src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
									alt=""
									width={"150"}
									height={"200"}
									priority={false}
									loading="lazy"
									sizes="(max-width: 768px) 20vw, (max-width: 1200px) 20vw, 33vw"
									className={`w-[150px] h-auto 2xl:w-[150px] transition-all duration-300 ease-in-out rounded-md ${
										index === currentIndex && started ? "saturate-100" : "saturate-0"
									}`}
								/>
							</motion.div>
						);
					})}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
