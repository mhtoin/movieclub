import { createSelectors } from "@/lib/createSelectors";
import { create } from "zustand";

interface RaffleState {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
    result: MovieOfTheWeek | null;
    setResult: (value: MovieOfTheWeek | null) => void;
    senderIsCurrentUser: boolean;
    setSenderIsCurrentUser: (value: boolean) => void;
}

const useRaffleStoreBase = create<RaffleState>()((set, get) => ({
    isOpen: false,
    setIsOpen: (value) => set((state) => ({ isOpen: value })),
    isLoading: false,
    setIsLoading: (value) => set((state) => ({ isLoading: value })),
    result: null,
    setResult: (value) => set((state) => ({ result: value })),
    senderIsCurrentUser: false,
    setSenderIsCurrentUser: (value) => set((state) => ({ senderIsCurrentUser: value })),
}));

export const useRaffleStore = createSelectors(useRaffleStoreBase);