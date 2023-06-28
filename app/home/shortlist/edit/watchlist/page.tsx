import MoviePosterCard from "@/app/components/MoviePosterCard";
import { getWatchlist } from "@/lib/tmdb";
import Shortlist from "../components/Shortlist";
import { getServerSession } from "@/lib/getServerSession";
import { getShortList } from "@/lib/shortlist";


export default async function Watchlist() {
  const { results: watchlist } = await getWatchlist();
  const session = await getServerSession();
  const shortlistData = (await getShortList(session?.user.userId)) ?? [];
  const movies = (shortlistData?.movies as Movie[]) || [];

  console.log('watchlist', watchlist)
  return (
    <div className="flex flex-col items-center">
        <div className="divider m-10"><div className="text-xl">Shortlist</div></div>
      {/* @ts-expect-error Shortlist */}
     <Shortlist />
     <div className="divider m-10"><div className="text-xl">Watchlist</div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {watchlist.map((movie: TMDBMovie) => {
          return (
            <div key={`container-${movie.id}`} className="flex flex-col items-center gap-2">
             <MoviePosterCard key={movie.id} movie={movie} added={movies.find(shortlistMovie => shortlistMovie.tmdbId === movie.id) ? true : false}/>
            </div>
          )
        })}
      </div>
    </div>
  );
}
