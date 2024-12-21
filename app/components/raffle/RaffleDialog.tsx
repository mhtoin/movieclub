"use client";
import * as Ariakit from "@ariakit/react";
import { Button } from "../ui/Button";
import { useRaffle, useShortlistsQuery } from "@/lib/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight, Dices } from "lucide-react";
import ResultCard from "./ResultCard";
import Participants from "./Participants";
import ActionButtons from "./ActionButtons";
import RaffleItems from "./RaffleItems";

export default function RaffleDialog() {
  const dialog = Ariakit.useDialogStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { data: allShortlists, status } = useShortlistsQuery();
  const [shuffledMovies, setShuffledMovies] = useState<MovieWithUser[]>([]);
  const { data, mutate: raffle } = useRaffle();

  const isDev = process.env.NODE_ENV === "development";

  const movies: MovieWithUser[] = useMemo(() => {
    return allShortlists
      ? Object.entries(allShortlists)
          .filter(([_, shortlist]) => shortlist.participating)
          .flatMap(([shortlistId, shortlist]) => {
            return shortlist.requiresSelection &&
              shortlist.selectedIndex !== null &&
              shortlist.selectedIndex !== undefined
              ? {
                  ...shortlist?.movies[shortlist?.selectedIndex],
                  user: shortlist?.user,
                }
              : shortlist?.movies?.map((movie) => ({
                  ...movie,
                  user: shortlist?.user,
                }));
          })
      : [];
  }, [allShortlists]);

  const allReady = useMemo(() => {
    return allShortlists
      ? Object.values(allShortlists)
          .filter((shortlist) => shortlist.participating)
          .every(
            (shortlist) =>
              shortlist.isReady &&
              (shortlist.requiresSelection
                ? shortlist.selectedIndex !== null &&
                  shortlist.selectedIndex !== undefined
                : true)
          )
      : false;
  }, [allShortlists]);

  const nextIndex = useCallback(() => {
    setCurrentIndex((currentIndex + 1) % movies.length);
    const nextMovie = document.getElementById(
      `movie-${movies[currentIndex].id}-${movies[currentIndex].user?.id}`
    );
    nextMovie?.scrollIntoView({ behavior: "smooth" });
  }, [currentIndex, movies]);

  const resetRaffle = useCallback(() => {
    setCurrentIndex(0);
    setCount(0);

    setIsPlaying(false);
    setStarted(false);
    setFinished(false);
  }, []);

  useEffect(() => {
    setShuffledMovies(movies);
  }, [movies]);

  useEffect(() => {
    if (isPlaying) {
      if (currentIndex === data?.chosenIndex && count > 3) {
        setIsPlaying(false);
        console.log("finishing up the raffle");
        setTimeout(() => {
          setFinished(true);
        }, 1000);
      }
      // if the count is greater than 3, then we need start slowing down the interval

      const interval = setInterval(
        () => {
          if (currentIndex === movies.length - 1) {
            const nextCount = count + 1;
            setCount(nextCount);
          }
          nextIndex();
        },
        count > 3 ? 500 : 200
      );
      return () => clearInterval(interval);
    }
  }, [
    isPlaying,
    nextIndex,
    count,
    currentIndex,
    data?.chosenIndex,
    movies.length,
  ]);

  return (
    <>
      <Button
        onClick={dialog.show}
        variant={"outline"}
        size={"iconLg"}
        className="fixed bottom-10 right-16 z-50"
      >
        <Dices className="w-6 h-6" />
      </Button>
      <Ariakit.Dialog
        store={dialog}
        onClose={resetRaffle}
        backdrop={
          <div className="bg-black/5 backdrop-blur-none transition-all duration-300 opacity-0 data-[enter]:opacity-100 data-[enter]:backdrop-blur-sm " />
        }
        className="fixed z-50 inset-3 flex flex-col gap-1 overflow-auto rounded-md border max-w-[80vw] lg:max-w-[70vw] 2xl:max-w-[60vw] m-auto bg-background origin-bottom-right opacity-0 transition-all duration-300 scale-95 data-[enter]:opacity-100 data-[enter]:scale-100"
      >
        {finished && data ? (
          <div className="flex flex-col gap-5 justify-center items-center">
            <ResultCard movie={data?.movie} />
          </div>
        ) : (
          <div className="flex flex-row gap-5 justify-center items-center h-full w-full">
            <div
              className={`flex flex-col justify-start gap-5 h-full border-r border-border pt-5 relative transition-all duration-300 ${
                sidebarExpanded ? "w-[250px]" : "w-[0px]"
              }`}
            >
              <div
                className={`absolute top-1/2 -translate-y-1/2 ${
                  sidebarExpanded ? "-right-3" : "-right-5"
                }`}
              >
                <Button
                  variant={"outline"}
                  size={"iconSm"}
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                >
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-300 ${
                      sidebarExpanded ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>
              <div
                className={`overflow-hidden ${
                  sidebarExpanded ? "opacity-100" : "opacity-100"
                }`}
              >
                <Participants
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                />
              </div>
            </div>
            <div className="flex flex-col gap-5 items-center h-full flex-1  @container/items pt-5 ">
              <h3 className="text-lg font-bold">Movies</h3>
              <ActionButtons
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                setStarted={setStarted}
                shuffledMovies={shuffledMovies}
                setShuffledMovies={setShuffledMovies}
                resetRaffle={resetRaffle}
                raffle={raffle}
                disabled={!allReady}
              />
              <RaffleItems
                shuffledMovies={shuffledMovies}
                currentIndex={currentIndex}
                started={started}
              />
            </div>
          </div>
        )}
      </Ariakit.Dialog>
    </>
  );
}
