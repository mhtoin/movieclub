import ReviewDialog from "@/components/tierlist/ReviewDialog";
import type { TierMovieWithMovieData } from "@/types/tierlist.type";
import type { DraggableProvided } from "@hello-pangea/dnd";
import Image from "next/image";
export default function TierItem({
	item,
	provided,
}: {
	item: TierMovieWithMovieData;
	provided: DraggableProvided;
}) {
	return (
		<div
			className="relative indicator mx-auto rounded-md max-w-[120px] md:max-w-[150px] lg:max-w-[200px] min-w-[120px] md:min-w-[150px] lg:min-w-[200px] shrink-0"
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
		>
			<Image
				src={`https://image.tmdb.org/t/p/original/${
					"poster_path" in item ? item.poster_path : item.movie.poster_path
				}`}
				width={200}
				height={300}
				alt=""
				className="h-full w-full object-cover hover:brightness-75 transition-all duration-300 rounded-md"
			/>

			{item.id && (
				<div className="absolute top-0 right-0 rounded-md p-2">
					<ReviewDialog movie={item} />
				</div>
			)}
		</div>
	);
}
