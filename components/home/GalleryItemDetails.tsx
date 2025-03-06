import CastPopover from "@/components/raffle/CastPopover";
import CastPortrait from "@/components/raffle/CastPortrait";
import UserPortrait from "@/components/raffle/UserPortrait";
import type { MovieWithReviews } from "@/types/movie.type";
import { Clapperboard, Star, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaImdb } from "react-icons/fa";
import { SiThemoviedatabase } from "react-icons/si";

export default function GalleryItemDetails({
	isExpanded,
	movie,
}: {
	isExpanded: boolean;
	movie: MovieWithReviews;
}) {
	return (
		<div
			className="absolute inset-0 top-12 flex flex-col gap-2 md:gap-4 p-4 items-center justify-center w-full h-full data-[expanded=false]:top-0 md:data-[expanded=false]:top-12"
			data-expanded={isExpanded}
		>
			<div className="flex flex-col @4xl:flex-row @4xl:gap-4 w-full h-full justify-evenly @4xl:items-center ">
				<div className="flex items-center justify-start @4xl:justify-center p-4 w-full @4xl:w-1/2 h-full">
					<div className="flex flex-col gap-2 md:gap-4 justify-center">
						<p
							className="text-sm @4xl:text-xl max-w-[500px] text-primary-foreground/60 data-[expanded=true]:text-lg md:data-[expanded=false]:hidden"
							data-expanded={isExpanded}
						>
							{movie?.tagline}
						</p>
						<h1
							className="text-lg @4xl:text-5xl text-primary-foreground font-bold underline data-[expanded=true]:text-3xl md:data-[expanded=false]:text-3xl"
							data-expanded={isExpanded}
						>
							{movie?.title}
						</h1>
						<div className="flex flex-row gap-2 ">
							{movie?.user && (
								<UserPortrait user={movie?.user} className="w-6 h-6 md:w-10 md:h-10" />
							)}
						</div>
						<div className="flex flex-row gap-2 flex-wrap items-center">
							<p className="text-sm @4xl:text-lg max-w-[500px] text-primary-foreground/60">
								{new Date(movie?.watchDate ?? "").toLocaleDateString("fi-FI")}
							</p>
							<span className="text-primary-foreground/60">|</span>
							<span className="text-sm @4xl:text-lg max-w-[500px] text-primary-foreground/60 flex flex-row items-center gap-1">
								<Star className="w-4 h-4 @4xl:w-6 @4xl:h-6" />
								{movie?.vote_average.toFixed(1)}
							</span>
							<span className="text-primary-foreground/60">|</span>
							<span className="text-sm @4xl:text-lg max-w-[500px] text-primary-foreground/60 flex flex-row items-center gap-1">
								<Users className="w-4 h-4 @4xl:w-6 @4xl:h-6" />
								{movie?.vote_count}
							</span>
							<span className="text-primary-foreground/60">|</span>
							<span className="text-sm @4xl:text-lg max-w-[500px] text-primary-foreground/60 flex flex-row items-center gap-1">
								<TrendingUp className="w-4 h-4 @4xl:w-6 @4xl:h-6" />
								{movie?.popularity.toFixed(1)}
							</span>
						</div>
						<div className="flex flex-row gap-2">
							{movie?.watchProviders?.providers?.map((provider) => {
								return (
									<Link
										href={movie?.watchProviders?.link ?? ""}
										target="_blank"
										key={provider.provider_id}
										className="rounded-md hover:bg-accent/50 transition-all duration-300 border border-accent/50"
									>
										<Image
											src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
											alt={provider.provider_name}
											width={50}
											height={50}
											className="rounded-md w-8 h-8 @4xl:w-10 @4xl:h-10 md:data-[expanded=false]:w-10 md:data-[expanded=false]:h-10 data-[expanded=true]:w-8 data-[expanded=true]:h-8 data-[expanded=false]:w-6 data-[expanded=false]:h-6"
											data-expanded={isExpanded}
										/>
									</Link>
								);
							})}
						</div>
					</div>
				</div>

				{/* Top-right cell */}
				<div className="flex items-center justify-start p-4 md:w-1/2 h-full">
					{isExpanded && (
						<div className="flex flex-col gap-5">
							<h1 className="text-xl md:text-2xl font-bold text-primary-foreground">
								Cast
							</h1>
							<div className="flex flex-row gap-2 justify-start items-center">
								{movie?.cast?.slice(0, 6).map((cast) => {
									return <CastPortrait cast={cast} key={cast.id} />;
								})}
								{movie?.cast && <CastPopover cast={movie?.cast} />}
							</div>
							<h1 className="text-xl md:text-2xl font-bold text-primary-foreground">
								Crew
							</h1>
							<div className="flex flex-row gap-2 justify-start items-center">
								{movie?.crew?.map((crew) => {
									return <CastPortrait cast={crew} key={crew.id} />;
								})}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Bottom-left cell */}
			<div className="flex flex-col @4xl:flex-row gap-12 w-full h-full @4xl:justify-evenly ">
				<div className="hidden @4xl:flex items-start justify-center p-4 w-full @4xl:w-1/2 h-full">
					<div className="flex flex-col gap-2 w-full h-full items-center">
						{movie?.videos?.[0]?.key && (
							<iframe
								className="aspect-video rounded-lg h-1/2"
								loading="lazy"
								src={`https://www.youtube.com/embed/${movie.videos[0].key}`}
								title="YouTube video player"
								allowFullScreen
							/>
						)}
					</div>
				</div>
				{/* Video link for expanded mobile state */}
				{isExpanded && (
					<div className="flex md:hidden flex-col items-start px-4 justify-center gap-2">
						<h2 className="text-lg font-bold">Trailer</h2>
						<Link
							href={`https://www.youtube.com/embed/${movie?.videos?.[0]?.key}`}
							target="_blank"
							className="text-primary-foreground hover:text-accent transition-all duration-300 border border-accent/50 rounded-md p-2 bg-accent/10"
						>
							<Clapperboard className="w-8 h-8" />
						</Link>
					</div>
				)}

				{/* Bottom-right cell */}
				<div
					className="hidden @4xl:flex items-start justify-start px-4 w-full @4xl:w-1/2 data-[expanded=true]:flex md:data-[expanded=false]:flex"
					data-expanded={isExpanded}
				>
					<div className="flex flex-col gap-2">
						<div className="flex flex-row gap-2 rounded-md w-fit px-0 md:px-2 md:py-1">
							<Link
								href={`https://www.themoviedb.org/movie/${movie?.tmdbId}`}
								target="_blank"
							>
								<SiThemoviedatabase className="w-4 h-4 @4xl:w-6 @4xl:h-6 text-primary-foreground hover:text-accent" />
							</Link>
							<Link
								href={`https://www.imdb.com/title/${movie?.imdbId}`}
								target="_blank"
							>
								<FaImdb className="w-4 h-4 @4xl:w-6 @4xl:h-6 text-primary-foreground hover:text-accent" />
							</Link>
						</div>
						<div className="flex flex-row flex-wrap gap-2">
							<div className="text-sm text-primary-foreground bg-background/40 rounded-md px-0 md:px-2 py-1">
								{movie?.genres?.map((genre) => genre.name).join("/")}
							</div>
							<div className="text-sm text-primary-foreground bg-background/40 rounded-md px-2 py-1">
								{movie?.runtime
									? `${Math.floor(movie?.runtime / 60)}h ${movie?.runtime % 60}m`
									: ""}
							</div>
						</div>

						<p className="text-sm @4xl:text-md max-w-[500px] text-primary-foreground/60 px-0 md:px-2 max-h-[100px] overflow-y-auto md:max-h-none">
							{movie?.overview}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
