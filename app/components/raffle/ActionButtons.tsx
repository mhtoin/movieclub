import { Dices, Shuffle } from "lucide-react";
import { Button } from "../ui/Button";
import { shuffle } from "@/lib/utils";
import { useRaffle } from "@/lib/hooks";
import { UseMutateFunction } from "@tanstack/react-query";

export default function ActionButtons({
  isPlaying,
  setIsPlaying,
  setStarted,
  shuffledMovies,
  setShuffledMovies,
  resetRaffle,
  raffle,
}: {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  setStarted: (started: boolean) => void;
  shuffledMovies: MovieWithUser[];
  setShuffledMovies: (shuffledMovies: MovieWithUser[]) => void;
  resetRaffle: () => void;
  raffle: UseMutateFunction<
    any,
    Error,
    {
      movies: MovieWithUser[];
    },
    unknown
  >;
}): JSX.Element {
  return (
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
          const currentMovies = [...shuffledMovies];
          const shuffled = shuffle(currentMovies);
          setShuffledMovies(shuffled);
          resetRaffle();
        }}
      >
        <Shuffle className="w-6 h-6" />
      </Button>
    </div>
  );
}
