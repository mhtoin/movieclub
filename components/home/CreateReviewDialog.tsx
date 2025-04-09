"use client";
import { Button } from "@/components/ui/Button";
import { checkTier } from "@/lib/actions/checkTier";
import { useValidateSession } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import ReviewEditor from "components/tierlist/ReviewEditor";
import StarRadio from "components/tierlist/StarRadio";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "components/ui/Dialog";
import { tierlistKeys } from "lib/tierlist/tierlistKeys";
import { Loader2, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateReviewDialog({
	movieId,
}: {
	movieId: string;
}) {
	const [open, setOpen] = useState(false);
	const { data: user } = useValidateSession();
	const tierlistId = user?.tierlistId;

	// Fetch the latest tierlist data when the dialog is open
	const { data: tierlistData, isLoading } = useQuery({
		...tierlistKeys.byId(tierlistId || ""),
		enabled: open,
	});

	// Find the movie data from the tierlist
	const movieData =
		open && tierlistData
			? tierlistData.tierlistTiers
					.flatMap((tier) => tier.tierMovies)
					.find((m) => m.movieId === movieId)
			: null;

	const [rating, setRating] = useState(0);

	// Update the rating state when the dialog opens and movie data is available
	useEffect(() => {
		if (open && movieData) {
			setRating(Number.parseFloat(movieData.rating));
		}
	}, [open, movieData]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="flex items-center justify-center gap-2"
					onClick={async (e) => {
						e.preventDefault();
						const status = await checkTier(movieId);

						if (status.success) {
							setOpen(true);
						} else {
							toast.error("You must rank this movie to create a review.");
						}
					}}
				>
					<span>Create</span>
					<PlusIcon className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent
				className="max-w-4xl max-h-[90vh] h-[90vh] overflow-hidden p-0 z-[9999]"
				variant="noClose"
			>
				{isLoading ? (
					<div className="flex items-center justify-center h-full">
						<Loader2 className="animate-spin" />
					</div>
				) : !movieData ? (
					<div className="flex items-center justify-center h-full">
						<p>Movie data not available</p>
					</div>
				) : (
					<div className="relative w-full h-full">
						{/* Background image with overlay */}
						<div className="absolute inset-0 w-full h-full">
							<Image
								src={`https://image.tmdb.org/t/p/original/${movieData.movie.backdrop_path || movieData.movie.poster_path}`}
								alt={movieData.movie.title}
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
									src={`https://image.tmdb.org/t/p/original/${movieData.movie.poster_path}`}
									alt={movieData.movie.title}
									width={500}
									height={750}
									className="rounded-md shadow-lg object-cover h-full w-full"
								/>
							</div>
							<div>
								<DialogHeader>
									<DialogTitle className="text-xl text-white">
										{movieData.movie.title}
									</DialogTitle>
								</DialogHeader>
								<div className="flex gap-6 bg-transparent w-full h-full p-2 overflow-hidden">
									<div className="flex flex-col gap-4 text-white w-full h-full items-start">
										<div className="flex flex-col gap-2 max-w-sm shrink-0 grow-0">
											<StarRadio
												value={rating}
												id={movieData.id}
												onChange={(newValue) => {
													setRating(newValue);
												}}
											/>
										</div>
										<div className="flex flex-col gap-2 w-full h-full">
											<h2 className="text-lg font-semibold">Review</h2>
											<ReviewEditor movieData={movieData} />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
