import { getUploadSignature } from "../api/fetchUser";

export const imageUploader = async (imageUri) => {
    try {
        const {
            signature,
            timestamp,
            apiKey,
            cloudName,
            folder,
        } = await getUploadSignature();
        const formData = new FormData();

        formData.append("file", {
            uri: imageUri,
            type: "image/jpeg",
            name: "profile.jpg",
        });
        console.log("CLIENT UPLOAD:", {
            cloudName,
            apiKey,
            folder,
            timestamp,
            signature,
        });
        // Parameters must match backend's paramToSign
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("folder", folder);
        formData.append("signature", signature);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || "Upload failed");
        }
        return data?.secure_url;
    } catch (error) {
        console.error("Upload error:", error);
    }
};