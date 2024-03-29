"use server";

//import { getServerSession } from "@/lib/deprecated_getServerSession";
import {
  addMovieToShortlist,
  removeMovieFromShortlist,
  updateChosenMovie,
  updateShortlistParticipationState,
  updateShortlistSelection,
  updateShortlistState,
} from "@/lib/shortlist";
import { Shortlist, User, Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import "dotenv/config";
import { sample } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function addMovie(movie: Movie) {
  const session = await getServerSession(authOptions);
  
  if (session && session.user && session.user.userId) {
    let res = await addMovieToShortlist(
      {...movie},
      session.user.shortlistId
    );
    revalidate("shortlist");
    //return res;
  } else {
    throw new Error("not properly authenticated!");
  }
}

export async function removeFromShortList(id: string, shortlistId: string) {
  let res = await removeMovieFromShortlist(id, shortlistId);
  //revalidateTag("shortlist");
  revalidate("shortlist");
}

async function revalidate(tag: string) {
  revalidateTag(tag);
}

export async function startRaffle(
  shortlists: (Shortlist & {
    user: User;
    movies: Movie[];
  })[]
) {
  const movies = shortlists
    .map((shortlist) =>
      shortlist.movies.map((movie) =>
        Object.assign(
          {},
          {
            user: shortlist.user.name,
            movie: movie,
          }
        )
      )
    )
    .flat();
  const movieChoice = sample(movies, true) ?? "";

  if (movieChoice) {
    // update movie in db
    let chosenMovie = await updateChosenMovie(movieChoice.movie);
  }
}

export async function getColours(img: string) {
  const imageData = await fetch(img);
}

export async function updateShortlistReadyState(ready: boolean) {
  const session = await getServerSession(authOptions);
  await updateShortlistState(ready, session?.user.shortlistId)
}

export async function updateShortlistParticipation(ready: boolean) {
  const session = await getServerSession(authOptions);
  await updateShortlistParticipationState(ready, session?.user.shortlistId)
}

export async function updateSelection(index: number) {
  const session = await getServerSession(authOptions);
  await updateShortlistSelection(index, session?.user.shortlistId)
}
