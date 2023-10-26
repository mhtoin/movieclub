import { getChosenMovie } from "@/lib/shortlist";
import { MovieHero } from "./components/MovieHero";
import DateView from "./components/DateView";
import getQueryClient from "@/lib/getQueryClient";
import { getAllMoviesOfTheWeek } from "@/lib/movies";
import { MovieContainer } from "./components/MovieContainer";

export default async function HomePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["moviesOfTheWeek"],
    queryFn: async () => getAllMoviesOfTheWeek(),
  });
  const movieOfTheWeek = await getChosenMovie();
  
  
  return (
    <MovieContainer />
  );
}
