"use client";
import DetailsView from "@/components/home/DetailsView";
import MovieReviews from "@/components/home/MovieReviews";
import { useWatchDateStore } from "@/stores/useWatchDateStore";
import type { MovieWithReviews } from "@/types/movie.type";
import { Button } from "components/ui/Button";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { ChevronsLeftRight, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import React from "react";
import { createPortal } from "react-dom";

export default React.memo(
	function MovieGalleryItem({
		movie,
		alwaysExpanded = false,
	}: { movie: MovieWithReviews; alwaysExpanded?: boolean }) {
		const [isExpanded, setIsExpanded] = useState(alwaysExpanded);
		const [isAnimating, setIsAnimating] = useState(false);
		const pathname = usePathname();
		const params = useSearchParams();
		const viewMode = params.get("viewMode");

		const setDay = useWatchDateStore.use.setDay();

		// Memoize the background image URL calculation
		const backgroundImage = useMemo(() => {
			return movie?.images?.backdrops[0]?.file_path
				? `https://image.tmdb.org/t/p/original/${movie?.images?.backdrops[0]?.file_path}`
				: `https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`;
		}, [movie?.images?.backdrops, movie?.backdrop_path]);

		// Memoize handlers
		const handleMouseEnter = useCallback(() => {
			setDay(movie?.watchDate?.split("-")[2] ?? "");
		}, [movie?.watchDate, setDay]);

		const handleMouseLeave = useCallback(() => {
			setDay("");
		}, [setDay]);

		useEffect(() => {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === "Escape") {
					setIsExpanded(false);
				}
			};

			if (isExpanded) {
				document.body.addEventListener("keydown", handleKeyDown);
			}

			return () => {
				document.body.removeEventListener("keydown", handleKeyDown);
			};
		}, [isExpanded]);

		// Optimize the expand handler to update URL after animation
		const handleExpand = useCallback(() => {
			setIsAnimating(true);
			setIsExpanded(!isExpanded);

			// Update URL parameters after a slight delay to avoid doing this during animation
			setTimeout(() => {
				if (!isExpanded) {
					// Only update URL when expanding
					const params = new URLSearchParams(window.location.search);
					const dateParts = movie?.watchDate?.split("-");
					const day = dateParts?.[2];
					params.set("date", day ?? "");
					window.history.replaceState({}, "", `${pathname}?${params}`);
				}
				setIsAnimating(false);
			}, 350); // Slightly longer than animation duration
		}, [isExpanded, movie?.watchDate, pathname]);

		// Handle close button click
		const handleClose = useCallback(() => {
			setIsExpanded(false);
		}, []);

		// Will-change CSS for better performance during animation
		const imageClassName = useMemo(() => {
			return `object-cover absolute inset-0 scale-105 data-[expanded=true]:scale-100 
			transition-all duration-1000 ease-in-out grayscale brightness-150 
			data-[expanded=true]:grayscale-0 data-[expanded=true]:brightness-100 
			[mask-image:radial-gradient(100%_100%_at_95%_0,#fff,transparent)] 
			data-[expanded=true]:transition-all 
			${isAnimating ? "will-change-transform will-change-filter" : ""}`;
		}, [isAnimating]);

		return (
			<div
				className="gallery-item @container group"
				key={movie.id}
				data-expanded={isExpanded}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<div className="relative w-full h-full">
					<Image
						src={backgroundImage}
						alt={movie?.title}
						data-expanded={isExpanded}
						className={imageClassName}
						quality={isExpanded ? 80 : 50}
						fill
						placeholder="blur"
						blurDataURL={movie?.images?.backdrops[0]?.blurDataUrl ?? ""}
						priority={isExpanded}
						sizes={isExpanded ? "100vw" : "(max-width: 768px) 100vw, 33vw"}
					/>
					{/* Gradient Overlay */}
					{/*<div className="absolute inset-0 bg-[linear-gradient(to_top_right,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.8)_20%,rgba(0,0,0,0.7)_100%)]" />*/}
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
						!alwaysExpanded &&
						createPortal(
							<div className="fixed top-5 right-5 z-[101]">
								<Button
									variant="ghost"
									size="iconLg"
									onClick={handleClose}
									className="z-[101]"
									tabIndex={isExpanded ? 0 : -1}
								>
									<X className="w-8 h-8 text-primary-foreground" />
								</Button>
							</div>,
							document.body,
						)}
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
								<DetailsView movie={movie} />
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
	},
	(prevProps, nextProps) => {
		// Only re-render if the movie changes or expanded state requirement changes
		return (
			prevProps.movie.id === nextProps.movie.id &&
			prevProps.alwaysExpanded === nextProps.alwaysExpanded
		);
	},
);
