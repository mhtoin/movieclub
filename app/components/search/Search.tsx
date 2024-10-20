import { Suspense } from "react";
import FilterBar from "./FilterBar";
import Results from "./Results";

export default function Search() {
  return (
    <div className="flex flex-col justify-center items-center gap-2 rounded-lg relative">
      <Suspense fallback={<div>Loading...</div>}>
        <FilterBar />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Results />
      </Suspense>
    </div>
  );
}
