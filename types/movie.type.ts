import { Rating } from "@prisma/client";
import { CastMember, Provider } from "./tmdb.type";

export interface Movie {
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
  videos?: Array<Trailer>;
}

export interface MovieOfTheWeek extends Movie {
  trailers: Trailer[];
  watchProviders: WatchProviders;
  tagline: string;
  reviews: Array<ReviewWithUser>;
  ratings: Array<Rating>;
  owner?: string;
  user: User;
  watchDate: string;
  cast: Array<CastMember>;
}

export interface WatchProviders {
  link: string;
  flatrate: Array<Provider>;
}
