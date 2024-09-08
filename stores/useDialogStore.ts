import { createSelectors } from "@/lib/createSelectors";
import { create } from "zustand";

interface DialogState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  movie: Movie | null;
  setMovie: (movie: Movie | null) => void;
}

const useDialogStoreBase = create<DialogState>()((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set((state) => ({ isOpen: isOpen })),
  movie: null,
  setMovie: (movie) => set((state) => ({ movie: movie })),
}));

export const useDialogStore = createSelectors(useDialogStoreBase);
