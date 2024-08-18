import FilterBar from "@/app/components/search/FilterBar";
import Results from "@/app/components/search/Results";
import Search from "@/app/components/search/Search";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <div className="flex flex-col justify-center items-center gap-2 rounded-lg relative">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="sticky z-40 top-0 pt-20 w-full bg-background pb-2">
          <FilterBar />
        </div>
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Results />
      </Suspense>
    </div>
  );
}
