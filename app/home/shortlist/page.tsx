"use client";

import Link from "next/link";
import ShortListItem from "./edit/components/ShortListItem";
import { RaffleClient } from "../components/RaffleClient";
import { usePusher, useShortlistsQuery } from "@/lib/hooks";
import { Fragment } from "react";
import SearchButton from "./edit/components/SearchButton";
import WatchlistButton from "./edit/components/WatchlistButton";

export default function ShortList() {
  const { data: allShortlists, isLoading, status } = useShortlistsQuery();
  usePusher("movieclub-shortlist", "shortlist-update");

  if (isLoading && !allShortlists) {
    return (
      <div className="flex flex-col items-center justify-center align-middle min-h-screen min-w-full">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-12 overflow-hidden">
      <div className="flex flex-col place-items-center m-5 gap-5">
        {allShortlists?.map((shortlist: Shortlist, index: number) => {
          return (
            <Fragment key={`fragment-${shortlist.id}`}>
              <div
                className="flex flex-row justify-center place-items-center"
                key={`name-container-${shortlist.id}`}
              >
                <div className="avatar mr-5" key={`avatar-${shortlist.userId}`}>
                  <div
                    className={`w-12 rounded-full ring ring-offset-base-200 ring-offset-2 ${
                      shortlist.isReady ? "ring-success" : "ring-error"
                    }`}
                    key={`avatar-ring ${shortlist.userId}`}
                  >
                    <img
                      src={shortlist?.user?.image}
                      alt=""
                      key={`profile-img-${shortlist.userId}`}
                    />
                  </div>
                </div>
                {index > 0 && (
                  <h1 key={shortlist.id + "-title"} className="text-xl">
                    {shortlist.user.name}
                  </h1>
                )}
                {index === 0 && (
                  <>
                    <SearchButton />
                    <WatchlistButton />
                  </>
                )}
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
