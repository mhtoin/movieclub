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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col justify-center gap-5 pt-20 overflow-hidden max-h-screen overscroll-none">
        <h1 className="text-2xl font-bold text-center">
          Welcome to the Movie Club
        </h1>
        <ListView />
      </div>
    </HydrationBoundary>
  );
}
