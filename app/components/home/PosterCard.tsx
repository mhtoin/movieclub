import { Button } from "components/ui/Button";
import { Card, CardContent } from "components/ui/Card";
import { Info, Star, Users } from "lucide-react";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaImdb } from "react-icons/fa";
import { SiThemoviedatabase } from "react-icons/si";
import {
	Tooltip,
	TooltipContent,
	TooltipPortal,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/Tooltip";

export default function PosterCard({
	movie,
	showOverview = false,
}: {
	movie: MovieOfTheWeek;
	showOverview?: boolean;
}) {
	return (
		<Card className="postercard">
			<CardContent className="flex aspect-square items-center justify-center p-0">
				<Image
					src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
					width={500}
					height={700}
					alt="movie poster"
					className="object-cover"
					priority={showOverview}
					loading={showOverview ? "eager" : "lazy"}
					sizes="(max-width: 768px) 70vw, (max-width: 1200px) 60vw, 33vw"
				/>
			</CardContent>
			<div className="cardInfo text-primary-foreground">
				<div className="rounded-full w-6 h-6  lg:w-10 lg:h-10 overflow-hidden">
					<Image
						src={movie?.user?.image}
						width={500}
						height={900}
						alt="movie poster"
						className="object-cover"
					/>
				</div>
				<h1 className="title line-clamp-2 text-lg md:text-xl 2xl:text-2xl whitespace-pre-line max-w-full p-2 text-center">
					{movie.title}
				</h1>
				<div className="flex flex-row gap-2 flex-wrap">
					<span className="text-xs flex flex-row items-center gap-1">
						<Star className="w-4 h-4 md:w-6 md:h-6" />
						{movie.vote_average.toFixed(1)}
					</span>
					<span className="text-xs flex flex-row items-center gap-1">
						<Users className="w-4 h-4 md:w-6 md:h-6" />
						{movie.vote_count}
					</span>
					<span className="text-xs flex flex-row items-center gap-1">
						<TrendingUp className="w-4 h-4 md:w-6 md:h-6" />
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
									<SiThemoviedatabase className="w-6 h-6 md:w-8 md:h-8" />
								</Button>
							</Link>
							<Link
								href={`https://www.imdb.com/title/${movie?.imdbId}`}
								target="_blank"
							>
								<Button variant="ghost" size="icon">
									<FaImdb className="w-6 h-6 md:w-8 md:h-8" />
								</Button>
							</Link>
						</div>
					</div>
				</div>
				{showOverview ? (
					<div className="flex flex-row gap-2 p-2">
						<span className="text-md lg:text-lg text-center">
							{movie.overview}
						</span>
					</div>
				) : (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Button variant="ghost" size="icon">
									<Info className="w-6 h-6 2xl:w-8 2xl:h-8" />
								</Button>
							</TooltipTrigger>
							<TooltipPortal>
								<TooltipContent className="whitespace-pre-wrap p-2 bg-card max-w-96 text-accent-foreground">
									<p>{movie.overview}</p>
								</TooltipContent>
							</TooltipPortal>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
		</Card>
	);
}
