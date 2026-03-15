import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from 'expo-device';
import { axiosInstance } from "./axios.js";

export const signUpHandaler = async (userData = null) => {
    try {
        const token = await AsyncStorage.getItem("Toke");
        console.log(token);
        if (token) return token;

        let data = userData;
        if (!userData) {
            const deviceId = Device.osBuildId || Math.floor(Math.random() * 999999);
            const random = Math.floor(Math.random() * 10000);
            const prefix = "guest";
            data = {
                name: `${prefix}-${deviceId}`,
                email: `${prefix}-${deviceId}-${random}@guest.local`,
                password: `${prefix}-${random}-pass`,
            };
        }
        const api = await axiosInstance();
        const result = await api.post("/api/auth/signup", data);
        return result.data;
    } catch (error) {
        console.log("error on fetch auth.js", error);
    }
}

