import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import ShortlistMovieItem from "./ShortlistMovieItem";
import ItemSkeleton from "../../components/ItemSkeleton";

export default function ShortlistContainer() {
  const { data: session } = useSession();
  const { data: shortlist, status: shortlistStatus } = useQuery({
    queryKey: ["shortlist"],
    queryFn: async () => {
      let res = await fetch(`/api/shortlist/${session?.user.userId}`, {});
      return await res.json();
    },
    enabled: !!session,
  });

  const movies = (shortlist?.movies as Movie[]) || [];
  const skeletons =
    movies?.length < 3
      ? [...new Array(3 - movies.length)].map((element, index) => (
          <ItemSkeleton key={index} />
        ))
      : [];

  return (
    <div className="flex flex-row gap-3 p-5 flex-wrap items-center sm:w-auto">
      {shortlist.movies.map((movie: Movie) => {
        return (
          <ShortlistMovieItem
            key={movie.tmdbId}
            movie={movie}
            shortlistId={session?.user.shortlistId}
          />
        );
      })}
      {skeletons.map((skeleton) => {
          return skeleton;
        })} 
    </div>
  );
}
