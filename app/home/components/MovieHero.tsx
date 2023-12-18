"use client";
import { prominent } from "color.js";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function MovieHero({
  movieOfTheWeek,
  direction,
}: {
  movieOfTheWeek: MovieOfTheWeek;
  direction: number;
}) {
  const [colorPalette, setColorPalette] = useState<any>([]);
  const backgroundPath = movieOfTheWeek?.backdrop_path
    ? `http://image.tmdb.org/t/p/original${movieOfTheWeek["poster_path"]}`
    : "";

  useEffect(() => {
    if (backgroundPath) {
      const getColor = async () => {
        const color = await prominent(backgroundPath, { amount: 1, group: 30 });
        setColorPalette(color);
      };
      getColor();
    }
  }, []);

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction,
        opacity: 0,
      };
    },
  };

  if (movieOfTheWeek) {
    return (
      <motion.div
        key={movieOfTheWeek?.id}
        initial="enter"
        animate="center"
        exit="exit"
        custom={direction}
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        variants={variants}
      >
        <div className="group card min-h-[500px] md:card-side lg:w-[380px] xl:w-[380px] 2xl:w-[580px] backdrop-blur-md bg-opacity-60 bg-slate12">
          <figure
            className="shadow-xl"
            style={{
              filter: `drop-shadow(0 0px 20px rgba(${colorPalette.join(
                ", "
              )}, 0.35)) drop-shadow(0 0px 35px rgba(${colorPalette.join(
                ", "
              )}, 0.1))`,
            }}
          >
            <Image
              src={backgroundPath}
              width={700}
              height={500}
              alt="Movie card background"
              className="rounded-2xl object-cover gradient-mask-b-90 relative group-hover:opacity-50"
              priority={true}
            />
            <button className="border btn btn-ghost btn-circle btn-sm absolute top-1/2 right-1/2 left-1/2 group-hover:flex hidden">
              <Link href={`/home/movies/${movieOfTheWeek?.id}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current text-white"
                >
                  <g fill="none">
                    <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
                    <path
                      fill="currentColor"
                      d="M13 3a1 1 0 0 1 .117 1.993L13 5H5v14h14v-8a1 1 0 0 1 1.993-.117L21 11v8a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3h8Zm6.243.343a1 1 0 0 1 1.497 1.32l-.083.095l-9.9 9.899a1 1 0 0 1-1.497-1.32l.083-.094l9.9-9.9Z"
                    />
                  </g>
                </svg>
              </Link>
            </button>
          </figure>
        </div>
      </motion.div>
    );
  } else {
    return (
      <motion.div
        key={"no-movie"}
        initial={{ opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: direction, opacity: 0 }}
      >
        <div>No movie for the week yet!</div>
      </motion.div>
    );
  }
}
