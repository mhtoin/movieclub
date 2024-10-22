import { PrismaClient, Prisma } from "@prisma/client";
import type { Rating, Review } from "@prisma/client";
import { ObjectId } from "mongodb";

export {};

declare global {
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

  interface MovieOfTheWeek extends Movie {
    trailers: Trailer[];
    watchProviders: WatchProviders;
    tagline: string;
    reviews: Array<ReviewWithUser>;
    ratings: Array<Rating>;
    owner?: string;
    user: User;
    watchDate: string;
  }

  interface MovieWithUser extends Movie {
    user: User;
  }

  interface MovieOfTheWeekQueryResult {
    [x: string]: MovieOfTheWeek;
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

  interface WatchProviders {
    link: string;
    flatrate?: Array<WatchProvider>;
    free?: Array<WatchProvider>;
    rent?: Array<WatchProvider>;
    buy?: Array<WatchProvider>;
  }

  interface Trailer {
    name: string;
    id: string;
    key: string;
  }

  interface WatchProvider {
    logo_path: string;
    provider_id: number;
    provider_name: string;
    display_priority: number;
  }

  interface Tier {
    label: string;
    value: number;
    movies: Array<MovieOfTheWeek>;
  }

  interface Tierlist {
    id: string;
    tiers: Array<Tier>;
    userId: string;
  }

  interface User {
    [x: string]: string;
    sessionId: string;
    accountId: number;
    image: string;
    name: string;
  }
  type ReviewWithUser = Prisma.ReviewGetPayload<{
    include: { user: true };
  }>;

  type ChosenMovie = Prisma.MovieGetPayload<{
    include: { user: true };
  }>;

  type RaffleNotification = {
    id: number;
    message: string;
    data: MovieOfTheWeek;
  };

  type ItemCoordinates = {
    tier: number;
    index: number;
  };

  type DraggableItem = {
    id: string;
    index: ItemCoordinates;
  };

  interface DrawResponse {
    ok: boolean;
    data: {
      label: string;
      data: Array<{ user: string; movies: number }>;
    };
  }

  interface UserChartData {
    label: string;
    data: Array<{ user: string; movies: number }>;
  }

  interface ChosenMovie {
    user: User;
    shortlistId: string;
    movie: Movie;
  }

  interface Shortlist {
    id: string;
    isReady: boolean;
    movieIds: Array<string>;
    movies: Array<Movie>;
    participating: boolean;
    requiresSelection: boolean;
    selectedIndex?: number;
    user: User;
    userId: string;
  }

  interface Genre {
    label: string;
    value: number;
  }

  interface MovieGenre {
    id: number;
    name: string;
  }

  interface RangeSelection {
    min: string;
    max: string;
  }

  type ShortlistsById = {
    [x: string]: Shortlist;
  };

  type DiscordUser = {
    id: string;
    username: string;
    avatar: string;
    avatar_decoration: string;
    discriminator: string;
    public_flags: number;
    verified?: boolean;
    email?: string;
    flags: number;
    banner: string;
    banner_color: string;
    accent_color: number;
  };
}
