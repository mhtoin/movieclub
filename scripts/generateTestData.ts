import { ObjectId } from "mongodb";
import prisma from "../lib/prisma";
import { previousWednesday, formatISO } from "date-fns";

interface Genre {
  label: string;
  value: number;
}

interface Movie {
  id?: string;
  adult: boolean;
  genre_ids: Array<number>;
  tmdbId: number;
  imdbId?: string;
  original_language: string;
  popularity: number;
  video: boolean;
  vote_average: number;
  vote_count: number;
  backdrop_path: string | null;
  poster_path: string | null;
  title: string;
  original_title: string;
  release_date: string;
  overview: string;
  movieOfTheWeek?: Date | string | null;
  watchDate?: string;
  genres?: Array<Genre>;
  runtime?: number;
  tagline?: string;
}

interface User {
  [x: string]: string;
  sessionId: string;
  image: string;
  name: string;
}

interface MovieOfTheWeek extends Movie {
  user: User;
  watchDate: string;
}

interface TMDBMovie {
  adult: boolean;
  genre_ids: Array<number>;
  id: number;
  original_language: string;
  popularity: number;
  video: boolean;
  vote_average: number;
  vote_count: number;
  backdrop_path: string | null;
  poster_path: string | null;
  title: string;
  original_title: string;
  release_date: string;
  overview: string;
  userId?: ObjectId | string;
  imdb_id?: string;
  genres?: Array<MovieGenre>;
  runtime?: number;
  tagline?: string;
  "watch/providers"?: { results: { [x: string]: WatchProviders } };
  videos?: { results: Array<Trailer> };
  credits?: {
    cast: Array<Cast>;
  };
  images?: {
    backdrops: Array<TMDbImage>;
    posters: Array<TMDbImage>;
  };
}

interface MovieGenre {
  id: number;
  name: string;
}

interface WatchProviders {
  link: string;
  flatrate?: Array<WatchProvider>;
  free?: Array<WatchProvider>;
  rent?: Array<WatchProvider>;
  buy?: Array<WatchProvider>;
}

interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

interface TMDbImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  iso_639_1: string;
  vote_average: number;
  vote_count: number;
}

interface Cast {
  name: string;
  profile_path: string;
  character: string;
  id: number;
}

interface Trailer {
  name: string;
  id: string;
  key: string;
}

function generateWatchDates(count: number) {
  // get wednesday of current week
  const dates: Array<string> = [];
  const today = new Date();
  let startDate = previousWednesday(today);
  for (let i = 0; i < count; i++) {
    dates.push(formatISO(startDate, { representation: "date" }));
    startDate = previousWednesday(startDate);
  }
  return dates;
}

async function generateTestData() {
  const users = await prisma.user.findMany();
  // delete all movies
  await prisma.movie.deleteMany();

  const movies: TMDBMovie[] = [];

  for (let i = 1; i < 10; i++) {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${i}&sort_by=popularity.desc&watch_region=FI&with_watch_providers=8%7C323%7C496`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
        },
      }
    );
    const data = await response.json();
    //console.log(data);
    movies.push(...data.results);
  }

  const watchDates = generateWatchDates(movies.length);

  for (const [index, movie] of movies.entries()) {
    // get the details
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?append_to_response=credits,external_ids,images,similar,videos,watch/providers`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
        },
      }
    );
    const data = await res.json();

    const randomUser = users[Math.floor(Math.random() * users.length)];

    // save to db
    await prisma.movie.create({
      data: {
        tmdbId: data.id,
        adult: data.adult,
        original_language: data.original_language,
        popularity: data.popularity,
        video: data.video,
        vote_average: data.vote_average,
        vote_count: data.vote_count,
        backdrop_path: data.backdrop_path,
        poster_path: data.poster_path,
        title: data.title,
        original_title: data.original_title,
        release_date: data.release_date,
        overview: data.overview,
        imdbId: data.external_ids?.imdb_id,
        watchDate: watchDates[index],
        userId: randomUser.id,
        genre_ids: data.genres?.map((g: any) => g.id) || [],
      },
    });
  }
}

generateTestData();
