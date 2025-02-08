export const revalidate = 0;

import { getCurrentSession } from "@/lib/authentication/session";
import { redirect } from "next/navigation";
import CurrentMoviePoster from "@/app/components/home/CurrentMoviePoster";
import { getMostRecentMovieOfTheWeek } from "@/lib/movies/movies";
import MoviesOfTheMonth from "@/app/components/home/MoviesOfTheMonth";
import { Suspense } from "react";

export default async function HomePage() {
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

      {/*<div className="snap-start min-h-screen shrink-0">
        <HydrationBoundary state={dehydratedState}>
          <ListView />
        </HydrationBoundary>
      </div>*/}
    </div>
  );
}
