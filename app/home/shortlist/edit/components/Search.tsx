"use client";

import { ChangeEvent } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchResults from "./SearchResults";

export default function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [slide, setSlide] = useState(0);

  const onSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShouldFetch(true);
      setSlide(0);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setSearchValue(target.value);
  };

  return (
    <div className="form-control w-full max-w-xs gap-2 flex flex-column items-center">
      <input
        type="text"
        placeholder="e.q title (2023)"
        className="input input-bordered w-full max-w-xs"
        onKeyDown={onSubmit}
        value={searchValue}
        onChange={handleChange}
      />
      <a
        href={"#item0"}
        className="btn rounded-md w-50"
        onClick={(event: React.MouseEvent) => {
          setShouldFetch(true);
          setSlide(0);
        }}
      >
        Search
      </a>
      <SearchResults
        searchValue={searchValue}
        shouldFetch={shouldFetch}
        setShouldFetch={setShouldFetch}
        slide={slide}
        setSlide={setSlide}
      />
    </div>
  );
}
