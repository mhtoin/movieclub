import ReviewEditor from "@/components/tierlist/ReviewEditor";
import { Input } from "@/components/ui/Input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { MovieWithUser } from "@/types/movie.type";
import { Star } from "lucide-react";
import Image from "next/image";

export default function ReviewDialog({ movie }: { movie: MovieWithUser }) {
	return (
		<Dialog>
			<DialogTrigger>
				<Star className="w-4 h-4 text-yellow-500 hover:text-yellow-600 hover:scale-110 fill-transparent hover:fill-yellow-600 transition-all duration-300" />
			</DialogTrigger>
			<DialogContent className="max-w-3xl max-h-[90vh] h-[70vh] overflow-hidden p-0">
				{/* Background image container */}
				<div className="relative w-full h-full">
					{/* Background image with overlay */}
					<div className="absolute inset-0 w-full h-full">
						<Image
							src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path || movie.poster_path}`}
							alt={movie.title}
							fill
							className="object-cover opacity-30 blur-sm"
							priority
						/>
						{/* Dark overlay for better readability */}
						<div className="absolute inset-0 bg-black/50" />
					</div>

					{/* Content container with proper padding and z-index */}
					<div className="relative z-10 grid grid-cols-2 gap-4 p-6 w-full h-full overflow-y-auto">
						<div className="flex-shrink-0 col-span-1 h-full w-full border">
							<Image
								src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
								alt={movie.title}
								width={500}
								height={750}
								className="rounded-md shadow-lg object-cover h-full w-full"
							/>
						</div>
						<div>
							<DialogHeader>
								<DialogTitle className="text-xl text-white">{movie.title}</DialogTitle>
							</DialogHeader>
							<div className="flex gap-6 bg-transparent w-full h-full border p-2">
								<div className="flex flex-col gap-4 text-white w-full h-full items-start">
									<div className="flex flex-col gap-2 max-w-sm shrink-0 grow-0">
										<span>Score</span>
										<Input type="number" step={0.25} min={0} max={5} />
									</div>
									<div className="flex flex-col gap-2 w-full border">
										<h2 className="text-lg font-semibold">Review</h2>
										<ReviewEditor />
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
