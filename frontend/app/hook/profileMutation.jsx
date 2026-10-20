import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfile } from "../../assets/api/fetchUser";
import { useAlertStore } from "../../assets/store/aleartStore";

export default function useProfileMutation() {
    const { setSuccess, setError } = useAlertStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (imageUrl) => uploadProfile(imageUrl),

        onSuccess: (data) => {
            setSuccess(data?.message || "Profile uploaded successfully!");
            queryClient.invalidateQueries({ queryKey: ["userInfo"] });
        },

        onError: (error) => {
            setError(error?.message || "Failed to upload profile.");
        },
    });
};