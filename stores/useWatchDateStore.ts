import { createSelectors } from '@/lib/createSelectors'
import { create } from 'zustand'

interface WatchDateState {
  day: string
  setDay: (day: string) => void
  month: string
  setMonth: (month: string) => void
}

const useWatchDateStoreBase = create<WatchDateState>()((set) => ({
  day: '',
  setDay: (day: string) => set(() => ({ day: day })),
  month: '',
  setMonth: (month: string) => set((_state) => ({ month: month })),
}))

export const useWatchDateStore = createSelectors(useWatchDateStoreBase)
