"use server";

import { addMovieToShortlist, removeMovieFromShortlist } from "@/lib/shortlist";
import { revalidateTag } from "next/cache";

export async function addMovie(movie: object) {
  let res =  await addMovieToShortlist(movie)
  revalidate('shortlist')
  return res
  /*
  const res = await fetch("http://localhost:3001/api/shortlist", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  });
  revalidateTag("shortlist");
  return await res.json();*/
}

export async function removeFromShortList(id: string) {
  let res = await removeMovieFromShortlist(id)
  //revalidateTag("shortlist");
  revalidate('shortlist')
  return res
  
}

async function revalidate(tag: string) {
  revalidateTag(tag)
}