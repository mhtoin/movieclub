"use client";
import { useCallback, useState } from "react";
import TierItem from "./TierItem";
import { produce } from "immer";
import { useDrop } from "react-dnd";
import { Identifier } from "dnd-core";

export default function Tier({
  label,
  movies,
  moveItem,
  tierIndex
}: {
  label: string;
  movies: Array<MovieOfTheWeek>;
  tierIndex: number
  moveItem: (
    dragIndex: ItemCoordinates,
    hoverIndex: ItemCoordinates
  ) => void;
}) {
  const [{ handlerId }, drop] = useDrop<DraggableItem, void, { handlerId: Identifier | null}>({
    accept: "Item",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
  
  });
  
  return (
    <>
      <div className="divider">{label}</div>
      <div className="flex flex-row flex-wrap gap-5">
        {movies.map((movie, index) => {
          return (
            <TierItem
              key={movie.id}
              movie={movie}
              index={{ tier: tierIndex, index: index}}
              moveItem={moveItem}
            />
          );
        })}
      </div>
    </>
  );
}
