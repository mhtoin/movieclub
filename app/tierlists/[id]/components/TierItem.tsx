"use client";

import Link from "next/link";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from 'dnd-core'
export default function TierItem({
  movie,
  index,
  moveItem,
}: {
  movie: MovieOfTheWeek;
  index: ItemCoordinates
  moveItem: (
    dragIndex: ItemCoordinates,
    hoverIndex: ItemCoordinates
  ) => void;
}) {
  const id = movie.id;
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<DraggableItem, void, { handlerId: Identifier | null}>({
    accept: "Item",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DraggableItem, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex.tier === hoverIndex.tier && dragIndex.index === hoverIndex.index) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleX =
        (hoverBoundingRect.left - hoverBoundingRect.right) / 2;

      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.right;

      if (dragIndex.index < hoverIndex.index && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging upwards
      if (dragIndex.index > hoverIndex.index && hoverClientX > hoverMiddleX) {
        return;
      }

      console.log('moving item')
      moveItem(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "Item",
    item: () => {
      return { id, index } as DraggableItem;
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  return (
    <div
      className="indicator mx-auto border-2 rounded-md"
      ref={ref}
      data-handler-id={handlerId}
    >
      <Link href={`/home/movies/${movie.id}`}>
        <img
          src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
          alt=""
          width={"150"}
        />
      </Link>
    </div>
  );
}
