import ItemSkeleton from "./ItemSkeleton";
import ShortListItem from "./ShortListItem";
import { removeFromShortList } from "../actions/actions";
import { getShortList } from "@/lib/shortlist";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "@/lib/getServerSession";

export default async function Shortlist() {
    const session = await getServerSession()
    console.log('session', session)
    const shortlistData = await getShortList(session?.user.userId) ?? []
    const movies = shortlistData?.movies as Movie[] || []
    console.log('movies', movies)
    const skeletons = movies?.length < 3 ? [...Array(3 - movies.length)].fill(<ItemSkeleton />) : []

    return (
        <>
        <div className="flex flex-row items-center rounded-lg h-60 w-1/2">
            {movies.map((movie: Movie) => {
                return <ShortListItem key={movie.id} movie={movie} removeFromShortList={removeFromShortList}/>
            })}
            {skeletons.map((skeleton) => {
                return skeleton
            })}
        </div>
        </>
    )
}