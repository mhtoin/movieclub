"use client";

import { getAllMoviesOfTheWeek } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/Carousel";
import { MovieHero } from "@/app/home/components/MovieHero";
import { Card, CardContent } from "../ui/Card";
import { format } from "date-fns";

export default function MovieCarousel() {
  const { data, status } = useQuery({
    queryKey: ["moviesOfTheWeek"],
    queryFn: getAllMoviesOfTheWeek,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    gcTime: 0,
  });

  return (
    <div className="flex flex-col items-center justify-normal p-10 gap-10 no-scrollbar">
      <Carousel className="w-full max-w-sm">
        <CarouselContent className="-ml-1">
          {data &&
            Object.keys(data).map((date) => {
              const movie = data[date];
              const backgroundPath = movie?.backdrop_path
                ? `http://image.tmdb.org/t/p/original${movie["poster_path"]}`
                : "";
              return (
                <CarouselItem key={date} className="md:basis-1/2 lg:basis-2/3">
                  <Card className="overflow-hidden">
                    <CardContent className="flex aspect-square items-center justify-center p-0">
                      <img src={backgroundPath} className="w-full h-auto"></img>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
