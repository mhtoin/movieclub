"use client";

import {
	useAddToWatchlistMutation,
	useRemoveFromShortlistMutation,
	useUpdateShortlistMutation,
	useValidateSession,
} from "@/lib/hooks";
import type { Movie } from "@prisma/client";
import {
	BookmarkMinus,
	BookmarkPlus,
	ListCheck,
	ListPlus,
	Star,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaImdb } from "react-icons/fa";
import { SiThemoviedatabase } from "react-icons/si";
import { Button } from "../ui/Button";
export default function RecommendedCard({
	movie,
	added,
	inWatchlist,
	showActions,
}: {
	movie: Movie;
	added?: boolean;
	inWatchlist?: boolean;
	showActions?: boolean;
}) {
	const [_isHovering, setIsHovering] = useState(false);
	const watchlistMutation = useAddToWatchlistMutation();
	const addMutation = useUpdateShortlistMutation();
	const removeMutation = useRemoveFromShortlistMutation();
	const { data: user } = useValidateSession();

	return (
		<div
			className={"moviecard group"}
			onMouseEnter={() => {
				setIsHovering(true);
			}}
			onMouseLeave={() => {
				setIsHovering(false);
			}}
		>
			{showActions && (
				<div className="opacity-0 group-hover:opacity-80 backdrop-blur-md border border-border/50 transition-opacity duration-300 absolute top-0 right-0 z-10 fill-accent stroke-foreground flex flex-col items-center justify-center gap-2 bg-card rounded-bl-lg rounded-tr-lg p-2">
					{added ? (
						<Button
							variant={"ghost"}
							size={"iconXs"}
							onClick={() => {
								removeMutation.mutate({
									userId: user?.id ?? "",
									shortlistId: user?.shortlistId ?? "",
									movieId: movie.id,
								});
							}}
							isLoading={addMutation.isPending}
						>
							<ListCheck />
						</Button>
					) : (
						<Button
							variant={"ghost"}
							size={"iconXs"}
							isLoading={addMutation.isPending}
							onClick={() => {
								addMutation.mutate({
									movie: movie,
									shortlistId: user?.shortlistId ?? "",
								});
							}}
						>
							<ListPlus />
						</Button>
					)}
					<Button
						variant="ghost"
						size="iconXs"
						onClick={() => {
							watchlistMutation.mutate({
								movieId: movie.tmdbId,
							});
						}}
						isLoading={watchlistMutation.isPending}
					>
						{inWatchlist ? <BookmarkMinus /> : <BookmarkPlus />}
					</Button>
				</div>
			)}

			<img
				src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
				alt=""
				width={250}
				height={375}
				className="w-full h-full object-cover absolute top-0 left-0 border rounded-md"
				loading="lazy"
			/>
			<div className="info">
				<h1 className="title line-clamp-2">{movie.title}</h1>
				<div className="flex flex-row gap-2 flex-wrap">
					<span className="text-xs flex flex-row items-center gap-1">
						<Star className="w-4 h-4" />
						{movie.vote_average.toFixed(1)}
					</span>
					<span className="text-xs flex flex-row items-center gap-1">
						<Users className="w-4 h-4" />
						{movie.vote_count}
					</span>
					<span className="text-xs flex flex-row items-center gap-1">
						<TrendingUp className="w-4 h-4" />
						{movie.popularity.toFixed(1)}
					</span>
				</div>
				<div className="flex flex-col justify-between gap-2">
					<div className="flex flex-row gap-2" />
					<div className="description-links">
						<div className="flex flex-row items-center gap-2">
							<Link
								href={`https://www.themoviedb.org/movie/${movie.id}`}
								target="_blank"
							>
								<Button variant="ghost" size="icon">
									<SiThemoviedatabase className="w-6 h-6" />
								</Button>
							</Link>
							<Link
								href={`https://www.imdb.com/title/${movie?.imdbId}`}
								target="_blank"
							>
								<Button variant="ghost" size="icon">
									<FaImdb className="w-6 h-6" />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
