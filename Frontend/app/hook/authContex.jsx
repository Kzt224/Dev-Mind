import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signUpHandaler } from "@/assets/api/authFetch.js";
import { loadConfig } from "@/assets/api/fetchConfig.js";
import { createChatsTable } from "@/assets/db/chatHeader.model";
import { createMessagesTable } from "@/assets/db/messages.model";
import { connectSocket, disconnectSocket } from "@/assets/socket/socket.js";
import { useQueryClient } from "@tanstack/react-query";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import Loading from "../components/card/loading";
import Error from "../components/card/error";
import { usePathname, useRouter } from "expo-router";
import { useAlertStore } from "@/assets/store/aleartStore.js";
import { createSearchHistoryTable } from "../../assets/db/searchHistory.model";
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  const [cacheProject, setProject] = useState(null);
  const [connected, setConnected] = useState(true);
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathName = usePathname();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  const { setSuccess, setError, setOnlineUser } = useAlertStore();
  const [cacheToken, setToken] = useState(null);
  const [dailyInsight, setDailyInsight] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const cfg = await loadConfig();
        if (cfg) setConfig(cfg);

        const initDb = await AsyncStorage.getItem("initDb");
        if (!initDb) {
          await createChatsTable();
          await createMessagesTable();
          await createSearchHistoryTable();
          await AsyncStorage.setItem("initDb", "true");
        }

        const [token, storedUser, storedProject, storeTasks] = await Promise.all([
          AsyncStorage.getItem("Token"),
          AsyncStorage.getItem("User"),
          AsyncStorage.getItem("Projects"),
          AsyncStorage.getItem("Tasks")
        ]);

        if (token && storedUser) {
          // User exists → continue normally
          setUser(JSON.parse(storedUser));
          setToken(token);
          if (storedProject) setProject(JSON.parse(storedProject));
          if (storeTasks)
            if (pathName === "/login") router.replace("/"); // redirect if on login page
        } else if (!token && !storedUser && !initDb) {
          const res = await signUpHandaler();
          if (res?.jwt && res?.user) {
            await AsyncStorage.setItem("Token", res.jwt);
            await AsyncStorage.setItem("User", JSON.stringify(res.user));
            setUser(res.user);
            if (pathName === "/login") router.replace("/"); // redirect to home
          }
        } else {
          // No user/token (after logout) → redirect to login
          if (pathName !== "/login") router.replace("/login");
        }

      } catch (error) {
        console.error("App Initialization Error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);


  useEffect(() => {
    if (!user || !config?.API_URL) return;

    const socket = connectSocket(user.id, config.API_URL, cacheToken);
    socket.on("connect", () => setSuccess("You are online"));
    socket.on("disconnect", () => setError("You are offline"));
    socket.on("online-users", (users) => {
      if (users) setOnlineUser(users);
    })
    socket.on("daily-insight", (data) => {
      if (data) setDailyInsight(data?.message);
    });
    socket.on("notification", (data) => {
      queryClient.setQueryData(["notification"], (old = []) => [data, ...old]);
      if (data?.type === "ASSIGN" || data?.taskId) {
        queryClient.refetchQueries(["project"]);
      }
    });
    return () => disconnectSocket();
  }, [user, config]);


  const setUserData = async (userData, token) => {
    if (token) await AsyncStorage.setItem("Token", token);
    if (userData) await AsyncStorage.setItem("User", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["Token", "User", "Projects"]);
    setUser(null);
    router.replace("/login");
  };

  if (!fontsLoaded || loading) return <Loading />;

  // if (user && !connected) {
  //   //return <Error message="No internet connection" />;
  //   setErrorf
  // }
  return (
    <AuthContext.Provider
      value={{ user, setUserData, logout, loading, config, cacheProject, dailyInsight }}
    >
      {children}
    </AuthContext.Provider>
  );
}