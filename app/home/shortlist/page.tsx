"use client";

import ShortListItem from "./edit/components/ShortListItem";
import { usePusher, useShortlistsQuery } from "@/lib/hooks";
import { Fragment } from "react";
import { range } from "@/lib/utils";
import ShortlistSkeleton from "./components/ShortlistSkeleton";

export default function ShortList() {
  const { data: allShortlists, isLoading, status } = useShortlistsQuery();
  usePusher("movieclub-shortlist", "shortlist-update");

  if (isLoading && !allShortlists) {
    return (
      <div className="flex max-h-screen flex-col items-center overflow-hidden">
      <div className="flex flex-col place-items-center m-5 p-5 gap-5 overflow-scroll max-h-[calc(100% - 100px)]">
        {range(3).map((index) => {
            return <ShortlistSkeleton key={index} index={index} />;
        })}
      </div>
    </div>
    );
  }



  return (
    <main className="flex max-h-screen max-w-screen flex-col items-center overflow-hidden">
      <div className="flex flex-col place-items-center gap-5 m-5 overflow-hidden">
        {allShortlists?.map((shortlist: Shortlist, index: number) => {
          return (
            <Fragment key={`fragment-${shortlist.id}`}>
              <div
                className="flex flex-row justify-center place-items-center m-2"
                key={`name-container-${shortlist.id}`}
              >
                <div
                  className={`avatar mr-5 flex justify-center w-8 2xl:w-10`}
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
                      className={`${shortlist.participating ? "opacity-100" : "opacity-20"} rounded-full`}
                    />
                  </div>
                </div>
                  <h1 key={shortlist.id + "-title"} className="text-xl">
                    {shortlist.user.name}
                  </h1>
              </div>
              <div
                key={shortlist.id + "-container"}
                className="flex flex-row gap-5 w-2/3 sm:w-auto"
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
              </div>
            </Fragment>
          );
        })}
      </div>
    </main>
  );
}
