import { useState } from "react";
import Select from "react-select";

export default function GenreSelect({ genreOptions, handleGenreSelection, genreSelections }) {
  const [values, setValues] = useState(genreSelections)
  return (
    <div className="m-5">
    <Select
      isMulti
      name="genres"
      options={genreOptions}
      onChange={(values) => {
        setValues(values)
        handleGenreSelection(values)
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
