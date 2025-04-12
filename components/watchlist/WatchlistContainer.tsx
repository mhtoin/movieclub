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
		<div className="flex flex-col m-5 p-10 py-20 overflow-y-auto no-scrollbar gap-5 w-full h-full relative">
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

			<div className="relative h-dvh w-full overflow-y-auto no-scrollbar">
				{/* Top gradient overlay */}
				<div className="absolute top-0 left-0 right-0 h-5 bg-linear-to-b from-background to-transparent z-10" />

				<div className="h-full w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] auto-rows-[min-content] place-items-center gap-y-5 overflow-y-auto no-scrollbar bg-background">
					{watchlist?.map((movie) => {
						return (
							<MovieCard
								key={movie.id}
								movie={movie}
								added={shortlistMovieIds?.includes(movie.id)}
								inWatchlist={watchlistMovieIds?.includes(movie.id)}
								showActions
							/>
						);
					})}
				</div>

				{/* Bottom gradient overlay */}
				<div className="absolute bottom-0 left-0 right-0 h-5 bg-linear-to-t from-background to-transparent z-10" />
			</div>
		</div>
	);
}
