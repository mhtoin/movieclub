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
  images?: Images;
}

export interface Images {
  backdrops: Array<Image>;
  posters: Array<Image>;
  logos: Array<Image>;
}

export interface Image {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
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
  providers: Array<Provider>;
}
