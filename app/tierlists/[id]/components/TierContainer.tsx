"use client";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation,
} from "@hello-pangea/dnd";
import Link from "next/link";

type MoveItemObject = {
  [x: string]: MovieOfTheWeek[];
};
const reorder = (
  tier: MovieOfTheWeek[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(tier);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const moveItem = (
  sourceTier: MovieOfTheWeek[],
  destinationTier: MovieOfTheWeek[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(sourceTier);
  const destinationClone = Array.from(destinationTier);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destinationClone.splice(droppableDestination.index, 0, removed);

  const result = {} as MoveItemObject;
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destinationClone;
  return result;
};

export default function DnDTierContainer({
  tierlist,
  authorized,
  unranked,
}: {
  tierlist: Tierlist;
  authorized: boolean;
  unranked: MovieOfTheWeek[];
}) {
  const tiers = ["Unranked"].concat(tierlist.tiers.map((tier) => tier.label));
  const movieMatrix = tierlist.tiers.map((tier) => {
    return tier.movies.map((movie) => movie);
  });

  if (unranked) {
    movieMatrix.unshift(unranked);
  }
  const [containerState, setContainerState] = useState(movieMatrix);
  const setNotification = useNotificationStore(
    (state) => state.setNotification
  );

  function onDragEnd(result: DropResult) {
    if (!authorized) {
      return;
    }
    
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    /**
     * !TODO refactor this to use immer
     */
    if (sInd === dInd) {
      const items = reorder(
        containerState[sInd],
        source.index,
        destination.index
      );
      const newState = [...containerState];
      newState[sInd] = items;
      setContainerState(newState);
    } else {
      const result = moveItem(
        containerState[sInd],
        containerState[dInd],
        source,
        destination
      );
      const newState = [...containerState];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setContainerState(newState);
    }
  }

  const saveMutation = useMutation({
    mutationFn: async (saveState: Tierlist) => {
      let res = await fetch(`/api/tierlists/${saveState.id}`, {
        method: "PUT",
        body: JSON.stringify(saveState),
      });

      let body = await res.json();

      if (body.ok) {
        return body;
      } else {
        throw new Error("Updating tierlist failed");
      }
    },
    onSuccess: (data) => {
      setNotification("Tierlist updated!", "success");
    },
    onError: (error) => {
      setNotification("Updating tierlist failed!", "error");
    },
  });

  const handleSave = () => {
    // construct a tierlist from tiers and matrix
    const saveState = produce(tierlist, (draft) => {
      draft.tiers.forEach((tier) => {
        tier.movies = containerState[tier.value];
      });
      return draft;
    });

    saveMutation.mutate(saveState);
  };

  return (
    <>
      <button
        className="btn btn-outline btn-success"
        onClick={handleSave}
        disabled={!authorized}
      >
        {saveMutation.isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <span>Save</span>
        )}
      </button>

      <div className="flex flex-col items-center gap-2">
        <DragDropContext onDragEnd={onDragEnd}>
          {containerState.map((tier, tierIndex) => (
            <>
              {tierIndex === 0 && tier.length === 0 ? (
                <div></div>
              ) : (
                <div className={`divider`}>
                  <div className="badge badge-secondary badge-lg">
                    {tiers[tierIndex]}
                  </div>
                </div>
              )}
              <Droppable
                key={tierIndex}
                droppableId={`${tierIndex}`}
                direction="horizontal"
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    className="flex flex-row gap-5 p-2 m-2 max-w-xs overflow-y-auto lg:max-w-[1000px] xl:max-w-[1500px]"
                    {...provided.droppableProps}
                  >
                    {tier.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id!}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className="indicator mx-auto border-2 rounded-md max-w-[70px] md:max-w-[80px] lg:max-w-[90px] shrink-0"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Link href={`/home/movies/${item.id}`}>
                              <img
                                src={`http://image.tmdb.org/t/p/original/${item["poster_path"]}`}
                                alt=""
                                
                              />
                            </Link>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </>
          ))}
        </DragDropContext>
      </div>
    </>
  );
}
