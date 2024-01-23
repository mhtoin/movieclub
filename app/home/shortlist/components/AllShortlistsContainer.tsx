"use client";

import { usePusher, useShortlistsQuery } from "@/lib/hooks";
import ItemSkeleton from "../edit/components/ItemSkeleton";
import { Fragment } from "react";
import ShortListItem from "../edit/components/ShortListItem";
import ShortlistSkeleton from "./ShortlistSkeleton";
import { range } from "@/lib/utils";
import { useSession } from "next-auth/react";

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
    <div className="flex flex-col place-items-center gap-2 overflow-hidden">
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
              <Fragment key={`fragment-${shortlist.id}`}>
                <div
                  className="flex flex-row m-2 justify-center place-items-center "
                  key={`name-container-${shortlist.id}`}
                >
                  <div
                    className={`avatar mr-5 flex justify-center w-8 2xl:w-12`}
                    key={`avatar-${shortlist.userId}`}
                  >
                    <div
                      className={`w-12 rounded-full ring ring-offset-base-200 ring-offset-2 ${
                        shortlist.isReady ? "ring-success" : "ring-error"
                      } `}
                      key={`avatar-ring ${shortlist.userId}`}
                    >
                      <img
                        src={shortlist?.user?.image}
                        alt=""
                        key={`profile-img-${shortlist.userId}`}
                        className={`${
                          shortlist.participating ? "opacity-100" : "opacity-20"
                        } rounded-full`}
                      />
                    </div>
                  </div>
                  <h1
                    key={shortlist.id + "-title"}
                    className="text-xl max-w-[40px]"
                  >
                    {index == 0
                      ? shortlist.user.name + "burner"
                      : shortlist.user.name}
                  </h1>
                </div>
                <div
                  key={shortlist.id + "-container"}
                  className="flex flex-row gap-5 w-2/3 sm:w-auto items-center pt-5 lg:p-5"
                >
                  {shortlist.movies.map((movie, index) => {
                    return (
                      <ShortListItem
                        key={shortlist.id + movie.id}
                        movie={movie}
                        shortlistId={shortlist.id}
                        highlight={
                          shortlist.requiresSelection &&
                          shortlist.selectedIndex === index
                            ? true
                            : false
                        }
                        requiresSelection={false}
                        removeFromShortList={false}
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
        }
      )}
    </div>
  );
}
