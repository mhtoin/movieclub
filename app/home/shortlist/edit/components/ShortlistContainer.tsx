import ItemSkeleton from "./ItemSkeleton";
import ShortListItem from "./ShortListItem";

export default function ShortlistContainer({ shortlist}: { shortlist: Shortlist }) {
  const movies = (shortlist?.movies as Movie[]) || [];
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
              shortlistId={shortlist.id}
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
