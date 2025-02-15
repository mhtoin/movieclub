import { getFilters } from "@/lib/movies/queries";
import { useFilterStore } from "@/stores/useFilterStore";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";

export default function GenreSelect() {
  const genres = useFilterStore.use.genres();
  const setGenres = useFilterStore.use.setGenres();
  const { data: genreOptions, status } = useQuery({
    queryKey: ["genres"],
    queryFn: getFilters,
  });
  return (
    <div className="m-5">
      <Select
        isMulti
        name="genres"
        isSearchable={false}
        defaultValue={genres}
        options={genreOptions}
        onChange={(selections) => {
          setGenres([...selections]);
        }}
        styles={{
          control: (baseStyles, _state) => ({
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
          option: (defaultStyles, _state) => ({
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
