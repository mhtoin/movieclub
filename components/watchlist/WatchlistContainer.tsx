"use client";
import MovieCard from "components/search/MovieCard";
import {
	useGetWatchlistQuery,
	useShortlistQuery,
	useValidateSession,
} from "lib/hooks";

export default function WatchlistContainer() {
	const { data: session } = useValidateSession();
	const { data: watchlist } = useGetWatchlistQuery(session || null);
	const { data: shortlistData } = useShortlistQuery(session?.shortlistId || "");

	const shortlistMovieIds = shortlistData
		? shortlistData?.movies?.map((movie) => movie.tmdbId)
		: [];

	const watchlistMovieIds = watchlist ? watchlist?.map((movie) => movie.id) : [];
	return (
		<div className="flex flex-col m-5 p-10 py-20 overflow-y-auto no-scrollbar gap-5">
			{session && !session.accountId && (
				<div className="alert alert-error w-1/3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="stroke-current shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
					>
						<title>Error</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>{`You haven't linked your TMDB account yet. You can do so in your profile`}</span>
				</div>
			)}
			<div className="flex flex-col items-center gap-5">
				<h1 className="text-2xl font-bold">Watchlist</h1>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
				{watchlist?.map((movie) => {
					return (
						<div
							key={`container-${movie.id}`}
							className="flex flex-col items-center gap-2"
						>
							<MovieCard
								key={movie.id}
								movie={movie}
								added={shortlistMovieIds?.includes(movie.id)}
								inWatchlist={watchlistMovieIds?.includes(movie.id)}
								showActions
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
