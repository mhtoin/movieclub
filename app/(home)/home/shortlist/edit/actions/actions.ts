"use server";

import {
  addMovieToShortlist,
  removeMovieFromShortlist,
  updateChosenMovie,
  updateShortlistParticipationState,
  updateShortlistSelection,
  updateShortlistState,
} from "@/lib/shortlist";
import type { Shortlist, User } from "@prisma/client";
import { revalidateTag } from "next/cache";
import "dotenv/config";
import { sample } from "@/lib/utils";
import { validateRequest } from "@/lib/auth";

export async function addMovie(movie: Movie) {
  const { user } = await validateRequest();

  if (user && user.shortlistId) {
    const res = await addMovieToShortlist({ ...movie }, user.shortlistId);
    revalidate("shortlist");
    //return res;
  } else {
    throw new Error("not properly authenticated!");
  }
}

export async function removeFromShortList(id: string, shortlistId: string) {
  const res = await removeMovieFromShortlist(id, shortlistId);
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
    .flatMap((shortlist) =>
      shortlist.movies.map((movie) =>
        Object.assign(
          {},
          {
            user: shortlist.user.name,
            movie: movie,
          }
        )
      )
    );
  const movieChoice = sample(movies, true) ?? "";

  if (movieChoice) {
    // update movie in db
    const chosenMovie = await updateChosenMovie(movieChoice.movie);
  }
}

export async function getColours(img: string) {
  const imageData = await fetch(img);
}

export async function updateShortlistReadyState(ready: boolean) {
  const { user } = await validateRequest();
  await updateShortlistState(ready, user?.shortlistId || "");
}

export async function updateShortlistParticipation(ready: boolean) {
  const { user } = await validateRequest();
  await updateShortlistParticipationState(ready, user?.shortlistId || "");
}

export async function updateSelection(index: number) {
  const { user } = await validateRequest();
  await updateShortlistSelection(index, user?.shortlistId || "");
}
