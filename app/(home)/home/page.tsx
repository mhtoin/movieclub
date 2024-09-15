export const revalidate = 0;
import getQueryClient from "@/lib/getQueryClient";

import { formatISO, nextWednesday } from "date-fns";
import { Suspense } from "react";

import { movieKeys } from "@/lib/movies/movieKeys";
import CarouselSkeleton from "@/app/components/home/CarouselSkeleton";
import MovieCarousel from "@/app/components/home/MovieCarousel";

export default async function HomePage() {
  const queryClient = getQueryClient();
  const nextMovieDate = formatISO(nextWednesday(new Date()), {
    representation: "date",
  });
  await queryClient.prefetchQuery(movieKeys.next(nextMovieDate));

  return (
    <div className="flex flex-col justify-center place-items-center gap-5 pt-20">
      <h1 className="text-2xl font-bold text-center">
        Welcome to the Movie Club
      </h1>
      <Suspense fallback={<CarouselSkeleton />}>
        <MovieCarousel />
      </Suspense>
    </div>
  );
}
