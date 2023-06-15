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

  return (
    <>
      <div className="carousel py-5 md:px-3 md:gap-5">
        {movies.map((movie: Movie) => {
          return (
            <div
              id={movie.tmdbId.toString()}
              key={"carousel-item-" + movie.tmdbId}
              className="carousel-item w-full md:w-auto"
            >
              <ShortListItem
                key={movie.tmdbId}
                movie={movie}
                removeFromShortList={removeFromShortList}
                shortlistId={session?.user.shortlistId}
              />
            </div>
          );
        })}
        {skeletons.map((skeleton) => {
          return skeleton;
        })}
      </div>
      <div className="flex justify-center w-full gap-2">
        <a
          href="#item1"
          className="mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
        ></a>
        <a
          href="#item1"
          className="mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
        ></a>
        <a
          href="#item1"
          className="mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
        ></a>
      </div>
    </>
  );
}
