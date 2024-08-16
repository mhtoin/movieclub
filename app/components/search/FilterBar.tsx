"use client";
import { useGetWatchProvidersQuery } from "@/lib/hooks";
import { getFilters } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import FilterSelect from "./FilterSelect";
import FilterRange from "./FilterRange";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ProviderCheckbox } from "./ProviderCheckbox";
import SearchInput from "./SearchInput";
import FilterDrawer from "./FilterDrawer";
import { ArrowUpDown, Filter } from "lucide-react";
import SortMenu from "./SortMenu";
import SortDrawer from "./SortDrawer";

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const watchProviders =
    searchParams.get("with_watch_providers")?.split("|") || [];
  const { data: providers, status: providersStatus } =
    useGetWatchProvidersQuery();
  const { data: genreOptions, status } = useQuery({
    queryKey: ["genres"],
    queryFn: getFilters,
  });

  const createQueryString = useCallback(
    (
      name: string,
      value: string[] | string | number[],
      isRange: boolean = false
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("query");
      if (isRange) {
        const min = `${name}.gte`;
        const max = `${name}.lte`;
        params.set(min, value[0].toString());
        params.set(max, value[1].toString());
        return params.toString();
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          params.delete(name);
          return params.toString();
        }
        params.set(name, value.join(","));
        return params.toString();
      } else {
        if (value === "") {
          params.delete(name);
          return params.toString();
        }
        params.set(name, value);
        return params.toString();
      }
    },
    [searchParams]
  );

  const handleGenreSelect = (value: string[]) => {
    const query = createQueryString("with_genres", value);
    router.push(`${pathname}?${query}`, {
      scroll: false,
    });
  };

  const handleRangeSelect = (value: number[]) => {
    const query = createQueryString("vote_average", value, true);
    router.push(`${pathname}?${query}`, {
      scroll: false,
    });
  };

  const handleProviderSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    const providers = params.get("with_watch_providers")?.split("|") || [];

    if (providers.includes(value)) {
      const newProviders = providers.filter((provider) => provider !== value);

      if (newProviders.length === 0) {
        params.delete("with_watch_providers");
        router.push(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
        return;
      }

      params.set("with_watch_providers", newProviders.join("|"));
      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    } else {
      const newProviders = [...providers, value];
      params.set("with_watch_providers", newProviders.join("|"));
      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }
  };

  const handleSearch = (event: HTMLInputElement) => {
    console.log(event);
  };

  return (
    <div className="min-h-[100px] w-full bg-background flex flex-col justify-center items-center gap-2 border-b sticky top-0 z-40 pb-2">
      <div className="relative flex flex-col gap-4 px-4 lg:w-1/2 w-full lg:items-center lg:justify-center mt-10">
        <div className="flex flex-row gap-2 items-center justify-center">
          <div className="flex flex-row gap-2 lg:hidden">
            <FilterDrawer
              genres={genreOptions}
              handleRangeSelect={handleRangeSelect}
            />
            <SortDrawer />
          </div>
          <SearchInput />
        </div>
        <div className="flex flex-row gap-5 justify-center overflow-x-scroll w-full h-full p-2 no-scrollbar">
          {providers?.map((provider: any) => {
            return (
              <ProviderCheckbox
                provider={provider}
                key={provider.provider_id}
                handleClick={handleProviderSelect}
                defaultChecked={watchProviders.includes(
                  provider.provider_id.toString()
                )}
              />
            );
          })}
        </div>
        <div className="hidden lg:flex items-center gap-4 pb-2">
          <div className="flex flex-row gap-2 items-center">
            <ArrowUpDown className="w-6 h-6 text-accent" />
            <p className="text-sm font-medium text-accent">Sorting</p>
            <SortMenu />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Filter className="w-6 h-6 text-accent" />
            <p className="text-sm font-medium text-accent">Filters</p>
          </div>
          <FilterSelect
            label="Genres"
            options={genreOptions}
            onChange={handleGenreSelect}
          />
          <FilterRange onChange={handleRangeSelect} />
        </div>
      </div>
    </div>
  );
}