import { getChosenMovie } from "@/lib/shortlist";
import { MovieHero } from "./components/MovieHero";

export default async function HomePage() {
  const movieOfTheWeek = await getChosenMovie();
  
  
  return (
    <div className="flex flex-col items-center justify-normal p-10 gap-10">
      {/* @ts-expect-error Server Component */}
      <MovieHero movieOfTheWeek={movieOfTheWeek} />
    </div>
  );
}
