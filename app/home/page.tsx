import { getChosenMovie } from "@/lib/shortlist";
import { MovieHero } from "./components/MovieHero";
import Countdown from "./components/Countdown";
import { getServerSession } from "@/lib/getServerSession";
import { getTierlist } from "@/lib/tierlists";

export default async function HomePage() {
  const movieOfTheWeek = await getChosenMovie();
  
  return (
    <div className="flex flex-col items-center justify-normal p-10 gap-10">
      
      <Countdown />
      {/* @ts-expect-error Server Component */}
      <MovieHero movieOfTheWeek={movieOfTheWeek} />
    </div>
  );
}
