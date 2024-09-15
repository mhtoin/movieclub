/**
 * Queries
 */

import { QueryClient } from "@tanstack/react-query";
import { formatISO, nextWednesday, previousWednesday, set } from "date-fns";
import { produce } from "immer";
import { getAllShortLists } from "../shortlist";
import { getBaseURL, keyBy } from "../utils";
import { User as DatabaseUser } from "@prisma/client";

export const searchKeywords = async (value: string) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/keyword?query=${value}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
      },
    }
  );
  return await res.json();
};

export const getKeyWord = async (id: string) => {
  const res = await fetch(`https://api.themoviedb.org/3/keyword/${id}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
    },
  });
  return await res.json();
};

export const getMovie = async (id: number) => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
    },
  });
  return (await res.json()) as TMDBMovie;
};

export const searchMovies = async (
  page: number = 1,
  searchValue: string = "with_watch_providers=8",
  type: "discover" | "search" = "discover"
) => {
  const searchQuery =
    type === "search"
      ? `search/movie?${searchValue}&page=${page}`
      : searchValue
      ? "discover/movie?" + searchValue + `&page=${page}` + "&watch_region=FI"
      : `discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&watch_region=FI&release_date.gte=1900&release_date.lte=2023&vote_average.gte=0&vote_average.lte=10&with_watch_providers=8|119|323|337|384|1773`;

  //console.log('searching for', searchQuery)
  const initialSearch = await fetch(
    `https://api.themoviedb.org/3/${searchQuery}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
      },
    }
  );
  return initialSearch.json();
};

export const getUserShortlist = async (id: string) => {
  const response = await fetch(`/api/shortlist/${id}`, {
    cache: "no-store",
  });
  return await response.json();
  //const shortlist = await getShortList(id);
  //return shortlist;
};

export const getWatchlist = async (user: DatabaseUser) => {
  let pagesLeft = true;
  let page = 1;
  const movies = [];

  do {
    let watchlist = await fetch(
      `https://api.themoviedb.org/3/account/${user.accountId}/watchlist/movies?language=en-US&page=${page}&session_id=${user.sessionId}&sort_by=created_at.asc`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
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
};

export const getWatchProviders = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/watch/providers/movie?language=en-US&watch_region-FI`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  /**
   * We should provide some reasonable defaults here and store them somewhere
   */
  const providers = data.results.filter((provider: any) => {
    return (
      provider.provider_id === 8 ||
      provider.provider_id === 119 ||
      provider.provider_id === 323 ||
      provider.provider_id === 337 ||
      provider.provider_id === 384 ||
      provider.provider_id === 1773
    );
  });
  return providers;
};

export const getFilters = async () => {
  let res = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en",
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
      },
    }
  );

  let responseBody = await res.json();

  if (responseBody.genres) {
    return responseBody.genres.map((genre: { name: string; id: number }) => {
      return { label: genre.name, value: genre.id };
    }) as Array<{ label: string; value: number }>;
  }
};

export const getAllMoviesOfTheWeek = async () => {
  const response = await fetch(`${getBaseURL()}/api/movies`, {
    cache: "no-store",
  });

  const data: MovieOfTheWeek[] = await response.json();
  /**
   * The dates are a bit messed up atm, because the production server timezone differs
   * from the development. This is a temporary fix, stripping the time part of the date
   */
  for (let movie of data) {
    if (movie.movieOfTheWeek && typeof movie.movieOfTheWeek === "string") {
      movie.movieOfTheWeek = formatISO(new Date(movie.movieOfTheWeek), {
        representation: "date",
      });
    }
  }

  const groupedData = keyBy(
    data,
    (movie: any) =>
      //format(new Date(movie.movieOfTheWeek), "dd.MM.yyyy")
      movie.movieOfTheWeek
  ) as MovieOfTheWeekQueryResult;

  return groupedData;
};

export const getShortlist = async (id: string) => {
  const response = await fetch(`${getBaseURL()}/api/shortlist/${id}`);

  return await response.json();
};

export const setShortlistQueryData = (
  queryClient: QueryClient,
  key: string,
  id: string,
  data: any
) => {
  queryClient.setQueryData(["shortlists"], (oldData: ShortlistsById) => {
    return produce(oldData, (draft) => {
      let target = draft[id];
      // typecheck here, check https://stackoverflow.com/questions/56568423/typescript-no-index-signature-with-a-parameter-of-type-string-was-found-on-ty
      if (target && target.hasOwnProperty(key)) {
        //target[key] = data;
      }
    });
  });
};

export function findMovieDate(
  movies: MovieOfTheWeekQueryResult,
  startingDate: Date,
  direction: "previous" | "next" = "previous",
  tryCount: number = 0
): Date | null {
  if (tryCount > Object.keys(movies).length) {
    return null;
  }
  const dateAttempt =
    direction === "previous"
      ? set(previousWednesday(startingDate), {
          hours: 18,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        })
      : set(nextWednesday(startingDate), {
          hours: 18,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        });

  const movieOnDate = movies ? movies[dateAttempt.toISOString()] : null;
  //console.log("movieOnDate", movieOnDate);

  if (movieOnDate) {
    return dateAttempt;
  } else {
    return findMovieDate(movies, dateAttempt, direction, tryCount + 1);
  }
}

export async function getAllShortlistsGroupedById(): Promise<ShortlistsById> {
  const fetchUrl = `${getBaseURL()}/api/shortlist`;
  //console.log("fetchUrl", fetchUrl);
  const response = await fetch(fetchUrl);
  //console.log("response", response.body);
  try {
    const data: Shortlist[] = await response.json();
    //console.log("data", data);
    const groupedData: ShortlistsById = keyBy(
      data,
      (shortlist: any) => shortlist.id
    );
    return groupedData;
  } catch (error) {
    console.error("Error fetching shortlists", error);
    return {};
  }
}
