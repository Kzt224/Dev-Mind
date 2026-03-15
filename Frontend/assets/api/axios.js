import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const axiosInstance = async () => {
  try {
    const config = await AsyncStorage.getItem("config");
    if (!config) {
      console.warn(" No config found in AsyncStorage — did you call loadConfig()?");
      return axios.create({
        baseURL: "", 
        withCredentials: true,
      });
    }

    const parsed = JSON.parse(config);
    const DEV_MIND_API = parsed?.API_URL;

    if (!DEV_MIND_API) {
      console.warn(" API_URL missing in config");
    }
    return axios.create({
      baseURL: DEV_MIND_API,
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error creating axios instance:", error);
    return axios.create({
      baseURL: "",
      withCredentials: true,
    });
  }
};
