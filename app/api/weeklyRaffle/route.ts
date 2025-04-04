import { postRaffleWork } from "@/lib/movies/movies";
import { sample } from "@/lib/utils";
import type { MovieWithUser } from "@/types/movie.type";
import { waitUntil } from "@vercel/functions";
import { format } from "date-fns";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest, _response: NextResponse) {
	const {
		movies,
		startingUserId,
		watchDate,
	}: { movies: MovieWithUser[]; startingUserId: string; watchDate: Date } =
		await request.json();
	const noSave = cookies().get("noSave")?.value === "true";

	const formattedWatchDate = format(watchDate, "yyyy-MM-dd");
	console.log("formattedWatchDate", formattedWatchDate);

	const chosen = sample([...movies], true);
	if (!chosen) {
		return NextResponse.json({ error: "No movie chosen" }, { status: 400 });
	}
	const chosenIndex = movies.findIndex(
		(movie: MovieWithUser) => movie.tmdbId === chosen.tmdbId,
	);

	//console.log("chosen", chosen);
	//console.log("chosenIndex", chosenIndex);

	if (!noSave) {
		waitUntil(
			postRaffleWork({ movies, winner: chosen, startingUserId, watchDate }),
		);
	}

	return NextResponse.json({ chosenIndex, movie: chosen });
}
