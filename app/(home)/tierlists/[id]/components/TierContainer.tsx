"use client";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { produce } from "immer";
import { toast } from "sonner";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation,
} from "@hello-pangea/dnd";
import Link from "next/link";
import CreateForm from "./TierlistCreate";
import { useRouter } from "next/navigation";
import { ro } from "date-fns/locale";
import { Button } from "@/app/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Tier from "./Tier";
import TierDateFilter from "./TierDateFilter";
import TierCreate from "./TierCreate";
import { tierlistKeys } from "@/lib/tierlist/tierlistKeys";
import { movieKeys } from "@/lib/movies/movieKeys";
import { formatISO, nextWednesday } from "date-fns";
import { Toaster } from "@/app/components/ui/Toaster";
import { getQueryClient } from "@/lib/getQueryClient";

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
  allYears,
}: {
  tierlist: Tierlist;
  authorized: boolean;
  allYears: string[];
}) {
  const queryClient = getQueryClient();
  const [selectedDate, setSelectedDate] = useState(allYears[0]);
  const { data: tierlistData } = useQuery(tierlistKeys.byId(tierlist.id));
  const nextMovieDate = formatISO(nextWednesday(new Date()), {
    representation: "date",
  });
  const { data: moviesOfTheWeek } = useQuery({
    queryKey: ["moviesOfTheWeek"],
    queryFn: async () => {
      const res = await fetch(`/api/movies`);
      const data: MovieOfTheWeek[] = await res.json();
      return data;
    },
  });

  const tiers = ["Unranked"].concat(
    tierlistData?.tiers.map((tier) => tier.label) || []
  );

  const [containerState, setContainerState] = useState<
    MovieOfTheWeek[][] | undefined
  >(undefined);
  const setNotification = useNotificationStore(
    (state) => state.setNotification
  );

  useEffect(() => {
    console.log("setting local state");
    const movieMatrix = tierlistData?.tiers.map((tier) => {
      return tier.movies
        .filter((movie) =>
          selectedDate !== allYears[0]
            ? movie.watchDate?.split("-")[0] === selectedDate
            : true
        )
        .map((movie) => movie);
    });

    const unranked = moviesOfTheWeek?.filter((movie) => {
      const movieInList = tierlist.tiers
        .flatMap((tier) => tier.movies.map((movie) => movie.title))
        .includes(movie.title);
      return !movieInList;
    }) as unknown as MovieOfTheWeek[];

    if (unranked) {
      movieMatrix?.unshift(unranked);
    }
    setContainerState(movieMatrix);
  }, [tierlistData, moviesOfTheWeek]);

  const handleDateChange = (date: string) => {
    console.log(date);
    console.log(allYears[0]);
    setSelectedDate(date);
    const newUnranked = moviesOfTheWeek?.filter((movie) => {
      return date !== allYears[0]
        ? movie.watchDate?.split("-")[0] === date
        : true;
    });
    const newState = tierlist.tiers.map((tier) => {
      return tier.movies
        .filter((movie) =>
          date !== allYears[0] ? movie.watchDate?.split("-")[0] === date : true
        )
        .map((movie) => movie);
    });

    if (newUnranked) {
      newState.unshift(newUnranked);
    }
    setContainerState(newState);
  };

  function onDragEnd(result: DropResult) {
    console.log("onDragEnd", result);
    if (!authorized || !containerState || !tierlistData) {
      console.log("not authorized or containerState");
      return;
    }

    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    console.log("sInd", sInd);
    console.log("dInd", dInd);
    /**
     * !TODO refactor this to use immer
     */
    if (sInd === dInd) {
      const items = reorder(
        containerState?.[sInd],
        source.index,
        destination.index
      );
      const newState = [...containerState];
      newState[sInd] = items;

      const saveState = produce(tierlistData, (draft) => {
        draft.tiers.forEach((tier) => {
          tier.movies = newState[tier.value];
        });
      });
      setContainerState(newState);
      queryClient.setQueryData(["tierlists", tierlist.id], saveState);

      saveMutation.mutate(saveState);
    } else {
      console.log("moving item");
      const result = moveItem(
        containerState[sInd],
        containerState[dInd],
        source,
        destination
      );
      const newState = [...containerState];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      // mutate the tierlist
      const saveState = produce(tierlistData, (draft) => {
        draft.tiers.forEach((tier) => {
          tier.movies = newState[tier.value];
        });
      });
      setContainerState(newState);
      queryClient.setQueryData(["moviesOfTheWeek"], newState[0]);
      queryClient.setQueryData(["tierlists", tierlist.id], saveState);

      saveMutation.mutate(saveState);
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
    onSuccess: (data, variables, context) => {
      console.log("onSuccess", data);
      toast.success("Tierlist updated!");
    },
    onError: (error) => {
      setNotification("Updating tierlist failed!", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (tierlistId: string) => {
      let res = await fetch(`/api/tierlists/${tierlistId}`, {
        method: "DELETE",
      });

      let body = await res.json();

      if (body.ok) {
        return body;
      } else {
        throw new Error("Deleting tierlist failed");
      }
    },
    onSuccess: (data) => {
      setNotification("Tierlist cleared!", "success");
      window.location.reload();
    },
    onError: (error) => {
      setNotification("Deleting tierlist failed!", "error");
    },
  });

  const handleSave = () => {
    // construct a tierlist from tiers and matrix
    const saveState = produce(tierlist, (draft) => {
      draft.tiers.forEach((tier) => {
        tier.movies = containerState?.[tier.value] || [];
      });
      return draft;
    });

    saveMutation.mutate(saveState);
  };

  return (
    <>
      <div className="flex flex-row items-center gap-5 w-full justify-center">
        <Button
          onClick={handleSave}
          disabled={!authorized}
          variant="outline"
          size={"default"}
          isLoading={saveMutation.isPending}
        >
          Save
        </Button>
        <Button
          variant="outline"
          isLoading={deleteMutation.isPending}
          onClick={() => {
            if (containerState && containerState?.length > 1) {
              deleteMutation.mutate(tierlist.id);
            } else {
              if (document) {
                (
                  document.getElementById("createModal") as HTMLFormElement
                ).showModal();
              }
            }
          }}
          disabled={!authorized}
        >
          <span>
            {containerState && containerState?.length > 1 ? "Reset" : "Create"}
          </span>
        </Button>
        <TierDateFilter
          values={allYears}
          selectedDate={selectedDate}
          setSelectedDate={handleDateChange}
        />
      </div>
      <div className="flex flex-col items-start gap-10 md:gap-2 md:overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          {containerState?.map((tier, tierIndex) => (
            <Tier
              key={tierIndex}
              tierIndex={tierIndex}
              tier={tier}
              tiers={tiers}
            />
          ))}
        </DragDropContext>
        {tierlistData?.tiers && tierlistData?.tiers?.length <= 4 && (
          <TierCreate tierlistId={tierlist.id} />
        )}
      </div>
    </>
  );
}
