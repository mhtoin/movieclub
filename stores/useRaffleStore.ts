import { createSelectors } from '@/lib/createSelectors'
import type { MovieWithUser } from '@/types/movie.type'
import { create } from 'zustand'

interface RaffleState {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  result: MovieWithUser | null
  setResult: (value: MovieWithUser | null) => void
  senderIsCurrentUser: boolean
  setSenderIsCurrentUser: (value: boolean) => void
}

const useRaffleStoreBase = create<RaffleState>()((set) => ({
  isOpen: false,
  setIsOpen: (value) => set(() => ({ isOpen: value })),
  isLoading: false,
  setIsLoading: (value) => set(() => ({ isLoading: value })),
  result: null,
  setResult: (value) => set(() => ({ result: value })),
  senderIsCurrentUser: false,
  setSenderIsCurrentUser: (value) =>
    set(() => ({ senderIsCurrentUser: value })),
}))

export const useRaffleStore = createSelectors(useRaffleStoreBase)
