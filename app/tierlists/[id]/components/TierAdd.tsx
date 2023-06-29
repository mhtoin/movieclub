"use client";

import { Tierlists, TierlistsTier } from "@prisma/client";
import { startTransition, useState } from "react";
import { findIndex, range } from "underscore";
import { addMovieToTier } from "../../actions/actions";

export default function TierAdd({
  movies,
  tierlist,
}: {
  movies: Array<Movie>;
  tierlist: Tierlist;
}) {
  const [selectedMovie, setSelectedMovie] = useState<Movie>(movies[0] ?? "");
  const [tierName, setTierName] = useState(tierlist?.tiers[0]?.label || "");
  const currentTier = tierlist.tiers.find((tier) => tier.label === tierName);

  const [movieIndex, setMovieIndex] = useState(currentTier && currentTier.movies ? currentTier?.movies?.length + 1 : 1);

  const handleChange = (value: string) => {
    const movie = movies.find((item) => item.title === value);

    if (movie) {
      setSelectedMovie(movie);
    }
    
  };

  const handleTierChange = (value: string) => {
    setTierName(value);
  };

  const handleAdd = () => {
    console.log("handling add", currentTier, movieIndex, selectedMovie);
    // need new object for converted tierlist
    if (currentTier && selectedMovie) {
      let currentTierMoviesWithIds = currentTier.movies.map(movie => movie.id) as Array<string>
      currentTierMoviesWithIds.splice(movieIndex, 0, selectedMovie.id ?? '')
      //currentTierMoviesWithIds[movieIndex] = selectedMovie.id ?? ''
      
      const currentTierObj = {...currentTier, movies: currentTierMoviesWithIds} as TierlistsTier

      // need to convert the movielists in tiers back to contain only the id
      // !TODO honestly this needs a better solution

      let tiers = tierlist.tiers.map(tier => {
        const tierMovies = tier.movies.map(movie => movie.id)
        return {...tier, movies: tierMovies} as TierlistsTier
      }) as Array<TierlistsTier>

      let currentTierIndex = findIndex(tiers, (tier) => {
        return tier.label === tierName;
      });

      tiers[currentTierIndex] = currentTierObj;
      console.log(tiers);
      startTransition(() => {
        addMovieToTier(tierlist.id, tiers);
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-5">
      <select
        className="select select-bordered max-w-xs"
        onChange={(event) => handleChange(event.target.value)}
      >
        {movies?.map((movie) => {
          return (
            <>
              <option>{movie.title}</option>
            </>
          );
        })}
      </select>
      <select
        className="select select-bordered max-w-xs"
        onChange={(event) => handleTierChange(event.target.value)}
      >
        {tierlist?.tiers.map((tier) => {
          return <option key={tier.label}>{tier.label}</option>;
        })}
      </select>
      <select
        className="select select-bordered max-w-xs"
        onChange={(event) => setMovieIndex(parseInt(event.target.value) - 1)}
      >
        {currentTier && currentTier?.movies?.length > 0 ? (
          range(currentTier.movies.length + 1).map((index) => {
            return <option key={index}>{index + 1}</option>;
          })
        ) : (
          <option>0</option>
        )}
      </select>
      <button className="btn" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
}
