import type { TierMovieWithMovieData } from "@/types/tierlist.type"
import type { DraggableProvided } from "@hello-pangea/dnd"
import Image from "next/image"
export default function TierItem({
  item,
  provided,
}: {
  item: TierMovieWithMovieData
  provided: DraggableProvided
}) {
  return (
    <div
      className="indicator relative mx-auto max-w-[120px] min-w-[120px] shrink-0 rounded-md md:max-w-[150px] md:min-w-[150px] lg:max-w-[200px] lg:min-w-[200px]"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Image
        src={`https://image.tmdb.org/t/p/original/${item?.movie?.images?.posters[0]?.file_path}`}
        width={200}
        height={300}
        alt=""
        className="h-full w-full rounded-md object-cover transition-all duration-300 hover:brightness-75"
      />

      {/*item.id && (
        <div className="absolute top-0 right-0 rounded-md p-2">
          <ReviewDialog movie={item} />
        </div>
      )*/}
    </div>
  )
}
