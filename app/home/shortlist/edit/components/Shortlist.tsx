import ItemSkeleton from "./ItemSkeleton";
import ShortListItem from "./ShortListItem";
import { removeFromShortList } from "../actions/actions";
import { randomUUID } from "crypto";
import { getShortlist } from "@/lib/shortlist";


export default async function Shortlist() {
    const movies  = await getShortlist() ?? []
    console.log('movies', movies)
    const skeletons = movies.length < 3 ? [...Array(3 - movies.length)].fill(<ItemSkeleton />) : []

    console.log('data in shortlist', movies)
    console.log('skeletons', skeletons)
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