import AsyncStorage from "@react-native-async-storage/async-storage";

const URL = "http://192.168.1.50:3000/config";
export const loadConfig = async () => {
    try {
        const cached = await AsyncStorage.getItem("config");
        if (cached) return JSON.parse(cached);
        try {
            const response = await fetch(URL);
            const data = await response.json();

            await AsyncStorage.setItem('config', JSON.stringify(data));
            return data;
        } catch (error) {
            console.warn(error);
        }
    } catch (error) {
        console.log("error on fetch config.js", error);
    }
}