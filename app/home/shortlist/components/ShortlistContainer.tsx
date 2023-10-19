"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import ItemSkeleton from "../edit/components/ItemSkeleton";
import ShortlistMovieItem from "../edit/search/components/ShortlistMovieItem";
import SelectionAlert from "../edit/components/SelectionAlert";
import SelectionRadio from "../edit/components/SelectionRadio";
import { Fragment, useTransition } from "react";
import { updateShortlistReadyState } from "../edit/actions/actions";
import SearchButton from "../edit/components/SearchButton";
import WatchlistButton from "../edit/components/WatchlistButton";
import ShortListItem from "../edit/components/ShortListItem";

export default function ShortlistContainer() {
  const { data: session } = useSession();
  const { data: shortlist, status: shortlistStatus } = useQuery({
    queryKey: ["shortlist", session?.user?.shortlistId],
    queryFn: async () => {
      let res = await fetch(`/api/shortlist/${session?.user.shortlistId}`, {});
      return await res.json();
    },
    enabled: !!session,
  });
  const [isPending, startTransition] = useTransition();

  if (shortlistStatus === "loading" && !shortlist) {
    return (
      <div className="flex flex-row gap-3 p-5 flex-wrap items-center sm:w-auto">
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
  console.log("layout", session);
  console.log('shortlist', shortlist)
  return (
    <Fragment key={`fragment-${shortlist.id}`}>
      {shortlist.requiresSelection && !shortlist.selectedIndex && (
        <SelectionAlert />
      )}
      <div
        className="flex flex-row justify-center place-items-center"
        key={`name-container-${shortlist.id}`}
      >
        <div
          className={`avatar mr-5 flex justify-center ${"hover:opacity-70"}`}
          key={`avatar-${shortlist.userId}`}
          onClick={() => {
            startTransition(() => {
              updateShortlistReadyState(!shortlist.isReady);
              //shortlist.isReady = !shortlist.isReady;
            });
          }}
        >
          <div
            className={`w-12 rounded-full ring ring-offset-base-200 ring-offset-2 ${
              shortlist.isReady ? "ring-success" : "ring-error"
            } `}
            key={`avatar-ring ${shortlist.userId}`}
          >
            {isPending ? (
              <span className="loading loading-spinner m-3"></span>
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
        className="flex flex-row gap-5 w-2/3 sm:w-auto"
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
