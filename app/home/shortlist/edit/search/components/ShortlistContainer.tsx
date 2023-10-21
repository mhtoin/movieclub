"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import ShortlistMovieItem from "./ShortlistMovieItem";
import ItemSkeleton from "../../components/ItemSkeleton";
import SelectionAlert from "../../components/SelectionAlert";
import SelectionRadio from "../../components/SelectionRadio";

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

  if (shortlistStatus === "pending" && !shortlist) {
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

  return (
    <>
      <div className="flex flex-row gap-3 p-5 flex-wrap items-center sm:w-auto">
        {shortlist
          ? shortlist?.movies?.map((movie: Movie) => {
              return (
                <ShortlistMovieItem
                  key={movie.tmdbId}
                  movie={movie}
                  shortlistId={session?.user.shortlistId}
                />
              );
            })
          : []}
        {skeletons.map((skeleton) => {
          return skeleton;
        })}
      </div>
      {shortlist.requiresSelection && !shortlist.selectedIndex && <SelectionAlert />}
      {shortlist.requiresSelection && (
        <SelectionRadio
          length={movies.length}
          selectedIndex={shortlist.selectedIndex}
        />
      )}
    </>
  );
}
