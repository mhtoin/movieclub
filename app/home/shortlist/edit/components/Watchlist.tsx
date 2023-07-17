import { getWatchlist } from "@/lib/tmdb";

export default async function Watchlist() {
    const watchlist = await getWatchlist()

    return (
        <div className="flex flex-row items-center">
            {watchlist.map(movie => {
                return <div key={movie.id}>{movie.title}</div>
            })}
        </div>
    )
}