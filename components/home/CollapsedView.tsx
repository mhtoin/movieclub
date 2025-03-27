import type { MovieWithReviews } from "@/types/movie.type";

export default function CollapsedView({
	movie,
}: {
	movie: MovieWithReviews;
}) {
	return (
		<div className="flex w-full h-full items-center">
			<h2 className="text-3xl font-bold [writing-mode:vertical-lr] text-primary-foreground">
				{movie.title.toLocaleUpperCase()}
			</h2>
		</div>
	);
}
