import { create } from "zustand";


export const useSearchStore = create((set, get) => ({
    isVisible: false,
    searchQuery: '',
    setQuery: (val) => set({ searchQuery: val }),
    openModal: () => {
        set({
            isVisible: true,
        })
    },
    closeModal: () => {
        set({
            isVisible: false,
        })
    },
}))