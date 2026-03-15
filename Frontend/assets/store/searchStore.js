import { create } from "zustand";


export const useSearchStore = create((set,get) => ({
    searchQuery: '',
    setQuery: (val) => set({searchQuery: val})
}))