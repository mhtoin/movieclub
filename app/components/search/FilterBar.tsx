import { useGetWatchProvidersQuery } from "@/lib/hooks";
import { Input } from "../ui/Input";
import ProviderButton from "./ProviderButton";
import { useFilterStore } from "@/stores/useFilterStore";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/Button";
import { getFilters } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import FilterSelect from "./FilterSelect";
import Popover from "../ui/PopoverBox";
import RangeSlider from "../ui/RangeSlider";
import FilterRange from "./FilterRange";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ProviderCheckbox } from "./ProviderCheckbox";

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

  console.log(watchProviders, providers);

  const createQueryString = useCallback(
    (
      name: string,
      value: string[] | string | number[],
      isRange: boolean = false
    ) => {
      const params = new URLSearchParams(searchParams.toString());

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

  const handleGenreSelect = (value: string) => {
    console.log("value", value);
    const query = createQueryString("with_genres", value);
    console.log("query", query);
    router.push(`${pathname}?${query}`, {
      scroll: false,
    });
  };

  const handleRangeSelect = (value: number[]) => {
    console.log("value", value);
    const query = createQueryString("vote_average", value, true);

    router.push(`${pathname}?${query}`, {
      scroll: false,
    });
  };

  const handleProviderSelect = (value: string) => {
    console.log("value", value);
    const params = new URLSearchParams(searchParams.toString());
    console.log("params", params);
    const providers = params.get("with_watch_providers")?.split("|") || [];
    console.log("providers", providers);

    if (providers.includes(value)) {
      console.log("removing provider");
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
      console.log("adding", newProviders);
      params.set("with_watch_providers", newProviders.join("|"));
      console.log("query", params.toString());
      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }
  };

  return (
    <div className="min-h-[100px] w-full bg-card flex flex-col justify-center items-center p-5 gap-2 sticky top-0 z-50">
      <div className="flex gap-5">
        <Input type="text" placeholder="Search for a movie" />
        <Button variant={"outline"}>
          <MagnifyingGlassIcon />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <FilterSelect
          label="Genres"
          options={genreOptions}
          onChange={handleGenreSelect}
        />
        <FilterRange onChange={handleRangeSelect} />
      </div>
      <div className="flex flex-row gap-5 m-auto justify-center">
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
    </div>
  );
}
