"use client";
import { prominent } from "color.js";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function MovieHero({
  movieOfTheWeek,
}: {
  movieOfTheWeek: MovieOfTheWeek;
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

  if (movieOfTheWeek) {
    return (
      <div className="card md:card-side w-11/12 lg:w-[780px]">
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
            height={1000}
            alt="Album"
            className="rounded-2xl  object-cover gradient-mask-b-90"
          />
        </figure>
        <div className="card-body sm:w-1/2">
          <h2 className="card-title text-2xl">
            {movieOfTheWeek?.original_title}
          </h2>
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src={movieOfTheWeek?.user?.image} alt={"user"} />
            </div>
          </div>
          <h3 className="text-sm italic">{movieOfTheWeek?.release_date}</h3>
          <Link href={`/home/movies/${movieOfTheWeek.id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
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
          <p className="text-sm lg:text-md my-2 max-h-[400px] overflow-scroll ">{movieOfTheWeek?.overview}</p>
          <div className="card-actions"></div>
          <div className="card-actions justify-end">
            {movieOfTheWeek?.trailers?.map((trailer) => {
              return (
                <a
                  key={trailer.id + "-link"}
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    key={trailer.id}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="m20.84 2.18l-3.93.78l2.74 3.54l1.97-.4l-.78-3.92m-6.87 1.36L12 3.93l2.75 3.53l1.96-.39l-2.74-3.53m-4.9.96l-1.97.41l2.75 3.53l1.96-.39L9.07 4.5m-4.91 1l-.98.19a1.995 1.995 0 0 0-1.57 2.35L2 10l4.9-.97L4.16 5.5M20 12v8H4v-8h16m2-2H2v10a2 2 0 0 0 2 2h16c1.11 0 2-.89 2-2V10Z"
                    />
                  </svg>
                </a>
              );
            })}
            <a
              href={movieOfTheWeek?.watchProviders?.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="join">
                {movieOfTheWeek?.watchProviders?.flatrate?.map((item) => {
                  return (
                    <div className="avatar join-item" key={item.provider_id}>
                      <div className="w-10 rounded">
                        <img
                          src={`http://image.tmdb.org/t/p/original${item["logo_path"]}`}
                          alt="logo"
                        />
                      </div>
                    </div>
                  );
                })}
                {movieOfTheWeek?.watchProviders?.free?.map((item) => {
                  return (
                    <div className="avatar join-item" key={item.provider_id}>
                      <div className="w-10 rounded">
                        <img
                          src={`http://image.tmdb.org/t/p/original${item["logo_path"]}`}
                          alt="logo"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>No movie for next week</div>;
  }
}
