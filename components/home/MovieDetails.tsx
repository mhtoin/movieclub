import URLSearchUpdater from "components/home/URLSearchUpdater";
import CastPopover from "components/raffle/CastPopover";
import CastPortrait from "components/raffle/CastPortrait";
import UserPortrait from "components/raffle/UserPortrait";
import { Star, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaImdb } from "react-icons/fa";
import { SiThemoviedatabase } from "react-icons/si";
import type { MovieWithUser } from "types/movie.type";

export default function MovieDetails({
	mostRecentMovie,
}: { mostRecentMovie: MovieWithUser }) {
	return (
		<div className="absolute inset-0 top-16 flex flex-col gap-4 p-4 items-center justify-center w-full h-full">
			{mostRecentMovie?.watchDate && (
				<URLSearchUpdater watchDate={mostRecentMovie.watchDate} />
			)}
			<div className="flex flex-col md:flex-row md:gap-12 w-full h-full justify-evenly md:items-center ">
				<div className="flex items-center justify-start md:justify-center p-4 w-full md:w-1/2 h-full">
					<div className="flex flex-col gap-4 justify-center ">
						<div className="flex flex-row gap-2 ">
							{mostRecentMovie?.user && <UserPortrait user={mostRecentMovie?.user} />}
						</div>
						<p className="text-lg max-w-[500px] text-foreground/60">
							{mostRecentMovie?.tagline}
						</p>
						<h1 className="text-xl md:text-5xl font-bold underline">
							{mostRecentMovie?.title}
						</h1>
						<div className="flex flex-row gap-2 flex-wrap items-center justify-center">
							<p className="text-sm md:text-lg max-w-[500px] text-foreground/60">
								{mostRecentMovie?.watchDate
									? new Date(mostRecentMovie?.release_date).toLocaleDateString("fi-FI")
									: ""}
							</p>
							<span>|</span>
							<span className="text-sm md:text-lg max-w-[500px] text-foreground/60 flex flex-row items-center gap-1">
								<Star className="w-4 h-4 md:w-6 md:h-6" />
								{mostRecentMovie?.vote_average.toFixed(1)}
							</span>
							<span>|</span>
							<span className="text-sm md:text-lg max-w-[500px] text-foreground/60 flex flex-row items-center gap-1">
								<Users className="w-4 h-4 md:w-6 md:h-6" />
								{mostRecentMovie?.vote_count}
							</span>
							<span>|</span>
							<span className="text-sm md:text-lg max-w-[500px] text-foreground/60 flex flex-row items-center gap-1">
								<TrendingUp className="w-4 h-4 md:w-6 md:h-6" />
								{mostRecentMovie?.popularity.toFixed(1)}
							</span>
						</div>
						<div className="flex flex-row gap-2">
							{mostRecentMovie?.watchProviders?.providers?.map((provider) => {
								return (
									<Link
										href={mostRecentMovie?.watchProviders?.link || ""}
										target="_blank"
										key={provider.provider_id}
										className="rounded-md hover:bg-accent/50 transition-all duration-300 border border-accent/50"
									>
										<Image
											src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
											alt={provider.provider_name}
											width={50}
											height={50}
											className="rounded-md w-8 h-8 md:w-10 md:h-10"
										/>
									</Link>
								);
							})}
						</div>
					</div>
				</div>

				{/* Top-right cell */}
				<div className="flex items-center justify-start p-4 md:w-1/2 h-full">
					<div className="flex flex-col gap-5">
						<h1 className="text-xl md:text-2xl font-bold">Cast</h1>
						<div className="flex flex-row gap-2 justify-start items-center">
							{mostRecentMovie?.cast?.slice(0, 6).map((cast) => {
								return <CastPortrait cast={cast} key={cast.id} />;
							})}
							{mostRecentMovie?.cast && <CastPopover cast={mostRecentMovie?.cast} />}
						</div>
						<div className="flex flex-row gap-2">
							{mostRecentMovie?.crew?.map((crew) => {
								return (
									<div className="flex flex-col gap-2 items-start" key={crew.id}>
										<h1 className="text-xl md:text-2xl font-bold">{crew.job}</h1>
										<CastPortrait cast={crew} key={crew.id} />
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			{/* Bottom-left cell */}
			<div className="flex flex-col md:flex-row gap-12 w-full h-full md:justify-evenly ">
				<div className="hidden md:flex items-start justify-center p-4 w-full md:w-1/2 h-full">
					<div className="flex flex-col gap-2 w-full h-full items-center">
						{mostRecentMovie?.videos?.[0]?.key && (
							<iframe
								className="aspect-video rounded-lg h-1/2"
								src={`https://www.youtube.com/embed/${mostRecentMovie.videos[0].key}`}
								title="YouTube video player"
								allowFullScreen
								loading="lazy"
							/>
						)}
					</div>
				</div>

				{/* Bottom-right cell */}
				<div className="flex items-start justify-start p-4 w-full md:w-1/2">
					<div className="flex flex-col gap-2">
						<div className="flex flex-row gap-2 rounded-md w-fit px-2 py-1">
							<Link
								href={`https://www.themoviedb.org/movie/${mostRecentMovie?.tmdbId}`}
								target="_blank"
							>
								<SiThemoviedatabase className="w-4 h-4 md:w-6 md:h-6 hover:text-accent" />
							</Link>
							<Link
								href={`https://www.imdb.com/title/${mostRecentMovie?.imdbId}`}
								target="_blank"
							>
								<FaImdb className="w-4 h-4 md:w-6 md:h-6 hover:text-accent" />
							</Link>
						</div>
						<div className="flex flex-row gap-2">
							<div className="text-sm bg-background/40 rounded-md px-2 py-1">
								{mostRecentMovie?.genres?.map((genre) => genre.name).join("/")}
							</div>
							<div className="text-sm bg-background/40 rounded-md px-2 py-1">
								{mostRecentMovie?.runtime
									? `${Math.floor(mostRecentMovie?.runtime / 60)}h ${
											mostRecentMovie?.runtime % 60
										}m`
									: ""}
							</div>
						</div>
						<p className="text-sm md:text-md max-w-[500px] text-foreground/60 px-2">
							{mostRecentMovie?.overview}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
