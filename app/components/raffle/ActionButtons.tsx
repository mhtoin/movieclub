import { Dices, Shuffle } from "lucide-react";
import { Button } from "../ui/Button";
import { shuffle } from "@/lib/utils";
import { useRaffle, useValidateSession } from "@/lib/hooks";
import { UseMutateFunction } from "@tanstack/react-query";
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from "../ui/Tooltip";

export default function ActionButtons({
  isPlaying,
  setIsPlaying,
  setStarted,
  shuffledMovies,
  setShuffledMovies,
  resetRaffle,
  raffle,
  disabled,
}: {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  setStarted: (started: boolean) => void;
  shuffledMovies: MovieWithUser[];
  setShuffledMovies: (shuffledMovies: MovieWithUser[]) => void;
  resetRaffle: () => void;
  raffle: UseMutateFunction<
    {
      movie: MovieWithUser;
      chosenIndex: number;
    },
    Error,
    {
      movies: MovieWithUser[];
      startingUserId: string;
    },
    unknown
  >;
  disabled: boolean;
}): JSX.Element {
  const { data: user } = useValidateSession();
  return (
    <div className="flex flex-row gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="cursor-not-allowed">
            <Button
              variant={"outline"}
              size={"default"}
              className="py-5"
              disabled={disabled}
              onClick={() => {
                if (!isPlaying) {
                  setStarted(true);
                  setIsPlaying(true);
                  raffle({
                    movies: shuffledMovies,
                    startingUserId: user?.id!,
                  });
                } else {
                  setIsPlaying(false);
                }
              }}
            >
              <div className="flex flex-row gap-2 items-center">
                <Dices className="w-6 h-6" />
                Start
              </div>
            </Button>
          </TooltipTrigger>

          <TooltipContent
            className={`bg-card max-w-40 p-2 ${disabled ? "" : "hidden"}`}
          >
            <p>
              All shortlists must be ready and last week&apos;s winner must have
              selected their movie to start the raffle
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/*<Button
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
      </Button>*/}
    </div>
  );
}