import { getChosenMovie } from "@/lib/shortlist";
import { MovieHero } from "./components/MovieHero";
import MovieCard from "./components/MovieCard";
import { getAdditionalInfo } from "@/lib/tmdb";

export default async function HomePage() {
  const movieOfTheWeek = await getChosenMovie();
  
  return (
    <div className="flex flex-col items-center justify-normal p-10">
      
      <h2>Next movie in counter: 20:24:12</h2>
      {/* @ts-expect-error Server Component */}
      <MovieHero movieOfTheWeek={movieOfTheWeek} />
    </div>
  );
}
