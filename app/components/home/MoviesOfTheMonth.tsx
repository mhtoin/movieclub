import { getMoviesOfOfTheWeekByMonth } from "@/lib/movies/movies";
import type { MovieOfTheWeek } from "@/types/movie.type";
import MovieGalleryItem from "./MovieGalleryItem";
import { getBlurDataUrl } from "@/lib/utils";

export default async function MoviesOfTheMonth() {
  const movies = await getMoviesOfOfTheWeekByMonth();

  return (
    <>
      {Object.keys(movies).map((month) => {
        const moviesOfTheMonth = movies[month];
        return (
          <div className="gallery snap-start min-h-screen shrink-0" key={month}>
            {moviesOfTheMonth.map(async (movie: MovieOfTheWeek) => {
              return <MovieGalleryItem movie={movie} key={movie.id} />;
            })}
          </div>
        );
      })}
    </>
  );
}
