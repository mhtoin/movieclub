'use client'
import MovieCard from 'components/search/MovieCard'
import {
  useGetWatchlistQuery,
  useShortlistQuery,
  useValidateSession,
} from 'lib/hooks'

export default function WatchlistContainer() {
  const { data: session } = useValidateSession()
  const { data: watchlist } = useGetWatchlistQuery(session || null)
  const { data: shortlistData } = useShortlistQuery(session?.shortlistId || '')

  const shortlistMovieIds = shortlistData
    ? shortlistData?.movies?.map((movie) => movie.tmdbId)
    : []

  const watchlistMovieIds = watchlist ? watchlist?.map((movie) => movie.id) : []
  return (
    <div className="no-scrollbar relative m-5 flex h-full w-full flex-col gap-5 overflow-y-auto p-10 py-20">
      {session && !session.accountId && (
        <div className="alert alert-error w-1/3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <title>Error</title>
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
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-2xl font-bold">Watchlist</h1>
      </div>

      <div className="no-scrollbar relative h-dvh w-full overflow-y-auto">
        {/* Top gradient overlay */}
        <div className="from-background absolute top-0 right-0 left-0 z-10 h-5 bg-linear-to-b to-transparent" />

        <div className="no-scrollbar bg-background grid h-full w-full auto-rows-[min-content] grid-cols-[repeat(auto-fill,minmax(200px,1fr))] place-items-center gap-y-5 overflow-y-auto lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
          {watchlist?.map((movie) => {
            return (
              <MovieCard
                key={movie.id}
                movie={movie}
                added={shortlistMovieIds?.includes(movie.id)}
                inWatchlist={watchlistMovieIds?.includes(movie.id)}
                showActions
              />
            )
          })}
        </div>

        {/* Bottom gradient overlay */}
        <div className="from-background absolute right-0 bottom-0 left-0 z-10 h-5 bg-linear-to-t to-transparent" />
      </div>
    </div>
  )
}
