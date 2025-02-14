import { getMovie, postRaffleWork } from "@/lib/movies/movies";
import { sample } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { getAllShortLists } from "@/lib/shortlist";
import { cookies } from "next/headers";
export async function POST(request: NextRequest, response: NextResponse) {
  const {
    movies,
    startingUserId,
  }: { movies: MovieWithUser[]; startingUserId: string } = await request.json();
  const noSave = cookies().get("noSave")?.value === "true";
  const resultScreen = cookies().get("resultScreen")?.value === "true";

  console.log("noSave", noSave);
  const dbShortlists = await getAllShortLists();

  const allReady = dbShortlists
    .filter((shortlist) => shortlist.participating)
    .every((shortlist) => shortlist.isReady);

  const chosen: MovieWithUser = sample([...movies], true);

  const chosenIndex = movies.findIndex(
    (movie: MovieWithUser) => movie.tmdbId === chosen.tmdbId
  );

  if (!noSave) {
    waitUntil(postRaffleWork({ movies, winner: chosen, startingUserId }));
  }

  return NextResponse.json({ chosenIndex, movie: chosen });
}
