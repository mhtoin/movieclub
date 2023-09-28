"use client";
import Link from "next/link";
import Shortlist from "./components/Shortlist";
import ReadyToggle from "./components/ReadyToggle";
import { getServerSession } from "@/lib/getServerSession";
import { getShortList } from "@/lib/shortlist";
import SelectionRadio from "./components/SelectionRadio";
import SelectionAlert from "./components/SelectionAlert";
import {
  updateShortlistParticipation,
  updateShortlistReadyState,
} from "./actions/actions";
import { useShortlistQuery } from "@/lib/hooks";
import { useSession } from "next-auth/react";
import ShortlistContainer from "./components/ShortlistContainer";

export default function ShortListEdit() {
  const { data: session, status } = useSession();
  console.log('session', session)
  const { data: shortlistData, status: shortlistStatus } = useShortlistQuery(
    session?.user.userId
  );
  console.log('shortlistData', shortlistData)

  if (shortlistStatus === "success" && shortlistData) {
    const movies = (shortlistData?.movies as Movie[]) || [];
    console.log('movies', movies)

    return (
      <div className="flex min-w-fit flex-col items-center gap-5 overflow-hidden">
        {shortlistData.requiresSelection && <SelectionAlert />}

        <ShortlistContainer shortlist={shortlistData} />

        {shortlistData.requiresSelection && (
          <SelectionRadio
            length={movies.length}
            selectedIndex={shortlistData.selectedIndex}
          />
        )}

        <div className="flex flex-row gap-5">
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
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <Link href={"/home/shortlist/edit/watchlist"}>
            <div className="btn">Add from watchlist</div>
          </Link>
          <Link href={"/home/shortlist/edit/search"}>
            <div className="btn">Search</div>
          </Link>
        </div>
      </div>
    );
  }
}
