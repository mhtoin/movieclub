import { getWatchlist } from "@/lib/tmdb";

export default async function Watchlist() {
    const { results: watchlist }: { results: Array<TMDBMovie>} = await getWatchlist()

    return (
        <div className="flex flex-row items-center">
            {watchlist.map(movie => {
                return <div key={movie.id}>{movie.title}</div>
            })}
        </div>
    )
}