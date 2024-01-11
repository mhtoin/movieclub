import { getChosenMovie } from "@/lib/shortlist";
import { MovieHero } from "./components/MovieHero";
import DateView from "./components/DateView";
import getQueryClient from "@/lib/getQueryClient";

import { MovieContainer } from "./components/MovieContainer";
import { getAllMoviesOfTheWeek } from "@/lib/utils";
import MovieCarousel from "../components/home/MovieCarousel";

export default async function HomePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["moviesOfTheWeek"],
    queryFn: async () => getAllMoviesOfTheWeek(),
  });

  return (
    <div className="flex flex-col justify-center place-items-center gap-5">
      <h1 className="text-4xl font-bold text-center">
        Welcome to the Movie Club
      </h1>
      <MovieCarousel />
    </div>
  );
}
