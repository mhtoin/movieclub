"use client";
import GalleryItemDetails from "@/components/home/GalleryItemDetails";
import MovieReviews from "@/components/home/MovieReviews";
import { useWatchDateStore } from "@/stores/useWatchDateStore";
import type { MovieWithReviews } from "@/types/movie.type";
import { Button } from "components/ui/Button";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { ChevronsLeftRight, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function MovieGalleryItem({
	movie,
}: { movie: MovieWithReviews }) {
	const [isExpanded, setIsExpanded] = useState(false);
	const pathname = usePathname();
	const params = useSearchParams();
	const viewMode = params.get("viewMode");

	const setDay = useWatchDateStore.use.setDay();
	const backgroundImage = movie?.images?.backdrops[0]?.file_path
		? `https://image.tmdb.org/t/p/original/${movie?.images?.backdrops[0]?.file_path}`
		: `https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`;

	useEffect(() => {
		if (isExpanded) {
			document.body.addEventListener("keydown", (e) => {
				if (e.key === "Escape") {
					setIsExpanded(false);
				}
			});
		}
		return () => {
			document.body.removeEventListener("keydown", (e) => {
				if (e.key === "Escape") {
					setIsExpanded(false);
				}
			});
		};
	}, [isExpanded]);

	const handleExpand = () => {
		const params = new URLSearchParams(window.location.search);
		const dateParts = movie?.watchDate?.split("-");
		const day = dateParts?.[2];
		params.set("date", day ?? "");
		window.history.replaceState({}, "", `${pathname}?${params}`);
		setIsExpanded(!isExpanded);
	};

	return (
		<div
			className="gallery-item @container group"
			key={movie.id}
			data-expanded={isExpanded}
			onMouseEnter={() => setDay(movie?.watchDate?.split("-")[2] ?? "")}
			onMouseLeave={() => setDay("")}
		>
			<div className="relative w-full h-full">
				<Image
					src={backgroundImage}
					alt={movie?.title}
					className="object-cover absolute inset-0"
					quality={50}
					fill
					placeholder="blur"
					blurDataURL={movie?.images?.backdrops[0]?.blurDataUrl ?? ""}
				/>
				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-[linear-gradient(to_top_right,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.8)_20%,rgba(0,0,0,0.7)_100%)]" />
				{!isExpanded && (
					<div className="absolute inset-0 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full h-full flex items-center justify-center">
						<div className="absolute inset-0 z-50 bg-[radial-gradient(transparent_0%,var(--primary)_80%,var(--primary)_100%)] opacity-10 blur-xl" />
						<Button
							variant="ghost"
							size="iconLg"
							onClick={handleExpand}
							className="z-50"
							tabIndex={isExpanded ? -1 : 0}
						>
							<ChevronsLeftRight className="w-8 h-8 text-primary-foreground" />
						</Button>
					</div>
				)}
				{isExpanded &&
					createPortal(
						<div className="fixed top-5 right-5 z-[101]">
							<Button
								variant="ghost"
								size="iconLg"
								onClick={() => setIsExpanded(!isExpanded)}
								className="z-[101]"
								tabIndex={isExpanded ? -1 : 0}
							>
								<X className="w-8 h-8 text-primary-foreground" />
							</Button>
						</div>,
						document.body,
					)}
				{/* Grid Overlay */}
				{/* @ts-ignore */}
				<AnimatePresence mode="wait">
					{(viewMode === "details" || !viewMode || !isExpanded) && (
						<motion.div
							key="details"
							className="absolute inset-0 overflow-hidden"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.3 }}
						>
							<GalleryItemDetails movie={movie} isExpanded={isExpanded} />
						</motion.div>
					)}
					{viewMode === "reviews" && isExpanded && (
						<motion.div
							key="reviews"
							className="absolute inset-0 overflow-hidden"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.3 }}
						>
							<MovieReviews movieReviews={movie?.tierMovies} />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
