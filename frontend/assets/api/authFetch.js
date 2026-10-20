import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from 'expo-device';
import { axiosInstance } from "./axios.js";
import axios from "axios";

export const signUpHandaler = async (userData = null) => {
    try {
        const token = await AsyncStorage.getItem("Toke");
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
        if (axios.isAxiosError(error) && error.response) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject({ message: error.message || "Something went wrong" });
    }
}
export const LoginHandaler = async (data = null) => {
    try {
        const api = await axiosInstance();
        const result = await api.post("/api/auth/login", {
            email: data?.email,
            password: data?.password
        });
        return result.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject({ message: error.message || "Something went wrong" });
    }
}