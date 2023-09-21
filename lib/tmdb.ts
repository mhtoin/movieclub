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

  let watchProviders = tmdbDetails["watch/providers"]?.results?.["FI"];

  return {
    trailers: trailers,
    watchProviders: watchProviders,
    tagline: tmdbDetails.tagline,
  };
}

export async function getWatchlist() {
  const session = await getServerSession();

  let pagesLeft = true;
  let page = 1;
  const movies = [];

  do {
    let watchlist = await fetch(
      `https://api.themoviedb.org/3/account/${session?.user.accountId}/watchlist/movies?language=en-US&page=${page}&session_id=${session?.user.sessionId}&sort_by=created_at.asc`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.MOVIEDB_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    let data = await watchlist.json();
    let results = data && data.results ? data.results : [];
    movies.push(results);

    let pages = data && data.total_pages ? data.total_pages : "";
    
    if (pages >= page) {
      page++;
    } else {
      pagesLeft = false;
    }
  } while (pagesLeft);

  return movies.flat();
}
