import { ObjectId } from "mongodb";

export {};

declare global {
  interface Movie {
    id?: string
    adult: boolean
    genre_ids: Array<number>
    tmdbId: number
    original_language: string
    popularity: number
    video: boolean
    vote_average: number
    vote_count: number
    backdrop_path: string | null;
    poster_path: string | null;
    title: string;
    original_title: string;
    release_date: string;
    overview: string;
    movieOfTheWeek?: Date
  }

  interface MovieOfTheWeek extends Movie {
    trailers: Trailer[]
    watchProviders: WatchProviders
    tagline: string
  }

  interface TMDBMovie {
    adult: boolean
    genre_ids: Array<number>
    id: number
    original_language: string
    popularity: number
    video: boolean
    vote_average: number
    vote_count: number
    backdrop_path: string | null;
    poster_path: string | null;
    title: string;
    original_title: string;
    release_date: string;
    overview: string;
    userId: ObjectId | string;
  }

  interface WatchProviders {
    link: string
    flatrate?: Array<WatchProvider>
    rent?: Array<WatchProvider>
    buy?: Array<WatchProvider>
  }

  interface Trailer {
    name: string
    id: string
    key: string
  }

  interface WatchProvider {
    logo_path: string
    provider_id: number
    provider_name: string
    display_priority: number
  }
}
