import { getWatchlist } from "@/lib/tmdb";

export default async function Watchlist() {
    const { results: watchlist} = await getWatchlist()

    console.log(watchlist)
    return (
        <div className="flex flex-col items-center">
            {watchlist.map(movie => {
                return <div key={movie.id}>{movie.title}</div>
            })}
        </div>
    )
} 