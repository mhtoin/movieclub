import { createSelectors } from "@/lib/createSelectors";
import type { RangeSelection } from "@/types/common.type";
import type { Genre } from "@prisma/client";
import { create } from "zustand";

const baseUrl =
	"discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc";

interface FilterState {
	genres: Genre[];
	yearRange: RangeSelection;
	ratingRange: RangeSelection;
	watchProviders: number[];
	defaultSelectAll: boolean;
	searchValue: string;
	setSearchValue: (value: string) => void;
	setDefaultSelectAll: (value: boolean) => void;
	setWatchProviders: (watchProviders: number[]) => void;
	addWatchprovider: (watchProvider: number) => void;
	removeWatchprovider: (watchProvider: number) => void;
	setRatingRange: (label: string, value: string) => void;
	setYearRange: (label: string, value: string) => void;
	setGenres: (genres: Genre[]) => void;
	addGenre: (genre: Genre) => void;
}

const useFilterStoreBase = create<FilterState>()((set) => ({
	genres: [],
	yearRange: { min: "1900", max: new Date().getFullYear().toString() },
	ratingRange: { min: "0", max: "10" },
	//watchProviders: [],
	watchProviders: [8, 119, 323, 337, 384, 1773],
	defaultSelectAll: true,
	searchValue: `${baseUrl}&with_watch_providers=8|119|323|337|384|1773&watch_region=FI`,
	setSearchValue: (value) =>
		set(() => {
			return { searchValue: value };
		}),
	setDefaultSelectAll: (value) => set(() => ({ defaultSelectAll: value })),
	setWatchProviders: (watchProviders) =>
		set(() => ({ watchProviders: watchProviders })),
	addWatchprovider: (watchProvider) =>
		set((state) => ({
			watchProviders: [...state.watchProviders, watchProvider],
		})),
	removeWatchprovider: (watchProvider) =>
		set((state) => ({
			watchProviders: state.watchProviders.filter((wp) => wp !== watchProvider),
		})),
	setRatingRange: (label, value) =>
		set((state) => ({ ratingRange: { ...state.ratingRange, [label]: value } })),
	setYearRange: (label, value) =>
		set((state) => ({ yearRange: { ...state.yearRange, [label]: value } })),
	setGenres: (genres) => set(() => ({ genres: genres })),
	addGenre: (genre) => set((state) => ({ genres: [...state.genres, genre] })),
}));

export const useFilterStore = createSelectors(useFilterStoreBase);
