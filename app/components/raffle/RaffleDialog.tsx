"use client";
import * as Ariakit from "@ariakit/react";
import { Button } from "../ui/Button";
import {
  useRaffle,
  useShortlistsQuery,
  useUpdateParticipationMutation,
  useUpdateReadyStateMutation,
  useValidateSession,
} from "@/lib/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Dices, PenOff, Shuffle, UserPen } from "lucide-react";
import { shuffle } from "@/lib/utils";
import { ParticipationButton } from "./ParticipationButton";
import { motion } from "framer-motion";
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
  const { data: allShortlists, status } = useShortlistsQuery();
  const [shuffledMovies, setShuffledMovies] = useState<MovieWithUser[]>([]);

  const { data, mutate: raffle } = useRaffle();

  const movies: MovieWithUser[] = useMemo(() => {
    return allShortlists
      ? Object.entries(allShortlists).flatMap(([shortlistId, shortlist]) => {
          return shortlist?.requiresSelection && shortlist?.selectedIndex
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

  const nextIndex = useCallback(() => {
    setCurrentIndex((currentIndex + 1) % movies.length);
  }, [currentIndex, movies]);

  const resetRaffle = useCallback(() => {
    setCurrentIndex(0);
    setCount(0);

    setIsPlaying(false);
    setStarted(false);
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
        className="fixed bottom-10 right-16"
        isLoading={status === "pending"}
      >
        <Dices className="w-6 h-6" />
      </Button>
      <Ariakit.Dialog
        store={dialog}
        backdrop={
          <div className="bg-black/5 backdrop-blur-none transition-all duration-300 opacity-0 data-[enter]:opacity-100 data-[enter]:backdrop-blur-sm " />
        }
        className="fixed z-50 inset-3 flex flex-col gap-1 overflow-auto rounded-md border w-fit max-w-[50vw] max-h-[70vh] p-10 m-auto bg-background origin-bottom-right opacity-0 transition-all duration-300 scale-95 data-[enter]:opacity-100 data-[enter]:scale-100"
      >
        <div className="flex flex-col gap-5 p-5 justify-center items-center h-full">
          {finished && data ? (
            <ResultCard movie={data?.movie} />
          ) : (
            <>
              <Participants isEditing={isEditing} setIsEditing={setIsEditing} />
              <ActionButtons
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                setStarted={setStarted}
                shuffledMovies={shuffledMovies}
                setShuffledMovies={setShuffledMovies}
                resetRaffle={resetRaffle}
                raffle={raffle}
              />
              <RaffleItems
                shuffledMovies={shuffledMovies}
                currentIndex={currentIndex}
                started={started}
              />
            </>
          )}
        </div>
      </Ariakit.Dialog>
    </>
  );
}
