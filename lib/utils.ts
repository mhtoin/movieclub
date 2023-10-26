import { format } from "date-fns";
import { getShortList } from "./shortlist";

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
    return {...r, [key]: a};
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
    : `discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=FI`;
  
    console.log('searching for', searchQuery)
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
}

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
    }) as Array<{ label: string, value: number}>;
  }
}

export const getAllMoviesOfTheWeek = async () => {
  const response = await fetch('/api/movies');

  const data = await response.json();
  //console.log('data before', data)
  const groupedData = keyBy(data, (movie: any) => format(new Date(movie.movieOfTheWeek),'dd.MM.yyyy'))
  //console.log('grouped', groupedData)
  return groupedData;
}