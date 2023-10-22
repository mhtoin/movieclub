"use client";
import { useSession } from "next-auth/react";
import ItemSkeleton from "../edit/components/ItemSkeleton";
import SelectionAlert from "../edit/components/SelectionAlert";
import { Fragment, useTransition } from "react";
import SearchButton from "../edit/components/SearchButton";
import WatchlistButton from "../edit/components/WatchlistButton";
import ShortListItem from "../edit/components/ShortListItem";
import { useShortlistQuery, useUpdateReadyStateMutation } from "@/lib/hooks";
import { RaffleClient } from "../../../components/RaffleClient";

export default function ShortlistContainer() {
  const { data: session } = useSession();
  const { data: shortlist, status: shortlistStatus } = useShortlistQuery(session?.user?.shortlistId)
  const readyStateMutation = useUpdateReadyStateMutation();

  if (shortlistStatus === "pending" && !shortlist) {
    return (
      <div className="flex flex-row gap-3 p-5 flex-wrap items-center sm:w-auto align-middle">
        <ItemSkeleton />
        <ItemSkeleton />
        <ItemSkeleton />
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
    <Fragment key={`fragment-${shortlist.id}`}>
      {shortlist.requiresSelection && (shortlist.selectedIndex === null && shortlist.selectedIndex !== 0) && (
        <SelectionAlert />
      )}
      <div
        className="flex flex-row justify-center place-items-center m-5"
        key={`name-container-${shortlist.id}`}
      >
        <div
          className={`avatar mr-5 flex justify-center ${"hover:opacity-70"} w-8 2xl:w-12`}
          key={`avatar-${shortlist.userId}`}
          onClick={() => {
            readyStateMutation.mutate({
              shortlistId: shortlist.id,
              isReady: !shortlist.isReady,
            });
          }}
        >
          <div
            className={`w-10 2xl:w-12 rounded-full ring ring-offset-base-200 ring-offset-2 ${
              shortlist.isReady ? "ring-success" : "ring-error"
            } `}
            key={`avatar-ring ${shortlist.userId}`}
          >
            {readyStateMutation.isPending ? (
              <span className="loading loading-spinner m-1 2xl:m-3"></span>
            ) : (
              <img
                src={session?.user?.image}
                alt=""
                key={`profile-img-${shortlist.userId}`}
              />
            )}
          </div>
        </div>

        <>
          <SearchButton />
          <WatchlistButton />
        
        </>
      </div>
      <div
        key={shortlist.id + "-container"}
        className="flex flex-row gap-5 w-2/3 sm:w-auto items-center"
      >
        {shortlist.movies.map((movie: Movie, index: number) => {
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
              removeFromShortList={true}
              index={index}
            />
          );
        })}
        {skeletons.map((skeleton) => {
          return skeleton;
        })}
      </div>
    </Fragment>
  );
}
