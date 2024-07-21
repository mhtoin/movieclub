import { EventNotifier } from "@/lib/eventWriter";
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
    movieOfTheWeek?: Date | string | null;
    watchDate?: string;
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
    data: PusherPayload;
  }

  interface PusherPayload {
    userId: string;
    payload: Shortlist | Movie | MovieOfTheWeek | string;
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

  interface RangeSelection {
    min: string;
    max: string;
  }

  type ShortlistsById = {
    [x: string]: Shortlist;
  };

  type EventOptions<T = string | Record<string, unknown>> = {
    beforeFn?: CustomFn<T>;
    afterFn?: CustomFn<T>;
  };

  interface Message<T = string | Record<string, unknown>> {
    data: T;
    comment?: string;
    event?: string;
    id?: string;
    retry?: number;
  }

  type CustomFn<T = string | Record<string, unknown>> = (data: T) => unknown;

  interface EventNotifier<
    T extends {
      update: T["update"] extends Message
        ? Message<T["update"]>["data"]
        : never;
      complete: T["complete"] extends Message
        ? Message<T["complete"]>["data"]
        : never;
      error?: T["error"] extends Message ? Message<T["error"]>["data"] : never;
      close?: T["close"] extends Message ? Message<T["close"]>["data"] : never;
    } = any
  > {
    update: (
      message: Message<T["update"]>["data"],
      opts?: EventOptions<Message<T["update"]>["data"]>
    ) => void;
    complete: (
      message: Message<T["complete"]>["data"],
      opts?: EventOptions<Message<T["complete"]>["data"]>
    ) => void;
    error?: (
      message: Message<T["error"]>["data"],
      opts?: EventOptions<Message<T["error"]>["data"]>
    ) => void;
    close?: (
      message: Message<T["close"]>["data"],
      opts?: EventOptions<Message<T["close"]>["data"]>
    ) => void;
  }

  type ChosenMovieEvent = EventNotifier<{
    update: {
      data: {
        message: string;
      };
      event: "update";
    };
    complete: {
      data: {
        message: string;
      };
      event: "complete";
    };
  }>;
}
