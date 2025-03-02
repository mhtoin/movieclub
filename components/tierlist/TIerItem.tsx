import ReviewDialog from "@/components/tierlist/ReviewDialog";
import type { MovieWithUser } from "@/types/movie.type";
import type { TierMovieWithMovieData } from "@/types/tierlist.type";
import type { DraggableProvided } from "@hello-pangea/dnd";
import Image from "next/image";
import Link from "next/link";
export default function TierItem({
	item,
	provided,
}: {
	item: MovieWithUser | TierMovieWithMovieData;
	provided: DraggableProvided;
}) {
	console.log("item", item);

	return (
		<div
			className="relative indicator mx-auto border-2 rounded-md max-w-[120px] md:max-w-[150px] lg:max-w-[200px] min-w-[120px] md:min-w-[150px] lg:min-w-[200px] shrink-0"
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
		>
			<Link href={`/home/movies/${item.id}`}>
				<Image
					src={`https://image.tmdb.org/t/p/original/${
						"poster_path" in item ? item.poster_path : item.movie.poster_path
					}`}
					width={200}
					height={300}
					alt=""
					className="h-full w-full object-cover [mask-image:radial-gradient(200%_200%_at_0%_100%,#fff,transparent)]"
				/>
			</Link>
			{"rating" in item && (
				<div className="absolute top-0 right-0 rounded-md p-2">
					<ReviewDialog movie={item} />
				</div>
			)}
		</div>
	);
}
