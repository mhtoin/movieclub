import { getAllShortLists, getShortList } from "@/lib/shortlist";
import { RaffleClient } from "./components/RaffleClient";
import { startRaffle } from "../edit/actions/actions";

export default async function Raffle() {
  const allShortlists = await getAllShortLists();

  console.log("all shortlists", allShortlists);
  /*
  const allMovies = await getShortList() ?? []
  const moviesByUser = groupBy((movie: Movie) => {
    return movie.userId.toString()
  }, allMovies)*/

  return (
    <main className="flex min-h-screen flex-col items-center p-24 overflow-hidden">
      <div className="flex flex-row items-center justify-evenly gap-5"></div>
      <div className="flex flex-col place-items-center m-5">
        <RaffleClient allShortlists={allShortlists}/>
      </div>
    </main>
  );
}
