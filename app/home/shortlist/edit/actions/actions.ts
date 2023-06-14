"use server";

import { getServerSession } from "@/lib/getServerSession";
import { addMovieToShortlist, removeMovieFromShortlist } from "@/lib/shortlist";
import { revalidateTag } from "next/cache";

export async function addMovie(movie: Movie) {
  const session = await getServerSession();
  console.log("session data in add movie action", session);

  if (session && session.user && session.user.userId) {
    let res = await addMovieToShortlist(movie, session.user.userId, session.user.shortlistId);
    revalidate("shortlist");
    //return res;
  } else {
    throw new Error('not properly authenticated!')
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
