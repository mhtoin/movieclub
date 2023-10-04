import { createSelectors } from "@/lib/createSelectors";
import { create } from "zustand";

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

const useNotificationStoreBase = create<FilterState>()((set, get) => ({
  genres: [],
  yearRange: { min: "1900", max: new Date().getFullYear().toString() },
  ratingRange: { min: "0", max: "10" },
  //watchProviders: [],
  watchProviders: [8, 9, 323, 337, 384, 1773],
  defaultSelectAll: true,
  searchValue: `discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_watch_providers=`,
  setSearchValue: (value) => set((state) => ({ searchValue: value })),
  setDefaultSelectAll: (value) => set((state) => ({ defaultSelectAll: value })),
  setWatchProviders: (watchProviders) =>
    set((state) => ({ watchProviders: watchProviders })),
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
  setGenres: (genres) => set((state) => ({ genres: genres })),
  addGenre: (genre) => set((state) => ({ genres: [...state.genres, genre] })),
}));

export const useFilterStore = createSelectors(useNotificationStoreBase);
