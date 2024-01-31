export const revalidate = 0;
import getQueryClient from "@/lib/getQueryClient";
import { getAllMoviesOfTheWeek } from "@/lib/utils";
import MovieCarousel from "../components/home/MovieCarousel";
import { movieKeys } from "@/lib/movies/queries";

export default async function HomePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(movieKeys.next(new Date()));

  return (
    <div className="flex flex-col justify-center place-items-center gap-5">
      <h1 className="text-4xl font-bold text-center">
        Welcome to the Movie Club
      </h1>
      <MovieCarousel />
    </div>
  );
}
