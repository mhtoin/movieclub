/* eslint-disable @next/next/no-img-element */
"use client";

import type { MovieWithUser } from "@/types/movie.type";
import { Button } from "components/ui/Button";
import {
	useAddToWatchlistMutation,
	useRemoveFromShortlistMutation,
	useUpdateSelectionMutation,
	useUpdateShortlistMutation,
	useValidateSession,
} from "lib/hooks";
import {
	BookmarkMinus,
	BookmarkPlus,
	Plus,
	Star,
	TicketCheck,
	TicketPlus,
	TrendingUp,
	Users,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaImdb } from "react-icons/fa";
import { SiThemoviedatabase } from "react-icons/si";

interface SearchResultCardProps {
	movie: MovieWithUser;
	shortlistId: string;
	removeFromShortList?: boolean;
	highlight?: boolean;
	requiresSelection?: boolean;
	index?: number;
	showActions?: boolean;
	isInWatchlist?: boolean;
}

export default function ShortListItem({
	movie,
	shortlistId,
	removeFromShortList,
	highlight,
	requiresSelection,
	index,
	showActions,
	isInWatchlist,
}: SearchResultCardProps) {
	const removeMutation = useRemoveFromShortlistMutation();
	const selectionMutation = useUpdateSelectionMutation();
	const watchlistMutation = useAddToWatchlistMutation();
	const addMutation = useUpdateShortlistMutation();
	const { data: user } = useValidateSession();

	return (
		<div
			className={`moviecard group ${
				highlight ? "border-accent border-b-4 transition-all duration-700" : ""
			}`}
		>
			{showActions &&
				requiresSelection &&
				shortlistId === user?.shortlistId && (
					<div className="opacity-0 group-hover:opacity-80 backdrop-blur-md transition-opacity duration-300 absolute top-0 left-0 z-10 fill-accent stroke-foreground flex flex-col items-center justify-center gap-2 bg-card rounded-br-lg rounded-tl-lg p-2">
						<Button
							variant={"ghost"}
							size={"iconSm"}
							tooltip={highlight ? "Selected" : "Select"}
							onClick={() => {
								selectionMutation.mutate({
									userId: user?.id || "",
									shortlistId: user?.shortlistId || "",
									selectedIndex: index || 0,
								});
							}}
							isLoading={selectionMutation.isPending}
						>
							{highlight ? (
								<TicketCheck className="w-5 h-5" />
							) : (
								<TicketPlus className="w-5 h-5" />
							)}
						</Button>
					</div>
				)}
			{showActions && (
				<div className="opacity-0 group-hover:opacity-80 backdrop-blur-md border border-border/50 transition-opacity duration-300 absolute top-0 right-0 z-10 fill-accent stroke-foreground flex flex-col items-center justify-center gap-2 bg-card/80 rounded-bl-lg rounded-tr-lg p-2">
					{removeFromShortList ? (
						<Button
							variant={"ghost"}
							size={"iconXs"}
							tooltip="Remove"
							onClick={() => {
								removeMutation.mutate({
									userId: user?.id || "",
									shortlistId: user?.shortlistId || "",
									movieId: movie.id || "",
								});
							}}
							isLoading={removeMutation.isPending}
						>
							<X />
						</Button>
					) : (
						<Button
							variant={"ghost"}
							size={"iconXs"}
							tooltip="Add"
							onClick={() => {
								addMutation.mutate({
									movieId: movie.id,
									shortlistId: shortlistId,
								});
							}}
							isLoading={addMutation.isPending}
						>
							<Plus />
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
						tooltip={
							isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
						}
					>
						{isInWatchlist ? <BookmarkMinus /> : <BookmarkPlus />}
					</Button>
				</div>
			)}
			<Image
				src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
				alt=""
				width={"150"}
				height={"150"}
				className={"primary-img w-[150px] h-auto 2xl:w-[150px]"}
				priority={removeFromShortList}
				loading={removeFromShortList ? "eager" : "lazy"}
			/>
			{(selectionMutation.isPending || removeMutation.isPending) && (
				<span className="loading loading-spinner loading-lg absolute top-0 left-0 bottom-0 right-0 m-auto z-40" />
			)}
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
								href={`https://www.themoviedb.org/movie/${movie?.tmdbId}`}
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
