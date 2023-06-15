import { getAllShortLists, getShortList } from "@/lib/shortlist";
import Link from "next/link";
import groupBy from 'ramda/src/groupBy'
import ShortListItem from "./edit/components/ShortListItem";

export default async function ShortList() {
  const allShortlists = await getAllShortLists()

  console.log('all shortlists', allShortlists)
  /*
  const allMovies = await getShortList() ?? []
  const moviesByUser = groupBy((movie: Movie) => {
    return movie.userId.toString()
  }, allMovies)*/
            
  return (
    <main className="flex min-h-screen flex-col items-center p-24 overflow-hidden">
      <div className="flex flex-row items-center justify-evenly gap-5">
        <div className="bg-slate-700 border rounded-md border-slate-300 hover:border-slate-400 p-3">
          <Link href={"/home/shortlist/edit"}>Edit</Link>
        </div>
        <button className="bg-slate-700 border rounded-md border-slate-300 hover:border-slate-400 p-3 ">
          Raffle
        </button>
      </div>
      <div className="flex flex-col place-items-center m-5">
        {allShortlists.map(shortlist => {
          return (
            <>
            <h1 key={shortlist.id + '-title'} className="text-xl m-5">{shortlist.user.name}</h1>
            <div key={shortlist.id + '-container'} className="flex flex-row gap-5 w-2/3 sm:w-auto">
              {shortlist.movies.map(movie => {
                return <ShortListItem key={shortlist.id + movie.id} movie={movie} shortlistId={shortlist.id} />
              })}
            </div>
            </>
          )
        })}
      </div>
    </main>
  );
}
