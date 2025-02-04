import { getMoviesOfOfTheWeekByMonth } from "@/lib/movies/movies";
import type { MovieOfTheWeek } from "@/types/movie.type";
import MovieGalleryItem from "./MovieGalleryItem";

export default async function MoviesOfTheMonth() {
  const movies = await getMoviesOfOfTheWeekByMonth();

  return (
    <>
      {Object.keys(movies).map((month) => {
        const moviesOfTheMonth = movies[month];
        return (
          <div
            className="w-screen h-screen border flex items-center justify-center relative snap-start listview-section"
            key={month}
          >
            <div className="gallery">
              {moviesOfTheMonth.map((movie: MovieOfTheWeek) => {
                return <MovieGalleryItem movie={movie} key={movie.id} />;
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
