"use client";

import { useQuery } from "@tanstack/react-query";
import GenreSelect from "./GenreSelect";
import RangeSlider from "./RangeSlider";
import { Dispatch, SetStateAction, useState } from "react";
import ProviderToggle from "./ProviderToggle";
import { useFilterStore } from "@/stores/useFilterStore";
import { setYear } from "date-fns";
import { Button } from "@/app/components/ui/Button";

interface modalProps {
  handleSearchSubmit: () => void;
  //handleProviderToggle: Dispatch<SetStateAction<boolean>>
}

export default function FiltersModal({
  handleSearchSubmit,
}: //handleProviderToggle,
modalProps) {
  const yearRange = useFilterStore.use.yearRange();
  const ratingRange = useFilterStore.use.ratingRange();
  const setYearRange = useFilterStore.use.setYearRange();
  const setRatingRange = useFilterStore.use.setRatingRange();

  return (
    <>
      <Button
        onClick={() => {
          if (document) {
            (
              document.getElementById("filtersModal") as HTMLFormElement
            ).showModal();
          }
        }}
      >
        Search filters
      </Button>
      <dialog id="filtersModal" className="modal modal-middle sm:modal-middle">
        <form method="dialog" className="modal-box h-2/3 ">
          <h3 className="font-bold text-lg m-5">Hello!</h3>
          <GenreSelect />
          <div className="divider">Rating range</div>
          <h3 className="font-bold text-lg m-5">Min</h3>
          <RangeSlider
            startingValue={ratingRange.min}
            min="0"
            max="10"
            step="0.1"
            label="min"
            onChange={setRatingRange}
          />
          <h3 className="font-bold text-lg m-5">Max</h3>
          <RangeSlider
            startingValue={ratingRange.max}
            min="0"
            max="10"
            step="0.1"
            label="max"
            onChange={setRatingRange}
          />
          <div className="divider">Release year </div>
          <h3 className="font-bold text-lg m-5">Min</h3>
          <RangeSlider
            startingValue={yearRange.min}
            min="1900"
            max={new Date().getFullYear().toString()}
            step="1"
            label="min"
            onChange={setYearRange}
          />
          <h3 className="font-bold text-lg m-5">Max</h3>
          <RangeSlider
            startingValue={yearRange.max}
            min="1900"
            max={new Date().getFullYear().toString()}
            step="1"
            label="max"
            onChange={setYearRange}
          />
          <div className="divider">Providers</div>
          {/*<ProviderToggle handleProviderToggle={handleProviderToggle} />*/}

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
