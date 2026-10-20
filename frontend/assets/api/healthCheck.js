import AsyncStorage from "@react-native-async-storage/async-storage";

export const healthCheck = async () => {
    try {
        const cached = await AsyncStorage.getItem("config");

        if (!cached) {
            return {
                code: "CONFIG_MISSING",
                message: "Config is missing",
            };
        }

        const config = JSON.parse(cached);

        if (!config.API_URL) {
            return {
                code: "API_URL_MISSING",
                message: "API_URL is missing",
            };
        }

        const url = config.API_URL.trim();

        const response = await fetch(url);

        const text = await response.text();

        if (!response.ok) {
            return {
                code: response.status,
                message: text || response.statusText,
            };
        }

        return {
            code: response.status,
            message: "API is healthy",
        };

    } catch (error) {
        console.error("Health check failed:", error);

        await AsyncStorage.removeItem("config");

        return {
            code: "NETWORK_ERROR",
            message: error?.message || "Network request failed",
        };
    }
};