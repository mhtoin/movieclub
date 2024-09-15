"use client";
import * as Ariakit from "@ariakit/react";
import { Button } from "../ui/Button";
import { useRaffle, useShortlistsQuery } from "@/lib/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Dices } from "lucide-react";
import { shuffle } from "@/lib/utils";
import { ParticipationButton } from "./ParticipationButton";

export default function RaffleDialog() {
  const dialog = Ariakit.useDialogStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: allShortlists, status } = useShortlistsQuery();

  console.log("allShortlists in dialog", allShortlists);

  const [movies, setMovies] = useState<Movie[]>(
    (allShortlists &&
      Object?.entries(allShortlists)?.flatMap(([shortlistId, shortlist]) => {
        return shortlist?.movies?.map((movie) => {
          return {
            ...movie,
            user: shortlist?.user,
          };
        });
      })) ||
      []
  );
  const { data, mutate: raffle } = useRaffle();

  useEffect(() => {
    if (allShortlists && movies.length === 0 && status === "success") {
      const movieArr = Object?.entries(allShortlists)?.flatMap(
        ([shortlistId, shortlist]) => {
          return shortlist?.movies?.map((movie) => {
            return {
              ...movie,
              user: shortlist?.user,
            };
          });
        }
      );
      setMovies(movieArr);
    }
  }, [movies, status]);

  const nextIndex = useCallback(() => {
    setCurrentIndex((currentIndex + 1) % movies.length);
  }, [currentIndex, movies]);

  const previousIndex = () => {
    setCurrentIndex((currentIndex - 1 + movies.length) % movies.length);
  };

  const users = allShortlists
    ? Object.entries(allShortlists).map(([shortlistId, shortlist]) => {
        return shortlist?.user;
      })
    : [];

  const distanceToChosenIndex = useMemo(() => {
    return Math.abs(data?.chosenIndex - currentIndex);
  }, [data?.chosenIndex, currentIndex]);

  const calculateIntervalVelocity = useMemo(() => {
    // start slowing down the interval 5 steps before the chosen index
  }, [count, distanceToChosenIndex]);

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
        className="fixed z-50 inset-3 flex flex-col gap-1 overflow-auto rounded-md border max-w-fit p-10 min-w-96 m-auto bg-background origin-bottom-right opacity-0 transition-all duration-300 scale-95 data-[enter]:opacity-100 data-[enter]:scale-100"
      >
        <div className="flex flex-col gap-5 p-5 justify-center items-center">
          <div className="flex flex-row gap-5">
            {users.map((user) => {
              return (
                <div
                  key={`avatar-${user?.id}`}
                  className="flex flex-col gap-5 items-center justify-center"
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
                    className={`flex justify-center ${"hover:opacity-70"} transition-colors outline outline-success
          }`}
                    key={`avatar-${user?.id}`}
                  >
                    <img
                      src={user?.image}
                      alt=""
                      key={`profile-img-${user?.id}`}
                    />
                  </Button>
                  <ParticipationButton defaultChecked={true} />
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
                  const shuffledMovies = shuffle([...movies]);
                  setMovies(shuffledMovies);

                  setTimeout(() => {
                    raffle({
                      movies: shuffledMovies,
                    });
                    setIsPlaying(true);
                  }, 1000);
                } else {
                  setIsPlaying(false);
                }
              }}
            >
              <Dices className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-7">
            {movies.map((movie, index) => {
              return (
                <img
                  src={`http://image.tmdb.org/t/p/original/${movie["poster_path"]}`}
                  key={`movie-${movie?.id}`}
                  alt=""
                  width={"150"}
                  className={`w-[150px] h-auto 2xl:w-[150px] animate-slideLeftAndFade transition-all duration-300 ease-in-out rounded-md ${
                    index === currentIndex
                      ? "saturate-100 scale-110"
                      : "saturate-0 scale-100"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </Ariakit.Dialog>
    </>
  );
}
