export {};

declare global {
  interface Movie {
    _id: string
    adult: boolean
    genre_ids: Array<number>
    id: number
    original_language: string
    popularity: number
    video: boolean
    vote_average: number
    vote_count: number
    backdrop_path: string;
    poster_path: string;
    title: string;
    original_title: string;
    release_date: string;
    overview: string;
  }
}
