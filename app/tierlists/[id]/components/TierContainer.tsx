"use client";

import { useCallback, useState, useTransition } from "react";
import Tier from "./Tier";
import { produce } from "immer";
import { saveTierlist } from "../../actions/actions";
import { useMutation } from "@tanstack/react-query";
import { useNotificationStore } from "@/stores/useNotificationStore";

export default function TierContainer({
  tierlist,
  authorized,
}: {
  tierlist: Tierlist;
  authorized: boolean;
}) {
  const tiers = tierlist.tiers.map((tier) => tier.label);
  const movieMatrix = tierlist.tiers.map((tier) => {
    return tier.movies.map((movie) => movie);
  });
  const [containerState, setContainerState] = useState(movieMatrix);
  let [isPending, startTransition] = useTransition();
  const setNotification = useNotificationStore(
    (state) => state.setNotification
  );
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
      console.log("success!", data);
      setNotification("Tierlist updated!", "success");
    },
    onError: (error) => {
      console.log("error", error);
      setNotification("Updating tierlist failed!", "error");
    },
  });

  const moveItem = useCallback(
    (dragIndex: ItemCoordinates, hoverIndex: ItemCoordinates) => {
      if (authorized) {
        setContainerState((prevItems: Array<MovieOfTheWeek[]>) => {
          return produce(prevItems, (draft) => {
            let dragItem = { ...draft[dragIndex.tier][dragIndex.index] };

            draft[dragIndex.tier].splice(dragIndex.index, 1);
            draft[hoverIndex.tier].splice(hoverIndex.index, 0, dragItem);

            return draft;
          });
        });
      }
    },
    []
  );

  const handleSave = () => {
    // construct a tierlist from tiers and matrix
    const saveState = produce(tierlist, (draft) => {
      draft.tiers.forEach((tier) => {
        tier.movies = containerState[tier.value - 1];
      });
      return draft;
    });

    //startTransition(() => saveTierlist(saveState))
    saveMutation.mutate(saveState);
  };

  return (
    <>
      <button className="btn btn-outline btn-success" onClick={handleSave}>
        {saveMutation.isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <span>Save</span>
        )}
      </button>
      <div className="flex flex-col items-center gap-2 p-2">
        {tiers.map((tier, tierIndex) => {
          return (
            <Tier
              key={tier}
              label={tier}
              movies={containerState[tierIndex]}
              moveItem={moveItem}
              tierIndex={tierIndex}
            />
          );
        })}
      </div>
    </>
  );
}
