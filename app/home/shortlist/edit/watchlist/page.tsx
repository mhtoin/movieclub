import MoviePosterCard from "@/app/components/MoviePosterCard";
import { getWatchlist } from "@/lib/tmdb";
import Shortlist from "../components/Shortlist";
import { getServerSession } from "@/lib/getServerSession";
import { getShortList } from "@/lib/shortlist";
import { Suspense } from "react";

export default async function Watchlist() {
  const watchlist = await getWatchlist();
  const session = await getServerSession();
  const shortlistData = (await getShortList(session?.user.userId)) ?? [];
  const movies = (shortlistData?.movies as Movie[]) || [];

  return (
    <div className="flex flex-col items-center">
      <div className="divider m-10">
        <div className="text-xl">Shortlist</div>
      </div>
      {/* @ts-expect-error Shortlist */}
      <Shortlist />
      <div className="divider m-10">
        <div className="text-xl">Watchlist</div>
      </div>
      {session?.user.sessionId ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {watchlist.map((movie: TMDBMovie) => {
            return (
              <div
                key={`container-${movie.id}`}
                className="flex flex-col items-center gap-2"
              >
                <MoviePosterCard
                  key={movie.id}
                  movie={movie}
                  added={
                    movies.find(
                      (shortlistMovie) => shortlistMovie.tmdbId === movie.id
                    )
                      ? true
                      : false
                  }
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{`You haven't linked your TMDB account yet. You can do so in your profile`}</span>
        </div>
      )}
    </div>
  );
}
