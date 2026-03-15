import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "./axios.js";


export const sendMessage = async (data) => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const message = data.message;
        const title = data.title;
        const projectId = data.projectId;
        console.log(data);
        const response = await api.post("/api/message/chat", {
            message: message,
            title: title,
            projectId: projectId || 0,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const fetchChatHeader = async () => {
    try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.get("/api/message/chat",{
            headers: {
                Authorization: `$Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
       throw error;
    }
}

export const fetchAllChat = async(id) => {
     try {
        const token = await AsyncStorage.getItem('Token');
        const api = await axiosInstance();
        const response = await api.get(`/api/message/chat/${id}`,{
            headers: {
                Authorization: `$Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
       throw error;
    }
}