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
import ConfettiExploder from "../ui/ConfettiExploder";

export default function RaffleDialog() {
  const dialog = Ariakit.useDialogStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [started, setStarted] = useState(false);
  const { data: allShortlists, status } = useShortlistsQuery();
  const [shuffledMovies, setShuffledMovies] = useState<Movie[]>([]);
  const { data: currentUser } = useValidateSession();
  const { status: updateParticipationStatus, mutate: updateParticipation } =
    useUpdateParticipationMutation();
  const {
    variables: readyStateVariables,
    status: updateReadyStateStatus,
    mutate: updateReadyState,
  } = useUpdateReadyStateMutation();

  const { data, mutate: raffle } = useRaffle();

  const movies = useMemo(() => {
    return allShortlists
      ? Object.entries(allShortlists).flatMap(([shortlistId, shortlist]) => {
          return shortlist?.requiresSelection && shortlist?.selectedIndex
            ? shortlist?.movies[shortlist?.selectedIndex]
            : shortlist?.movies;
        })
      : [];
  }, [allShortlists]);

  const nextIndex = useCallback(() => {
    setCurrentIndex((currentIndex + 1) % movies.length);
  }, [currentIndex, movies]);

  const distanceToChosenIndex = useMemo(() => {
    return Math.abs(data?.chosenIndex - currentIndex);
  }, [data?.chosenIndex, currentIndex]);

  const resetRaffle = useCallback(() => {
    setCurrentIndex(0);
    setCount(0);

    setIsPlaying(false);
    setStarted(false);
  }, []);
  useEffect(() => {
    console.log("setting shuffled movies");
    setShuffledMovies(movies);
  }, [movies]);

  useEffect(() => {
    if (isPlaying) {
      if (currentIndex === data?.chosenIndex && count > 3) {
        setIsPlaying(false);
        return;
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
      >
        <Dices className="w-6 h-6" />
      </Button>
      <Ariakit.Dialog
        store={dialog}
        backdrop={
          <div className="bg-black/5 backdrop-blur-none transition-all duration-300 opacity-0 data-[enter]:opacity-100 data-[enter]:backdrop-blur-sm " />
        }
        className="fixed z-50 inset-3 flex flex-col gap-1 overflow-auto rounded-md border max-w-[70vw] p-10 min-w-96 m-auto bg-background origin-bottom-right opacity-0 transition-all duration-300 scale-95 data-[enter]:opacity-100 data-[enter]:scale-100"
      >
        <div className="flex flex-col gap-5 p-5 justify-center items-center">
          <div className="flex flex-row justify-center items-center gap-5">
            <h3 className="text-lg font-bold">Participants</h3>
            <Button
              variant={"outline"}
              size={"iconSm"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <UserPen className="w-4 h-4" />
              ) : (
                <PenOff className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="flex flex-row gap-10">
            {allShortlists &&
              Object.entries(allShortlists).map(([shortlistId, shortlist]) => {
                const participating = shortlist?.participating;
                const user = shortlist?.user;

                return (
                  <div
                    key={`avatar-${user?.id}-${participating}-${shortlist?.isReady}`}
                    className="flex flex-col gap-5 items-center justify-center border rounded-md px-10 py-5"
                  >
                    <span
                      className={`text-xs text-center`}
                      style={{ color: user?.color }}
                    >
                      {user?.name}
                    </span>
                    <Button
                      variant={"outline"}
                      size={"avatarSm"}
                      className={`flex justify-center ${"hover:opacity-70"} transition-colors outline ${
                        shortlist?.isReady ? "outline-success" : "outline-error"
                      }`}
                      key={`avatar-${user?.id}`}
                      disabled={!isEditing}
                      isLoading={
                        updateReadyStateStatus === "pending" &&
                        readyStateVariables?.shortlistId === shortlistId
                      }
                      onClick={() => {
                        updateReadyState({
                          userId: currentUser?.id || "",
                          shortlistId: shortlistId,
                          isReady: !shortlist?.isReady,
                        });
                      }}
                    >
                      <img
                        src={user?.image}
                        alt=""
                        key={`profile-img-${user?.id}`}
                      />
                    </Button>
                    <ParticipationButton
                      defaultChecked={participating}
                      disabled={!isEditing}
                      onChange={(e) => {
                        updateParticipation({
                          userId: currentUser?.id || "",
                          shortlistId: shortlistId,
                          participating: e.target.checked,
                        });
                      }}
                    />
                  </div>
                );
              })}
          </div>
          <div className="flex flex-row gap-2">
            <Button
              variant={"outline"}
              size={"iconLg"}
              onClick={() => {
                if (!isPlaying) {
                  setStarted(true);
                  setIsPlaying(true);
                  raffle({
                    movies: shuffledMovies,
                  });
                } else {
                  setIsPlaying(false);
                }
              }}
            >
              <Dices className="w-6 h-6" />
            </Button>
            <Button
              variant={"outline"}
              size={"iconLg"}
              onClick={() => {
                const shuffled = shuffle([...shuffledMovies]);
                setShuffledMovies(shuffled);
                resetRaffle();
              }}
            >
              <Shuffle className="w-6 h-6" />
            </Button>
          </div>
          <h3 className="text-lg font-bold">Movies</h3>
          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-7">
            {shuffledMovies.map((movie, index) => {
              return (
                <div key={`movie-${movie?.id}`}>
                  <img
                    src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
                    key={`movie-${movie?.id}`}
                    alt=""
                    width={"150"}
                    className={`w-[150px] h-auto 2xl:w-[150px] animate-slideLeftAndFade transition-all duration-300 ease-in-out rounded-md ${
                      index === currentIndex && started
                        ? "saturate-100 scale-110"
                        : "saturate-0 scale-100"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Ariakit.Dialog>
    </>
  );
}
