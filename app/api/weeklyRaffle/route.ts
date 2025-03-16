import { postRaffleWork } from "@/lib/movies/movies";
import { sample } from "@/lib/utils";
import type { MovieWithUser } from "@/types/movie.type";
import { waitUntil } from "@vercel/functions";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest, _response: NextResponse) {
	const {
		movies,
		startingUserId,
	}: { movies: MovieWithUser[]; startingUserId: string } = await request.json();
	const noSave = cookies().get("noSave")?.value === "true";

	const chosen = sample([...movies], true);
	if (!chosen) {
		return NextResponse.json({ error: "No movie chosen" }, { status: 400 });
	}
	const chosenIndex = movies.findIndex(
		(movie: MovieWithUser) => movie.tmdbId === chosen.tmdbId,
	);

	if (!noSave) {
		waitUntil(postRaffleWork({ movies, winner: chosen, startingUserId }));
	}

	return NextResponse.json({ chosenIndex, movie: chosen });
}
