import ItemSkeleton from "./ItemSkeleton";
import ShortListItem from "./ShortListItem";
import { removeFromShortList } from "../actions/actions";
import { getShortList } from "@/lib/shortlist";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "@/lib/getServerSession";

export default async function Shortlist() {
  const session = await getServerSession();
  const shortlistData = (await getShortList(session?.user.userId)) ?? [];
  const movies = (shortlistData?.movies as Movie[]) || [];
  const skeletons =
    movies?.length < 3
      ? [...new Array(3 - movies.length)].map((element, index) => (
          <ItemSkeleton key={index} />
        ))
      : [];

  console.log("session search", session);
  return (
    <>
      <div className="flex flex-row gap-3 p-5 flex-wrap items-center sm:w-auto">
        {movies.map((movie: Movie) => {
          return (
            <ShortListItem
              key={movie.tmdbId}
              movie={movie}
              removeFromShortList={removeFromShortList}
              shortlistId={session?.user.shortlistId}
            />
          );
        })}
        {skeletons.map((skeleton) => {
          return skeleton;
        })}
      </div>
    </>
  );
}
