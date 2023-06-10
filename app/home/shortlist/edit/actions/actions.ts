"use server";

import { revalidateTag } from "next/cache";

export async function addMovie(movie: object) {
  const res = await fetch("http://localhost:3001/api/shortlist", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  });
  revalidateTag("shortlist");
  return await res.json();
}

export async function removeFromShortList(id: string) {
  console.log("id is", id);
  const res = await fetch(`http://localhost:3001/api/shortlist/${id}`, {
    method: "DELETE",
  });

  console.log("delete res");
  revalidateTag("shortlist");
  
}
