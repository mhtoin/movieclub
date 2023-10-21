import { createSelectors } from "@/lib/createSelectors";
import { create } from "zustand";

interface RaffleState {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
}

const useRaffleStoreBase = create<RaffleState>()((set, get) => ({
    isOpen: false,
    setIsOpen: (value) => set((state) => ({ isOpen: value })),
    isLoading: false,
    setIsLoading: (value) => set((state) => ({ isLoading: value })),
}));

export const useRaffleStore = createSelectors(useRaffleStoreBase);