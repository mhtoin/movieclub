"use client";
import { useSession } from "next-auth/react";
import ItemSkeleton from "../edit/components/ItemSkeleton";
import SelectionAlert from "../edit/components/SelectionAlert";
import { Fragment, useTransition } from "react";
import SearchButton from "../edit/components/SearchButton";
import WatchlistButton from "../edit/components/WatchlistButton";
import ShortListItem from "../edit/components/ShortListItem";
import { useShortlistsQuery, useUpdateReadyStateMutation } from "@/lib/hooks";
import { RaffleClient } from "../../../components/RaffleClient";
import { Button } from "@/app/components/ui/Button";

export default function ShortlistContainer() {
  const { data: session } = useSession();
  //const { data: shortlist, status: shortlistStatus } = useShortlistQuery(session?.user?.shortlistId)
  const { data: allShortlists, isLoading, status } = useShortlistsQuery();
  const readyStateMutation = useUpdateReadyStateMutation();
  const shortlist = allShortlists?.[session?.user?.shortlistId];

  if (status === "pending" && !shortlist) {
    return (
      <div className="flex flex-col justify-center place-items-center">
        <div
          className="flex flex-row justify-center items-center gap-2 p-5"
          key={`name-container-${session?.user?.shortlistId}`}
        >
          <div className="h-12 w-12 rounded-full bg-primary border"></div>
          <div>
            <SearchButton />
            <WatchlistButton />
          </div>
        </div>
        <div className="flex flex-row gap-5 w-2/3 sm:w-auto items-center">
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
        </div>
      </div>
    );
  }

  const movies = (shortlist?.movies as Movie[]) || [];
  const skeletons =
    movies?.length < 3
      ? [...new Array(3 - movies.length)].map((element, index) => (
          <ItemSkeleton key={index} />
        ))
      : [];

  return (
    <div
      key={`fragment-${shortlist?.id}`}
      className="flex flex-col justify-center items-center border rounded-3xl p-5 gap-2 bg-card"
    >
      {shortlist?.requiresSelection &&
        shortlist.selectedIndex === null &&
        shortlist.selectedIndex !== 0 && <SelectionAlert />}
      <div
        key={shortlist?.id + "-container"}
        className="flex flex-row gap-5 sm:w-auto items-center pt-5 lg:p-5 border rounded-xl bg-background"
      >
        {shortlist?.movies.map((movie: Movie, index: number) => {
          return (
            <ShortListItem
              key={shortlist.id + movie.id}
              movie={movie}
              shortlistId={shortlist.id}
              highlight={
                shortlist.requiresSelection && shortlist.selectedIndex === index
                  ? true
                  : false
              }
              requiresSelection={shortlist.requiresSelection}
              removeFromShortList={shortlist?.id === session?.user?.shortlistId}
              index={index}
              showActions={true}
            />
          );
        })}
        {skeletons.map((skeleton) => {
          return skeleton;
        })}
      </div>
      <div
        className="flex flex-row w-full items-center gap-2 p-5 border rounded-xl bg-background"
        key={`name-container-${shortlist?.id}`}
      >
        <Button
          variant={"outline"}
          size={"avatar"}
          className={`flex justify-center ${"hover:opacity-70"} transition-colors outline ${
            shortlist?.isReady ? "outline-success" : "outline-error"
          }
          ${readyStateMutation.isPending ? "animate-pulse" : ""}
          }`}
          key={`avatar-${shortlist?.userId}`}
          onClick={() => {
            if (shortlist) {
              readyStateMutation.mutate({
                shortlistId: shortlist.id,
                isReady: !shortlist.isReady,
              });
            }
          }}
        >
          <img
            src={session?.user?.image}
            alt=""
            key={`profile-img-${shortlist?.userId}`}
          />
        </Button>
        <div>
          <SearchButton />
          <WatchlistButton />
        </div>

        <RaffleClient />
      </div>
    </div>
  );
}
