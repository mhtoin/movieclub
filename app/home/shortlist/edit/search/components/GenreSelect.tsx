import { useState } from "react";
import Select from "react-select";

interface GenreSelectProps {
  genreOptions: Array<{ label: string; value: number }>;
  handleGenreSelection: (
    genre: number
  ) => void;
  genreSelections: number[];
}
export default function GenreSelect({
  genreOptions,
  handleGenreSelection,
  genreSelections,
}: GenreSelectProps) {
  const [values, setValues] = useState<number[]>(genreSelections);
  return (
    <div className="m-5">
      <Select
        isMulti
        name="genres"
        options={genreOptions}
        onChange={(selections) => {
          console.log('genre values', selections)
          let selected = [...selections]

          if (selected && selected.length > 0) {
            let latest = selected.pop()
            setValues([...values, latest!.value])
            handleGenreSelection(latest!.value);
          }
          
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
