"use server";

import { getServerSession } from "@/lib/getServerSession";
import {
  addMovieToShortlist,
  removeMovieFromShortlist,
  updateChosenMovie,
} from "@/lib/shortlist";
import { Shortlist, User, Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { get, sample } from "underscore";
import "dotenv/config";

export async function addMovie(movie: Movie) {
  const session = await getServerSession();
  console.log("session data in add movie action", session);

 
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
    console.log("movies in raffle action", movies);
    console.log("choice", movieChoice);

    let chosenMovie = await updateChosenMovie(movieChoice.movie);
  }
}

export async function getColours(img: string) {
  const imageData = await fetch(img);

  console.log(imageData);
}
