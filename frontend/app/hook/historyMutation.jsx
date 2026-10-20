import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlertStore } from "../../assets/store/aleartStore";
import { createHistory } from "../../assets/db/searchHistory.model";

export default function useHistoryMutation() {
    const { setError } = useAlertStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => createHistory(data),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["history"] });
        },

        onError: (error) => {
            setError(error?.message || "Failed to crerate search history.");
        },
    });
};