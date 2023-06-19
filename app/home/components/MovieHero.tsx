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
        <h2
          className="card-title text-2xl"
          style={{ color: `rgba(${colorPalette.join(",")})` }}
        >
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
        <div className="card-actions">
          
        </div>
        <div className="card-actions justify-end">
          

        </div>
      </div>
    </div>
  );
}
