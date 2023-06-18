"use client";
import { prominent, average } from "color.js";
import { useEffect, useState } from "react";

export function MovieHero({ movieOfTheWeek }) {
  const [colorPalette, setColorPalette] = useState([]);
  const backgroundPath = movieOfTheWeek?.backdrop_path
    ? `http://image.tmdb.org/t/p/original${movieOfTheWeek["backdrop_path"]}`
    : "";

  useEffect(() => {
    const getColor = async () => {
      const color = await average(
        `http://image.tmdb.org/t/p/original${movieOfTheWeek["poster_path"]}`,
        { amount: 5, group: 30 }
      );
      setColorPalette(color)
    };
    getColor()
    console.log('fetching colors')
  }, []);

  return (
    <div className="rounded-md flex flex-row justify-center">
      <div className="card md:w-6/12 md:card-side bg-transparent">
        <figure
          style={{
            filter: `drop-shadow(0 0px 20px rgba(${colorPalette.join(', ')}, 0.25)) drop-shadow(0 0px 65px rgba(${colorPalette.join(', ')}, 0.1))`,
          }}
        >
          <img
            src={`http://image.tmdb.org/t/p/original${movieOfTheWeek["poster_path"]}`}
            alt="Album"
            className="rounded-xl m-5 md:w-10/12"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{movieOfTheWeek?.original_title}</h2>
          <p className="text-sm">{movieOfTheWeek?.overview}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Listen</button>
          </div>
        </div>
      </div>
    </div>
  );
}
