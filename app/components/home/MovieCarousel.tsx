"use client";

import {
  findMovieDate,
  getAllMoviesOfTheWeek,
  sortByISODate,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/Carousel";
import { MovieHero } from "@/app/home/components/MovieHero";
import { Card, CardContent } from "../ui/Card";
import {
  format,
  formatISO,
  isWednesday,
  nextWednesday,
  previousWednesday,
  set,
} from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { MovieDatePicker } from "@/app/home/components/MovieDatePicker";
import { NextButton, PrevButton } from "./CarouselButton";
import toast from "react-hot-toast";

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

export default function MovieCarousel() {
  const [movieDate, setMovieDate] = useState<Date>(
    isWednesday(new Date()) ? new Date() : nextWednesday(new Date())
  );
  const [api, setApi] = useState<CarouselApi>();
  const [tweenValues, setTweenValues] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const { data, status } = useQuery({
    queryKey: ["moviesOfTheWeek"],
    queryFn: getAllMoviesOfTheWeek,
    refetchInterval: 1000 * 60 * 60 * 24,
    refetchIntervalInBackground: true,
    gcTime: 0,
  });

  let sortedData = data
    ? Object.keys(data).sort((a, b) => sortByISODate(a, b, "desc"))
    : null;

  //console.log(sortedData);

  const onInit = useCallback((api: CarouselApi) => {
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = useCallback(
    (api: CarouselApi) => {
      const selected = api.selectedScrollSnap();

      let sortedData = data
        ? Object.keys(data).sort((a, b) => sortByISODate(a, b, "desc"))
        : null;
      const movieDate = sortedData ? new Date(sortedData[selected]) : null;

      setSelectedIndex(selected);
      if (movieDate) {
        setMovieDate(movieDate);
      }
    },
    [data]
  );

  const onMovieDateSelect = useCallback(
    (date: Date) => {
      setMovieDate(date);
      const ISODate = formatISO(date, { representation: "date" });
      let sortedData = data
        ? Object.keys(data).sort((a, b) => sortByISODate(a, b, "desc"))
        : null;
      const index = sortedData ? sortedData.indexOf(ISODate) : 0;
      if (index !== -1) {
        api?.scrollTo(index);
      } else {
        console.log(ISODate);
        console.log(sortedData);
        toast.error("No movie found for this date");
      }
    },
    [api, data]
  );

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

    const styles = api.scrollSnapList().map((snap, index) => {
      const diff = snap - scrollProgress;
      const tweenValue = 1 - Math.abs(diff * 9.8);
      return numberWithinRange(tweenValue, 0, 1);
    });
    setTweenValues(styles);
  }, [api, setTweenValues]);

  useEffect(() => {
    if (!api) return;

    onScroll();
    api.on("scroll", () => {
      flushSync(() => onScroll());
    });
    api.on("select", onSelect);
    api.on("reInit", onScroll);
    api.on("reInit", onInit);
  }, [api, onScroll, onSelect, onInit]);

  return (
    <div className="flex flex-col items-center justify-normal p-10 gap-10 no-scrollbar">
      <div className="flex flex-row items-center border bg-transparent rounded-md max-w-[200px] m-1">
        <MovieDatePicker selected={movieDate} setSelected={onMovieDateSelect} />
      </div>
      <Carousel
        className="w-full max-w-xl"
        opts={{
          direction: "rtl",
          align: "center",
        }}
        setApi={setApi}
      >
        <CarouselContent className="-ml-1" dir="rtl">
          {data &&
            sortedData?.map((date, index) => {
              const movie = data[date];
              const backgroundPath = movie?.backdrop_path
                ? `http://image.tmdb.org/t/p/original${movie["poster_path"]}`
                : "";
              return (
                <CarouselItem
                  key={date}
                  className="md:basis-1/2 lg:basis-2/3"
                  style={{
                    ...(tweenValues.length && { opacity: tweenValues[index] }),
                  }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="flex aspect-square items-center justify-center p-0">
                      <img
                        src={backgroundPath}
                        className="w-full h-auto"
                        alt="movie poster"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
        </CarouselContent>
        <CarouselPrevious
          rtl={true}
          onClick={scrollNext}
          className="hidden lg:flex"
        />
        <CarouselNext
          rtl={true}
          className="hidden lg:flex"
          onClick={scrollPrev}
        />
      </Carousel>
    </div>
  );
}
