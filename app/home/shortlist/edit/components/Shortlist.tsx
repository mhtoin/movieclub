import { getServerSession } from "next-auth";
import ItemSkeleton from "./ItemSkeleton";
import ShortListItem from "./ShortListItem";
import { getShortList } from "@/lib/shortlist";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

//import { getServerSession } from "@/lib/deprecated_getServerSession";

export default async function Shortlist() {
  const session = await getServerSession(authOptions);
  const shortlistData = (await getShortList(session?.user.userId)) ?? [];
  const movies = (shortlistData?.movies as Movie[]) || [];
  const skeletons =
    movies?.length < 3
      ? [...new Array(3 - movies.length)].map((element, index) => (
          <ItemSkeleton key={index} />
        ))
      : [];

  return (
    <>
      <div className="flex flex-row gap-3 p-5 flex-wrap items-center sm:w-auto">
        {movies.map((movie: Movie) => {
          return (
            <ShortListItem
              key={movie.tmdbId}
              movie={movie}
              removeFromShortList={true}
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
