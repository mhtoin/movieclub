import { createSelectors } from "@/lib/createSelectors";
import type { MovieWithUser } from "@/types/movie.type";
import { create } from "zustand";

interface DialogState {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	movie: MovieWithUser | null;
	setMovie: (movie: MovieWithUser | null) => void;
	initialRoute: string | null;
	setInitialRoute: (initialRoute: string | null) => void;
}

const useDialogStoreBase = create<DialogState>()((set) => ({
	isOpen: false,
	setIsOpen: (isOpen) => set((_state) => ({ isOpen: isOpen })),
	movie: null,
	setMovie: (movie) => set((_state) => ({ movie: movie })),
	initialRoute: null,
	setInitialRoute: (initialRoute) =>
		set((_state) => ({ initialRoute: initialRoute })),
}));

export const useDialogStore = createSelectors(useDialogStoreBase);
