"use client";
import { useGetWatchProvidersQuery } from "@/lib/hooks";
import { getFilters } from "@/lib/movies/queries";
import type { Provider } from "@/types/tmdb.type";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/Tabs";
import { ArrowUpDown, Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import FilterDrawer from "./FilterDrawer";
import FilterRange from "./FilterRange";
import FilterSelect from "./FilterSelect";
import { ProviderCheckbox } from "./ProviderCheckbox";
import SearchInput from "./SearchInput";
import SortDrawer from "./SortDrawer";
import SortMenu from "./SortMenu";

export default function FilterBar() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const watchProviders =
		searchParams.get("with_watch_providers")?.split("|") || [];
	const { data: providers, status: providersStatus } =
		useGetWatchProvidersQuery();
	const { data: genreOptions } = useQuery({
		queryKey: ["genres"],
		queryFn: getFilters,
	});
	const [tab, setTab] = useState<"discover" | "search">("discover");
	const [tabHeight, setTabHeight] = useState<number>(0);
	const [discoverParams, setDiscoverParams] = useState<string>("");
	const measuredBarRef = useCallback(
		(node: HTMLDivElement) => {
			if (node && tab === "discover") {
				setTabHeight(node.getBoundingClientRect().height);
			}
		},
		[tab],
	);

	const measuredTabRef = useCallback(
		(node: HTMLDivElement) => {
			if (node && tab === "discover") {
				setTabHeight(node.getBoundingClientRect().height);
			}
		},
		[tab],
	);

	const createQueryString = useCallback(
		(name: string, value: string[] | string | number[], isRange = false) => {
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
			}
			if (value === "") {
				params.delete(name);
				return params.toString();
			}
			params.set(name, value);
			return params.toString();
		},
		[searchParams],
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

	return (
		<div className="lg:min-h-[100px] w-full bg-background flex flex-col gap-2 border-b z-40 pb-2 md:px-10">
			<div className="relative flex flex-col gap-4 px-4 w-full lg:items-center lg:justify-center mt-10">
				<Tabs
					defaultValue={tab}
					onValueChange={(value) => {
						const targetTab = value as "discover" | "search";
						setTab(targetTab);

						if (targetTab === "discover") {
							// reset back to the default params
							router.push(`${pathname}?${discoverParams}`, {
								scroll: false,
							});
						}

						if (targetTab === "search") {
							const params = new URLSearchParams(searchParams.toString());
							setDiscoverParams(params.toString());
						}
					}}
				>
					<div
						className="flex flex-row gap-2 items-center justify-center w-full "
						ref={measuredBarRef}
					>
						<div className="flex flex-col items-start relative w-full">
							<div className="flex flex-row gap-2 w-full">
								<TabsList className="rounded-bl-none rounded-br-none border border-b-0 h-auto bg-input border-border/80">
									<TabsTrigger
										value="discover"
										className="data-[state=active]:bg-accent "
									>
										Discover
									</TabsTrigger>
									<TabsTrigger value="search" className="data-[state=active]:bg-accent">
										Search
									</TabsTrigger>
								</TabsList>
								<TabsContent value="discover">
									<div ref={measuredTabRef}>
										<div className="hidden lg:flex items-center gap-4">
											<div className="flex flex-row gap-2 items-center">
												<ArrowUpDown className="w-6 h-6 text-accent/80" />
												<p className="text-sm font-medium text-foreground/80">Sorting</p>
												<SortMenu />
											</div>
											<div className="flex flex-row gap-2 items-center">
												<Filter className="w-6 h-6 text-accent/80" />
												<p className="text-sm font-medium text-foreground/80">Filters</p>
											</div>
											<FilterSelect
												label="Genres"
												options={genreOptions}
												onChange={handleGenreSelect}
											/>
											<FilterRange onChange={handleRangeSelect} />
										</div>
										<div className="flex flex-row gap-2 lg:hidden">
											<FilterDrawer
												genres={genreOptions}
												handleRangeSelect={handleRangeSelect}
											/>
											<SortDrawer />
										</div>
									</div>
								</TabsContent>
								<TabsContent value="search">
									<div style={{ height: `${tabHeight}px` }} />
								</TabsContent>
							</div>
							<SearchInput type={tab} />
						</div>
					</div>
					<TabsContent value="discover">
						<div className="flex flex-row gap-4 py-2 px-1 overflow-x-scroll w-full h-full no-scrollbar overflow-visible">
							{providers && providersStatus === "success"
								? providers?.map((provider: Provider) => {
										return (
											<ProviderCheckbox
												provider={provider}
												key={provider.provider_id}
												handleClick={handleProviderSelect}
												defaultChecked={watchProviders.includes(
													provider.provider_id.toString(),
												)}
											/>
										);
									})
								: Array.from({ length: 7 }).map((_, index) => (
										<div
											key={index}
											className="w-10 h-10 lg:w-12 lg:h-12 bg-card rounded-md animate-pulse"
										/>
									))}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
