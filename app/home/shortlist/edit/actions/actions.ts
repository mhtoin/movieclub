"use server";

import { getServerSession } from "@/lib/getServerSession";
import {
  addMovieToShortlist,
  removeMovieFromShortlist,
  updateChosenMovie,
  updateShortlistSelection,
  updateShortlistState,
} from "@/lib/shortlist";
import { Shortlist, User, Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { get, sample } from "underscore";
import "dotenv/config";

export async function addMovie(movie: Movie) {
  const session = await getServerSession();
  
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
  const movieChoice = sample(movies) ?? "";

  if (movieChoice) {
    // update movie in db
    let chosenMovie = await updateChosenMovie(movieChoice.movie);
  }
}

export async function getColours(img: string) {
  const imageData = await fetch(img);
}

export async function updateShortlistReadyState(ready: boolean) {
  const session = await getServerSession();
  await updateShortlistState(ready, session?.user.shortlistId)
}

export async function updateSelection(index: number) {
  const session = await getServerSession();
  await updateShortlistSelection(index, session?.user.shortlistId)
}
