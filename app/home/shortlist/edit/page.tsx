"use client";
import Link from "next/link";
import ReadyToggle from "./components/ReadyToggle";
import {
  updateShortlistParticipation,
  updateShortlistReadyState,
} from "./actions/actions";
import { useShortlistQuery } from "@/lib/hooks";
import { useSession } from "next-auth/react";

export default function ShortListEdit() {
  const { data: session, status } = useSession();
  const { data: shortlistData, status: shortlistStatus } = useShortlistQuery(
    session?.user?.shortlistId
  );

  if (shortlistStatus === "success" && shortlistData) {
    const movies = (shortlistData?.movies as Movie[]) || [];

    return (
      <div className="flex min-w-fit flex-col items-center gap-5 overflow-hidden">
        {/*{shortlistData.requiresSelection && <SelectionAlert />}
        <ShortlistContainer />
        {shortlistData.requiresSelection && (
          <SelectionRadio
            length={movies.length}
            selectedIndex={shortlistData.selectedIndex}
          />
        )}*/}

        <div className="flex flex-row gap-1">
          <ReadyToggle
            isReady={shortlistData.isReady}
            onToggle={updateShortlistReadyState}
            label="Ready"
          />

          <ReadyToggle
            isReady={shortlistData.participating}
            onToggle={updateShortlistParticipation}
            label="Participating"
          />
        </div>
        <div className="flex flex-row items-center gap-5">
          <Link href={"/home/shortlist/edit/watchlist"}>
            <button className="btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
              Watchlist
            </button>
          </Link>
          <Link href={"/home/shortlist/edit/search"}>
            <button className="btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              Search
            </button>
          </Link>
        </div>
      </div>
    );
  }
}
