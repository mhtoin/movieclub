import { get } from "underscore";
import { getServerSession } from "./getServerSession";

export const revalidate = 10;

export async function getAdditionalInfo(tmdbId: number) {
  let tmdbDetailsRes = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?language=${"en-US"}&append_to_response=videos,watch/providers`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.MOVIEDB_TOKEN}`,
      },
    }
  );

  let tmdbDetails = await tmdbDetailsRes.json();
  console.log("details", tmdbDetails);

  let trailers = tmdbDetails.videos?.results
    .filter(
      (video: any) =>
        video.type === "Trailer" && video.official && video.site === "YouTube"
    )
    .map((trailer: any) => {
      return {
        name: trailer.name,
        id: trailer.id,
        key: trailer.key,
      };
    }) as Trailer[];

  let watchProviders = get(tmdbDetails["watch/providers"]?.results, "FI");

  return {
    trailers: trailers,
    watchProviders: watchProviders,
    tagline: tmdbDetails.tagline,
  };
}

export async function getWatchlist() {
  const session = await getServerSession();

  console.log("session in watchlist", session);
  let watchlist = await fetch(
    `https://api.themoviedb.org/3/account/${session?.user.accountId}/watchlist/movies?language=en-US&page=1&session_id=${session?.user.sessionId}&sort_by=created_at.asc`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.MOVIEDB_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  const data = await watchlist.json();
  console.log("retrieved watchlist", data);
  return data;
}
