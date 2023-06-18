import { getChosenMovie } from "@/lib/shortlist";
import { MovieHero } from "./components/MovieHero";
import MovieCard from "./components/MovieCard";

export default async function HomePage() {
  const movieOfTheWeek = await getChosenMovie();
  const backgroundPath = movieOfTheWeek?.backdrop_path
    ? `http://image.tmdb.org/t/p/original${movieOfTheWeek["backdrop_path"]}`
    : "";

  return (
    <div
      className="flex flex-col items-center justify-normal p-20"
     
    >
      <h2>Next movie in counter: 20:24:12</h2>
      {/* @ts-expect-error Server Component */}
      <MovieHero movieOfTheWeek={movieOfTheWeek} />
    </div>
  );
}
