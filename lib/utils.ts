import {
  format,
  formatISO,
  nextWednesday,
  previousWednesday,
  set,
} from "date-fns";
import { getShortList } from "./shortlist";
import { QueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type ArgValCallback<T> = (arg0: T) => any;

export const omit = (obj: any, keys: string[]) => {
  const result = { ...obj };
  keys.forEach((key) => result.hasOwnProperty(key) && delete result[key]);
  return result;
};

export const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const sample = (arr: any[], withShuffle: boolean) => {
  if (withShuffle) {
    arr = shuffle(arr);
  }
  const len = arr == null ? 0 : arr.length;
  return len ? arr[Math.floor(Math.random() * len)] : undefined;
};

export const range = (length: number) => {
  return Array.from({ length: length }, (_, i) => i);
};

export const orderBy = (arr: any[], key: string, order: string) => {
  return arr.reduce((r, a) => {
    //
    r[a.user.name] = [...(r[a?.user?.name] || []), a?.movie];
    return r;
  }, {});
};

export const groupBy = (arr: any[], cb: (arg0: unknown) => any) => {
  return arr.reduce((r, a) => {
    let key = cb(a);
    r[key] = [...(r[key] || []), a];
    return r;
  }, {});
};

export const keyBy = (arr: any[], cb: (arg0: unknown) => any) => {
  return arr.reduce((r, a) => {
    let key = cb(a);
    //r[key] = {...(r[key] || {}), a};
    return { ...r, [key]: a };
  }, {});
};

/**
 * Sorts collection into groups and returns  collection with the count of items of each group
 * @param arr collection to sort
 * @param cb  callback function to get the key to sort by
 * @returns sorted collection
 */
export const countByKey = (arr: any[], cb: ArgValCallback<any>) => {
  return arr.reduce((r, a) => {
    let key = cb(a);
    r[key] = (r[key] || 0) + 1;
    return r;
  }, {});
};

export const searchMovies = async (page: number, searchValue: string) => {
  const searchQuery = searchValue
    ? searchValue + `&page=${page}`
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

export const getWatchlist = async (user: User) => {
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
  const response = await fetch("/api/movies", {
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

export const getAllShortlistsGroupedById =
  async (): Promise<ShortlistsById> => {
    const response = await fetch("/api/shortlist", {
      next: {
        revalidate: 6000,
      },
    });

    const data = await response.json();
    const groupedData = keyBy(data, (shortlist: any) => shortlist.id);
    return groupedData;
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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function sortByISODate(a: any, b: any, direction: "asc" | "desc") {
  return direction === "asc" ? a.localeCompare(b) : -a.localeCompare(b);
}
