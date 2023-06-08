"use client";

import { ChangeEvent } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchResults from "./SearchResults";

export default function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);

  const onSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      e.preventDefault();
      console.log("submitted", target.value ?? "no value");
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
        placeholder="Type here"
        className="input input-bordered w-full max-w-xs"
        onKeyDown={onSubmit}
        value={searchValue}
        onChange={handleChange}
      />
      <button
        className="btn rounded-md w-50"
        onClick={(event: React.MouseEvent) => setShouldFetch(true)}
      >
        Search
      </button>
      <div className="w-1/4 rounded-md border-slate-50"></div>
      <SearchResults searchValue={searchValue} shouldFetch={shouldFetch} setShouldFetch={setShouldFetch}/>
    </div>
  );
}
