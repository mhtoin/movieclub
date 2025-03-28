import { useValidateSession } from "@/lib/hooks";
import type { MovieWithUser } from "@/types/movie.type";
import type { UseMutateFunction } from "@tanstack/react-query";
import { Dices } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/Tooltip";
import DevTools from "./DevTools";

interface ActionButtonsProps {
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
}

export default function ActionButtons({
	isPlaying,
	setIsPlaying,
	setStarted,
	shuffledMovies,
	raffle,
	disabled,
}: ActionButtonsProps) {
	const { data: user } = useValidateSession();
	const [noSave, setNoSave] = useState(false);
	const [resultScreen, setResultScreen] = useState(false);
	const isDev =
		process.env.NODE_ENV === "development" ||
		process.env.VERCEL_ENV === "preview";
	return (
		<div className="flex flex-row gap-2 items-center justify-center">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant={"outline"}
							size={"default"}
							className={`py-5 ${disabled ? "cursor-not-allowed" : ""}`}
							disabled={disabled}
							onClick={() => {
								if (!isPlaying) {
									setStarted(true);
									setIsPlaying(true);
									raffle({
										movies: shuffledMovies,
										startingUserId: user?.id || "",
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
			{isDev && (
				<DevTools
					noSave={noSave}
					setNoSave={setNoSave}
					resultScreen={resultScreen}
					setResultScreen={setResultScreen}
				/>
			)}
		</div>
	);
}
