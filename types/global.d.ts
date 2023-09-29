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
    movieOfTheWeek?: Date | null;
  }

  interface MovieOfTheWeek extends Movie {
    trailers: Trailer[];
    watchProviders: WatchProviders;
    tagline: string;
    reviews: Array<ReviewWithUser>;
    ratings: Array<Rating>;
    owner?: string;
    user: User;
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
    userId: ObjectId | string;
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

  interface PusherMessage {
    message: string;
    data: Shortlist | Movie | MovieOfTheWeek;
  }

  interface Shortlist {
    id: string;
    isReady: boolean;
    movieIds: Array<string>;
    movies: Array<Movie>;
    participation: boolean;
    requiresSelection: boolean;
    selectedIndex?: number;
    user: User;
    userId: string;
  }

  interface Genre {
    label: string;
    value: number;
  }

  interface RangeSelection {
    min: string
    max: string
  }
}
