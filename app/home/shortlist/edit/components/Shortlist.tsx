import ItemSkeleton from "./ItemSkeleton";
import ShortListItem from "./ShortListItem";
import { removeFromShortList } from "../actions/actions";
import { randomUUID } from "crypto";

async function getShortList() {
    const res = await fetch('http://localhost:3001/api/shortlist', {
        cache: 'no-store',
        next: {
            tags: ['shortlist']
        }
    })

    const body = await res.json()
    console.log(body)
    return body
}

export default async function Shortlist() {
    const { movies } = await getShortList()
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