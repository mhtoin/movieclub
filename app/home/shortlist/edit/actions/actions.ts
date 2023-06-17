"use server";

import { getServerSession } from "@/lib/getServerSession";
import { addMovieToShortlist, removeMovieFromShortlist, updateChosenMovie } from "@/lib/shortlist";
import { Shortlist, User } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { sample } from "underscore";
import { prominent } from 'color.js'

export async function addMovie(movie: Movie) {
  const session = await getServerSession();
  console.log("session data in add movie action", session);

  if (session && session.user && session.user.userId) {
    let res = await addMovieToShortlist(
      movie,
      session.user.userId,
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
  const movieChoice = sample(movies);

  // update movie in db
  console.log("movies in raffle action", movies);
  console.log("choice", movieChoice);

  let chosenMovie = await updateChosenMovie(movieChoice.movie)
  console.log('chosen', chosenMovie)
}

export async function getColours(img: string) {
  const imageData = await fetch(img)

  console.log(imageData)

}
