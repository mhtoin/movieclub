import { getChosenMovie } from "@/lib/shortlist";
import { MovieHero } from "./components/MovieHero";
import DateView from "./components/DateView";
import getQueryClient from "@/lib/getQueryClient";
import { getAllMoviesOfTheWeek } from "@/lib/movies";

export default async function HomePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["moviesOfTheWeek"],
    queryFn: async () => getAllMoviesOfTheWeek(),
  });
  const movieOfTheWeek = await getChosenMovie();
  
  
  return (
    <div className="flex flex-col items-center justify-normal p-10 gap-10">
      <div className="flex flex-col justify-center place-items-center gap-5">
      <h1 className="text-4xl font-bold text-center">
        Welcome to Movie Night!
        </h1>
        {movieOfTheWeek && <DateView movieOfTheWeek={movieOfTheWeek} />}
      
      </div>
      {movieOfTheWeek &&  <MovieHero movieOfTheWeek={movieOfTheWeek} />}
    </div>
  );
}
