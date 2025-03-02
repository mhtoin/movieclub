"use client";
import ReviewEditor from "components/tierlist/ReviewEditor";
import StarRadio from "components/tierlist/StarRadio";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "components/ui/Dialog";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { TierMovieWithMovieData } from "types/tierlist.type";

export default function ReviewDialog({
	movie,
}: {
	movie: TierMovieWithMovieData;
}) {
	const [rating, setRating] = useState(Number.parseFloat(movie.rating));
	return (
		<Dialog>
			<DialogTrigger>
				<Star
					className={`w-4 h-4 text-yellow-500 hover:scale-110 fill-transparent hover:fill-accent hover:text-accent transition-all duration-300 ${
						Number.parseFloat(movie.rating) > 0 || movie.review
							? "fill-yellow-500"
							: ""
					}`}
				/>
			</DialogTrigger>
			<DialogContent
				className="max-w-4xl max-h-[90vh] h-[90vh] overflow-hidden p-0 z-[9999]"
				variant="noClose"
			>
				{/* Background image container */}
				<div className="relative w-full h-full">
					{/* Background image with overlay */}
					<div className="absolute inset-0 w-full h-full">
						<Image
							src={`https://image.tmdb.org/t/p/original/${movie.movie.backdrop_path || movie.movie.poster_path}`}
							alt={movie.movie.title}
							fill
							className="object-cover opacity-30 blur-sm"
							priority
						/>
						{/* Dark overlay for better readability */}
						<div className="absolute inset-0 bg-black/50" />
					</div>

					{/* Content container with proper padding and z-index */}
					<div className="relative z-10 grid grid-cols-2 gap-4 p-6 w-full h-full">
						<div className="flex-shrink-0 col-span-1 h-full w-full border">
							<Image
								src={`https://image.tmdb.org/t/p/original/${movie.movie.poster_path}`}
								alt={movie.movie.title}
								width={500}
								height={750}
								className="rounded-md shadow-lg object-cover h-full w-full"
							/>
						</div>
						<div>
							<DialogHeader>
								<DialogTitle className="text-xl text-white">
									{movie.movie.title}
								</DialogTitle>
							</DialogHeader>
							<div className="flex gap-6 bg-transparent w-full h-full p-2 overflow-hidden">
								<div className="flex flex-col gap-4 text-white w-full h-full items-start">
									<div className="flex flex-col gap-2 max-w-sm shrink-0 grow-0">
										<StarRadio
											value={rating}
											id={movie.id}
											onChange={(newValue) => {
												console.log("new value", newValue);
												setRating(newValue);
											}}
										/>
									</div>
									<div className="flex flex-col gap-2 w-full h-full">
										<h2 className="text-lg font-semibold">Review</h2>
										<ReviewEditor movieData={movie} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
