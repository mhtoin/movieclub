export const revalidate = 0;

import { format, formatISO, nextWednesday } from "date-fns";
import { movieKeys } from "@/lib/movies/movieKeys";
import MovieCarousel from "@/app/components/home/MovieCarousel";
import { getQueryClient } from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import ListView from "components/home/ListView";
import CarouselListView from "@/app/components/home/CarouselListView";
import { getCurrentSession } from "@/lib/authentication/session";
import { redirect } from "next/navigation";
import CurrentMoviePoster from "@/app/components/home/CurrentMoviePoster";
import {
  getMostRecentMovieOfTheWeek,
  getMoviesOfTheWeekByMonth,
} from "@/lib/movies/movies";
import MoviesOfTheMonth from "@/app/components/home/MoviesOfTheMonth";
import { Suspense } from "react";

export default async function HomePage() {
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: ["pastMovies"],
    queryFn: () => getMoviesOfTheWeekByMonth(""),
    initialPageParam: format(new Date(), "yyyy-MM"),
  });

  const dehydratedState = dehydrate(queryClient);
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth relative">
      <div className="snap-start min-h-screen shrink-0">
        <Suspense fallback={null}>
          {/* @ts-expect-error Server Component */}
          <CurrentMoviePoster />
        </Suspense>
      </div>
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={null}>
          <MoviesOfTheMonth />
        </Suspense>
      </HydrationBoundary>
      {/*<div className="snap-start min-h-screen shrink-0">
        
          <ListView />
        </HydrationBoundary>
      </div>*/}
    </div>
  );
}
