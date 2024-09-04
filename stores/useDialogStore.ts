import { createSelectors } from "@/lib/createSelectors";
import { create } from "zustand";

interface DialogState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const useDialogStoreBase = create<DialogState>()((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set((state) => ({ isOpen: isOpen })),
}));

export const useDialogStore = createSelectors(useDialogStoreBase);
