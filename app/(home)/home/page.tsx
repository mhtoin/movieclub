export const revalidate = 0;

import { formatISO, nextWednesday } from "date-fns";
import { movieKeys } from "@/lib/movies/movieKeys";
import MovieCarousel from "@/app/components/home/MovieCarousel";
import { getQueryClient } from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import ListView from "components/home/ListView";
import CarouselListView from "@/app/components/home/CarouselListView";
import { getCurrentSession } from "@/lib/authentication/session";
import { redirect } from "next/navigation";
import CurrentMoviePoster from "@/app/components/home/CurrentMoviePoster";
import { getMostRecentMovieOfTheWeek } from "@/lib/movies/movies";
import MoviesOfTheMonth from "@/app/components/home/MoviesOfTheMonth";

export default async function HomePage() {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }

  const queryClient = getQueryClient();
  const nextMovieDate = formatISO(nextWednesday(new Date()), {
    representation: "date",
  });
  queryClient.prefetchQuery(movieKeys.next(nextMovieDate));

  return (
    <div className="h-full flex flex-col justify-center overscroll-none overflow-y-auto snap-y snap-mandatory scroll-smooth">
      {/* @ts-expect-error Server Component */}
      <CurrentMoviePoster />
    </div>
  );
}
