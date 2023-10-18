"use client";

import Link from "next/link";
import ShortListItem from "./edit/components/ShortListItem";
import { RaffleClient } from "../components/RaffleClient";
import { usePusher, useShortlistsQuery } from "@/lib/hooks";
import { Fragment, useTransition } from "react";
import SearchButton from "./edit/components/SearchButton";
import WatchlistButton from "./edit/components/WatchlistButton";
import { updateShortlistReadyState } from "./edit/actions/actions";
import { useSession } from "next-auth/react";
import SelectionAlert from "./edit/components/SelectionAlert";

export default function ShortList() {
  const { data: allShortlists, isLoading, status } = useShortlistsQuery();
  const { data: session } = useSession();
  let [isPending, startTransition] = useTransition();

  usePusher("movieclub-shortlist", "shortlist-update");

  if (isLoading && !allShortlists) {
    return (
      <div className="flex flex-col items-center justify-center align-middle min-h-screen min-w-full">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <main className="flex max-h-screen flex-col items-center p-12 overflow-hidden">
      <div className="flex flex-col place-items-center m-5 gap-5">
        {allShortlists?.map((shortlist: Shortlist, index: number) => {
          const isOwner = session?.user?.shortlistId === shortlist.id;
          return (
            <Fragment key={`fragment-${shortlist.id}`}>
              {isOwner &&
                shortlist.requiresSelection &&
                !shortlist.selectedIndex && <SelectionAlert />}
              <div
                className="flex flex-row justify-center place-items-center"
                key={`name-container-${shortlist.id}`}
              >
                <div
                  className={`avatar mr-5 flex justify-center ${
                    isOwner && "hover:opacity-70"
                  }`}
                  key={`avatar-${shortlist.userId}`}
                  onClick={() => {
                    if (isOwner) {
                      startTransition(() => {
                        updateShortlistReadyState(!shortlist.isReady);
                        //shortlist.isReady = !shortlist.isReady;
                      });
                    }
                  }}
                >
                  <div
                    className={`w-12 rounded-full ring ring-offset-base-200 ring-offset-2 ${
                      shortlist.isReady ? "ring-success" : "ring-error"
                    } `}
                    key={`avatar-ring ${shortlist.userId}`}
                  >
                    {isOwner && isPending ? (
                      <span className="loading loading-spinner m-3"></span>
                    ) : (
                      <img
                        src={shortlist?.user?.image}
                        alt=""
                        key={`profile-img-${shortlist.userId}`}
                      />
                    )}
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
                      requiresSelection={shortlist.requiresSelection}
                      removeFromShortList={isOwner}
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
