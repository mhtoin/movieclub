"use client";

import { useQuery } from "@tanstack/react-query";
import GenreSelect from "./GenreSelect";
import RangeSlider from "./RangeSlider";
import { Dispatch, SetStateAction, useState } from "react";
import ProviderToggle from "./ProviderToggle";

interface modalProps {
  handleGenreSelection: (
    genres: number
  ) => void;
  handleSearchSubmit: () => void
  handleYearRangeSelect: (label: string, value: string) => void
  handleRatingRangeSelect: (label: string, value: string) => void
  handleProviderToggle: Dispatch<SetStateAction<boolean>>
  genreSelections: number[]
}

async function getFilters() {
  let res = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en",
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.moviedbtoken}`,
      },
    }
  );

  let responseBody = await res.json();

  if (responseBody.genres) {
    return responseBody.genres.map((genre: { name: string; id: number }) => {
      return { label: genre.name, value: genre.id };
    }) as Array<{ label: string, value: number}>;
  }
}

export default function FiltersModal({
  handleGenreSelection,
  handleSearchSubmit,
  handleYearRangeSelect,
  handleRatingRangeSelect,
  handleProviderToggle,
  genreSelections,
}: modalProps) {
  const [value, setValue] = useState({ min: 0, max: 100 });
  const { data: genreOptions, status } = useQuery({
    queryKey: ["genres"],
    queryFn: getFilters,
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  return (
    <>
      <button className="btn" onClick={() => {
        if (document) {
          (document.getElementById('filtersModal') as HTMLFormElement).showModal()
        }
      }}>
        search filters
      </button>
      <dialog id="filtersModal" className="modal modal-bottom sm:modal-middle">
        <form method="dialog" className="modal-box h-1/2 ">
          <h3 className="font-bold text-lg m-5">Hello!</h3>
          <GenreSelect
            genreOptions={genreOptions!}
            handleGenreSelection={handleGenreSelection}
            genreSelections={genreSelections}
          />
          <div className="divider">Rating range</div>
          <h3 className="font-bold text-lg m-5">Min</h3>
          <RangeSlider
            startingValue="0"
            min="0"
            max="10"
            step="0.1"
            label="min"
            onChange={handleRatingRangeSelect}
          />
          <h3 className="font-bold text-lg m-5">Max</h3>
          <RangeSlider
            startingValue="10"
            min="0"
            max="10"
            step="0.1"
            label="max"
            onChange={handleRatingRangeSelect}
          />
          <div className="divider">Release year </div>
          <h3 className="font-bold text-lg m-5">Min</h3>
          <RangeSlider
            startingValue="1900"
            min="1900"
            max={new Date().getFullYear().toString()}
            step="1"
            label="min"
            onChange={handleYearRangeSelect}
          />
          <h3 className="font-bold text-lg m-5">Max</h3>
          <RangeSlider
            startingValue={new Date().getFullYear().toString()}
            min="1900"
            max={new Date().getFullYear().toString()}
            step="1"
            label="max"
            onChange={handleYearRangeSelect}
          />
          <div className="divider">Providers</div>
          <ProviderToggle handleProviderToggle={handleProviderToggle} />

          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn" onClick={handleSearchSubmit}>
              Search
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
