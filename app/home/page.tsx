export const revalidate = 0;
import getQueryClient from "@/lib/getQueryClient";
import { getAllMoviesOfTheWeek } from "@/lib/utils";
import MovieCarousel from "../components/home/MovieCarousel";
import { movieKeys } from "@/lib/movies/queries";
import { formatISO, nextWednesday } from "date-fns";

export default async function HomePage() {
  const queryClient = getQueryClient();
  const nextMovieDate = formatISO(nextWednesday(new Date()), {
    representation: "date",
  });
  await queryClient.prefetchQuery(movieKeys.next(nextMovieDate));

  return (
    <div className="flex flex-col justify-center place-items-center gap-5">
      <h1 className="text-4xl font-bold text-center">
        Welcome to the Movie Club
      </h1>
      <MovieCarousel />
    </div>
  );
}
