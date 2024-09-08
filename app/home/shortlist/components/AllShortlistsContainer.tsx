"use client";

import { usePusher, useShortlistsQuery } from "@/lib/hooks";
import ItemSkeleton from "../edit/components/ItemSkeleton";
import { Fragment } from "react";
import ShortListItem from "../edit/components/ShortListItem";
import ShortlistSkeleton from "./ShortlistSkeleton";
import { range } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/Button";

export default function AllShortlistsContainer() {
  const { data: allShortlists, isLoading, status } = useShortlistsQuery();
  const { data: session } = useSession();
  usePusher("movieclub-shortlist", "shortlist-update");

  if (isLoading && !allShortlists && !session) {
    return (
      <div className="flex max-h-screen flex-col items-center overflow-hidden">
        <div className="flex flex-col place-items-center m-5 p-5 gap-5">
          {range(3).map((index) => {
            return <ShortlistSkeleton key={index} index={index} />;
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 w-full">
      {Object.values(allShortlists ?? {})?.map(
        (shortlist: Shortlist, index: number) => {
          const movies = (shortlist?.movies as Movie[]) || [];
          const skeletons =
            movies?.length < 3
              ? [...new Array(3 - movies.length)].map((element, index) => (
                  <ItemSkeleton key={index} />
                ))
              : [];
          if (shortlist.id !== session?.user?.shortlistId) {
            return (
              <div
                key={`fragment-${shortlist?.id}`}
                className="flex flex-col justify-center items-center border rounded-3xl p-5 gap-2 bg-card"
              >
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
                  className="flex flex-row w-full items-center gap-5 p-5 border rounded-xl bg-background"
                  key={`name-container-${shortlist?.id}`}
                >
                  <Button
                    variant={"outline"}
                    size={"avatar"}
                    className={`flex justify-center ${"hover:opacity-70"} transition-colors outline ${
                      shortlist?.isReady ? "outline-success" : "outline-error"
                    }
        }`}
                    key={`avatar-${shortlist?.userId}`}
                  >
                    <img
                      src={shortlist?.user?.image}
                      alt=""
                      key={`profile-img-${shortlist?.userId}`}
                    />
                  </Button>
                  {shortlist.user.name}
                </div>
              </div>
            );
          }
        }
      )}
    </div>
  );
}
