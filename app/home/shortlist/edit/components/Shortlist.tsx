import ItemSkeleton from "./ItemSkeleton";
import ShortListItem from "./ShortListItem";
import { removeFromShortList } from "../actions/actions";
import { getUserShortList } from "@/lib/shortlist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Shortlist() {
    const session = await getServerSession(authOptions)
    const movies  = await getUserShortList(session?.user.userId) ?? []
    console.log('movies', movies)
    const skeletons = movies.length < 3 ? [...Array(3 - movies.length)].fill(<ItemSkeleton />) : []

    console.log('session data', session)
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