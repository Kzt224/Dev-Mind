import { create } from "zustand";


export const useAlertStore = create((set) => ({
    error: '',
    success: '',
    showSuccess: false,
    showError: false,
    setSuccess: (val) => {set({success: val,showSuccess: true})},
    setError: (val) => set({error: val,showError: true}),
    setClose: () => set({error: '',success: '',showSuccess: false,showError: false})
}));