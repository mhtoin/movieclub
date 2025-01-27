import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/Carousel";
import PosterCard from "./PosterCard";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { movieKeys } from "@/lib/movies/movieKeys";
import { useQuery } from "@tanstack/react-query";
import { format, formatISO, nextWednesday } from "date-fns";
import { flushSync } from "react-dom";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

export default function PosterCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const nextMovieDate = formatISO(nextWednesday(new Date()), {
    representation: "date",
  });
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const { data, status } = useQuery(movieKeys.next(nextMovieDate));
  const dates = Object.keys(data || {}).map((date) => ({
    date: date,
    label: format(new Date(date), "MMMM"),
  }));

  const onInit = useCallback((api: CarouselApi) => {
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const onScroll = useCallback(() => {
    if (!api) return;

    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();

    // Get the current slide index based on scroll progress
  }, [api, dates.length, scrollNext, scrollPrev]);

  useEffect(() => {
    if (!api) return;

    api.on("scroll", onScroll);
    api.on("reInit", onScroll);
    api.on("reInit", onInit);
  }, [api, onScroll, onInit]);
  return (
    <Carousel
      orientation="vertical"
      setApi={setApi}
      plugins={[
        {
          name: "wheelGestures",
          options: {},
          init: (embla, optionsHandler) => {
            const wheelGestures = WheelGesturesPlugin();
            wheelGestures.init(embla as any, optionsHandler);
            return wheelGestures.destroy;
          },
          destroy: () => {},
        },
      ]}
    >
      <CarouselContent>
        {data &&
          Object.keys(data).map((date, index) => {
            const movies: MovieOfTheWeek[] =
              index % 2 === 0
                ? data[date as keyof typeof data]
                : data[date as keyof typeof data].toReversed();
            const month = format(new Date(date), "MMMM");

            return (
              <CarouselItem
                key={index}
                className="flex flex-col gap-4 relative snap-start"
                id={date}
              >
                <h2 className="upright absolute top-1/2 left-0 -translate-y-1/2 text-2xl font-bold leading-none">
                  {month}
                </h2>
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 px-20 snap-start">
                  {movies.map((movie: MovieOfTheWeek) => (
                    <div
                      className="flex flex-col items-center justify-center h-full gap-2"
                      key={movie.id}
                      id={movie.id}
                    >
                      <h1 className="text-2xl font-bold">
                        {new Date(movie.watchDate).toLocaleDateString("fi-FI")}
                      </h1>
                      <PosterCard movie={movie} key={movie?.id} />
                    </div>
                  ))}
                </div>
              </CarouselItem>
            );
          })}
      </CarouselContent>
    </Carousel>
  );
}
