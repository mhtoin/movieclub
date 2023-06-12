import { getShortList } from "@/lib/shortlist";
import Link from "next/link";
import groupBy from 'ramda/src/groupBy'

export default async function ShortList() {
  const allMovies = await getShortList() ?? []
  const moviesByUser = groupBy((movie: Movie) => {
    return movie.userId.toString()
  }, allMovies)
            
  console.log(moviesByUser)
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex flex-row items-center justify-evenly gap-5">
        <div className="bg-slate-700 border rounded-md border-slate-300 hover:border-slate-400 p-3">
          <Link href={"/home/shortlist/edit"}>Edit</Link>
        </div>
        <button className="bg-slate-700 border rounded-md border-slate-300 hover:border-slate-400 p-3 ">
          Raffle
        </button>
      </div>
      <div className="relative flex place-items-center">
        Short list of movie candidates
      </div>
    </main>
  );
}
