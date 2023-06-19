"use client";
import { prominent, average } from "color.js";
import { useEffect, useState } from "react";
import Rating from "./Rating";

export function MovieHero({ movieOfTheWeek }: { movieOfTheWeek: Movie }) {
  const [colorPalette, setColorPalette] = useState<any>([]);
  const backgroundPath = movieOfTheWeek?.backdrop_path
    ? `http://image.tmdb.org/t/p/original${movieOfTheWeek["backdrop_path"]}`
    : "";

  useEffect(() => {
    const getColor = async () => {
      const color = await prominent(
        `http://image.tmdb.org/t/p/original${movieOfTheWeek["poster_path"]}`,
        { amount: 1, group: 30 }
      );
      setColorPalette(color);
    };
    getColor();
    console.log("fetching colors");
  }, []);

  return (
    <div className="card w-11/12 md:w-8/12 lg:w-6/12 sm:card-side">
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
        <img
          src={`http://image.tmdb.org/t/p/original${movieOfTheWeek["poster_path"]}`}
          alt="Album"
          className="rounded-2xl lg:w-10/12"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl">
          {movieOfTheWeek?.original_title}
        </h2>
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
            <span className="text-xs">User</span>
          </div>
        </div>
        <h3 className="text-sm italic">{movieOfTheWeek.release_date}</h3>
        <Rating />
        <p className="text-xs xl:text-lg my-2">{movieOfTheWeek?.overview}</p>
        <div className="card-actions"></div>
        <div className="card-actions justify-end">
          {movieOfTheWeek.trailers.map((trailer) => {
            return (
              <a
                key={trailer.id + "-link"}
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  key={trailer.id + "-tooltip"}
                  className="tooltip tooltip-primary tooltip-open"
                  data-tip={trailer.name}
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
                </div>
              </a>
            );
          })}
          <a
            href={movieOfTheWeek.watchProviders.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="join">
              {movieOfTheWeek.watchProviders?.flatrate.map((item) => {
                return (
                  <div className="avatar join-item" key={item.provider}>
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
}
