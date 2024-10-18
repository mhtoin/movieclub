"use client";
import { useGetWatchProvidersQuery } from "@/lib/hooks";
import { useFilterStore } from "@/stores/useFilterStore";
import { useState } from "react";
import FiltersModal from "./FiltersModal";
import ProviderButton from "./ProviderButton";
import { Button } from "@/app/components/ui/Button";

export default function Filters() {
  const [titleSearch, setTitleSearch] = useState("");
  const setSearchValue = useFilterStore.use.setSearchValue();
  const genreSelections = useFilterStore.use.genres();
  const yearRange = useFilterStore.use.yearRange();
  const ratingRange = useFilterStore.use.ratingRange();
  const watchProviders = useFilterStore.use.watchProviders();

  const searchBaseUrl = `search/movie?query`;
  const baseUrl = `discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&watch_region=FI`;

  const { data: providers, status: providersStatus } =
    useGetWatchProvidersQuery();

  const handleSearchByTitle = () => {
    setSearchValue(
      `${searchBaseUrl}=${titleSearch}&append_to_response=watch/providers`
    );
  };

  const handleSearchSubmit = () => {
    //const baseUrl = `include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc${onlyNetflix && '&watch_region=FI&with_watch_providers=8'}`;
    var queryStringArr = [];
    if (genreSelections.length > 0) {
      queryStringArr.push(
        `with_genres=${genreSelections
          .map((genre: Genre) => genre.value)
          .join("|")}`
      );
    }

    if (yearRange.min) {
      queryStringArr.push(`release_date.gte=${yearRange.min}`);
    }

    if (yearRange.max) {
      queryStringArr.push(`release_date.lte=${yearRange.max}`);
    }

    if (ratingRange.min) {
      queryStringArr.push(`vote_average.gte=${ratingRange.min}`);
    }

    if (ratingRange.max) {
      queryStringArr.push(`vote_average.lte=${ratingRange.max}`);
    }

    if (watchProviders.length > 0) {
      queryStringArr.push(`with_watch_providers=${watchProviders.join("|")}`);
    }

    const queryString = queryStringArr.join("&");
    setSearchValue(baseUrl + "&" + queryString);
  };

  return (
    <div className="flex flex-col justify-center gap-5 sticky top-0 z-40 bg-background p-2 sm:w-full">
      <div className="flex flex-row gap-5 items-center justify-center mx-5">
        <input
          type="text"
          placeholder="Search by title"
          className="input input-bordered p-5 input-sm 2xl:input-md bg-accent"
          value={titleSearch}
          onChange={(event) => setTitleSearch(event.target.value)}
        />
        <Button onClick={handleSearchByTitle}>Search</Button>
      </div>
      <div className="flex flex-row gap-5 items-center justify-center mx-5">
        <FiltersModal handleSearchSubmit={handleSearchSubmit} />
        <Button onClick={() => setSearchValue("")}>Reset</Button>
      </div>
      <div className="flex flex-row gap-5 m-auto justify-center">
        {providers?.map((provider: any) => {
          return (
            <ProviderButton
              key={provider.provider_id}
              provider={provider}
              isToggled={watchProviders.includes(provider.provider_id)}
              submit={handleSearchSubmit}
            />
          );
        })}
      </div>
    </div>
  );
}
