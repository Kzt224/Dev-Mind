import AsyncStorage from "@react-native-async-storage/async-storage";

const URL =
    "https://raw.githubusercontent.com/Kzt224/Dev-Mind/main/config.json";
// const URL = "http://192.168.1.6:3000/config"

export const loadConfig = async () => {
    try {
        const cached = await AsyncStorage.getItem("config");
        if (cached && cached !== null) {
            return JSON.parse(cached);
        }
        //console.log("Fetching config from Github...");
        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error(`Config fetch failed: ${response.status}`);
        }
        const data = await response.json();

        await AsyncStorage.setItem("config", JSON.stringify(data));

        return data;
    } catch (error) {
        console.error("Config error:", error);

        return null;
    }
};