import { getChosenMovie } from "@/lib/shortlist";
import { MovieHero } from "./components/MovieHero";
import DateView from "./components/DateView";
import getQueryClient from "@/lib/getQueryClient";

import { MovieContainer } from "./components/MovieContainer";
import { getAllMoviesOfTheWeek } from "@/lib/utils";

export default async function HomePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["moviesOfTheWeek"],
    queryFn: async () => getAllMoviesOfTheWeek(),
  });

  return <MovieContainer />;
}
