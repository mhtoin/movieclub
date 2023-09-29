import { createSelectors } from '@/lib/createSelectors'
import { create } from 'zustand'

interface FilterState {
    genres: Genre[]
    yearRange: RangeSelection
    ratingRange: RangeSelection
    setRatingRange: (label: string, value: string) => void
    setYearRange: (label: string, value: string) => void
    setGenres: (genres: Genre[]) => void
    addGenre: (genre: Genre) => void
}

const useNotificationStoreBase = create<FilterState>() ((set) => ({
    genres: [],
    yearRange: { min: "1900", max: new Date().getFullYear().toString() },
    ratingRange: { min: "0", max: "10" },
    setRatingRange: (label, value) => set((state) => ({ ratingRange: { ...state.ratingRange, [label]: value } })),
    setYearRange: (label, value) => set((state) => ({ yearRange: { ...state.yearRange, [label]: value } })),
    setGenres: (genres) => set((state) => ({ genres: genres })),
    addGenre: (genre) => set((state) => ({ genres: [...state.genres, genre] }))
}))

export const useFilterStore = createSelectors(useNotificationStoreBase)