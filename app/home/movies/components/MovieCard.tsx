"use client";
import { prominent, average } from "color.js";
import { useEffect, useState } from "react";
import Rating from "./Rating";
import Review from "./Review";
import TierlistFormModal from "./TierlistFormModal";
import { format } from "date-fns";

export default function MovieCard({
  movie,
  tierlist,
  user
}: {
  movie: MovieOfTheWeek;
  tierlist: Tierlist;
  user: User
}) {
  const [colorPalette, setColorPalette] = useState<any>([]);
  const tierlistMovieIds = tierlist.tiers.flatMap((tier) =>
    tier.movies.map((movie) => movie.id)
  );
  const movieInTierlist = tierlist.tiers.find((tier) => {
    return tier.movies.find(movieItem => movieItem.id === movie.id)
  });
  const backgroundPath = movie?.backdrop_path
    ? `http://image.tmdb.org/t/p/original${movie["poster_path"]}`
    : "";

  useEffect(() => {
    if (backgroundPath) {
      const getColor = async () => {
        const color = await prominent(backgroundPath, { amount: 1, group: 30 });
        setColorPalette(color);
      };
      getColor();
      console.log("fetching colors");
    }
  }, []);

  
  if (movie) {
    return (
      <div className="card w-11/12 md:w-11/12 lg:w-8/12 xl:w-9/12 2xl:w-8/12 sm:card-side">
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
            src={backgroundPath}
            alt="Album"
            className="rounded-2xl lg:w-10/12"
          />
        </figure>
        < div className="card-body">
          <h2 className="card-title text-2xl">{`${movie?.title} (${movie?.original_title})`}</h2>
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src={movie?.user?.image} alt={"user"} />
            </div>
          </div>
          <h3 className="text-sm italic">Released: {format(new Date(movie?.release_date), 'dd.MM.yyyy')}</h3>
          <h3 className="text-sm italic">Watched: {movie?.movieOfTheWeek?.toLocaleDateString('fi-FI')}</h3>
          <p className="text-xs xl:text-lg my-2">{movie?.overview}</p>
          {movieInTierlist ? (<div className="badge badge-lg p-5">{movieInTierlist.label} Tier: {movieInTierlist.movies.findIndex(movieItem => movieItem.id === movie.id) + 1}</div>) : (
            <TierlistFormModal tierlist={tierlist} movie={movie} />
          )}
          <div className="divider">Thoughts</div>
          
          <Review movie={movie} user={user}/>
          
          <div className="card-actions"></div>
          <div className="card-actions justify-end">
            {movie?.trailers?.map((trailer) => {
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
              href={movie?.watchProviders?.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="join">
                {movie?.watchProviders?.flatrate?.map((item) => {
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
