"use server";

import { replaceShortlistMovie } from "../shortlist";

export async function replaceShortlistItem(
  replacedMovie: Movie,
  replacingWithMovie: Movie,
  shortlistId: string
) {
  return await replaceShortlistMovie(
    replacedMovie,
    replacingWithMovie,
    shortlistId
  );
}
