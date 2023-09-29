import { useFilterStore } from "@/stores/useFilterStore";
import { useQuery } from "@tanstack/react-query";
import { add, set } from "date-fns";
import { useState } from "react";
import Select from "react-select";

async function getFilters() {
  let res = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en",
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
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

export default function GenreSelect() {
  const genres = useFilterStore.use.genres()
  const setGenres = useFilterStore.use.setGenres()
  const { data: genreOptions, status } = useQuery({
    queryKey: ["genres"],
    queryFn: getFilters,
  });
  return (
    <div className="m-5">
      <Select
        isMulti
        name="genres"
        defaultValue={genres}
        options={genreOptions}
        onChange={(selections) => {
          setGenres([...selections])
        }}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            margin: "auto",
            backgroundColor: "#2a2a33",
            padding: "0px",
          }),
          singleValue: (defaultStyles) => ({
            ...defaultStyles,
            color: "white",
            background: "red",
          }),
          option: (defaultStyles, state) => ({
            ...defaultStyles,
            backgroundColor: "#2a2a33",
          }),
          container: (defaultStyles) => ({
            ...defaultStyles,
            margin: "auto",
          }),
          multiValue: (defaultStyles) => ({
            ...defaultStyles,
            background: "grey",
          }),
        }}
      />
    </div>
  );
}
