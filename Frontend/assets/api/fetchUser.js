import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "./axios.js";
import axios from "axios";

export const getUserById = async (id) => {
    try {
        const token = await AsyncStorage.getItem("Token");
        if (!token) return;
        const api = await axiosInstance();
        const response = await api.get(`/api/data/user/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return [];
        throw error;
    }
}
export const updateuserInfo = async (data) => {
    try {
        const token = await AsyncStorage.getItem("Token");
        if (!token) return;
        const api = await axiosInstance();
        const response = await api.patch(`/api/data/user/updateinfo`, {
            email: data.email,
            phone: data.phone,
            name: data.name,
            userName: data.userName
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
        return [];
        throw error;
    }
}
export const updatePassword = async (passw) => {
    try {
        const token = await AsyncStorage.getItem("Token");
        if (!token) return;
        const api = await axiosInstance();
        const response = await api.patch(`/api/data/user/updatepassword`, {
            password: passw
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject({ message: error.message || "Something went wrong" });
    }
}