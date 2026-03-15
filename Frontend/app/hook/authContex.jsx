import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signUpHandaler } from "@/assets/api/authFetch.js";
import { loadConfig } from "@/assets/api/fetchConfig.js";
import { createChatsTable } from "@/assets/db/chatHeader.model";
import { createMessagesTable } from "@/assets/db/messages.model";
import { connectSocket, disconnectSocket, getSocket } from "@/assets/socket/socket.js";
import { useQueryClient } from "@tanstack/react-query";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import Loading from "../components/card/loading";
import Error from "../components/card/error";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  const [cacheProject, setProject] = useState(null);
  const queryClient = useQueryClient();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });
  const [connected, setConnected] = useState(true);
  useEffect(() => {
    const prepareApp = async () => {
      try {
        const cfg = await loadConfig();
        if (cfg) setConfig(cfg);

        const [token, storedUser, storedProject] = await Promise.all([
          AsyncStorage.getItem("Token"),
          AsyncStorage.getItem("User"),
          AsyncStorage.getItem("Projects"),
        ]);

        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
          if (storedProject) setProject(JSON.parse(storedProject));
        } else {
          const res = await signUpHandaler();
          if (res?.jwt) {
            await AsyncStorage.setItem("Token", res.jwt);
            await AsyncStorage.setItem("User", JSON.stringify(res.user));
            setUser(res.user);
          }
        }

        const isAlreadyInit = await AsyncStorage.getItem("initDb");
        if (!isAlreadyInit) {
          console.log("Initializing SQLite DB...");
          await createChatsTable();
          await createMessagesTable();
          await AsyncStorage.setItem("initDb", "true");
        }
      } catch (error) {
        console.log("App Init Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    prepareApp();
  }, []);

  useEffect(() => {
    if (!user) return;

    const initSocket = async () => {
      try {
        const DEV_MIND_API = config?.API_URL || JSON.parse(await AsyncStorage.getItem("config"))?.API_URL;
        const socket = connectSocket(user.id, DEV_MIND_API);

        socket.on("connect", () => {
          setTimeout(() => {
            setConnected(true);
          },10000)
        });
        socket.on("disconnect", () => {
          setTimeout(() => {
            setConnected(false);
          }, 10000)
        })
        socket.on("notification", (data) => {
          queryClient.setQueryData(["notification"], (old = []) => [data, ...old]);
          if (data?.type === 'ASSIGN' || data?.taskId) {
            queryClient.refetchQueries(['project']);
          }
        });
      } catch (error) {
        console.log("Socket Init Error:", error);
      }
    };

    initSocket();

    return () => {
      disconnectSocket(); 
    };
  }, [user, config]);


  if (loading || !fontsLoaded) {
    return (
      <Loading />
    );
  }
  if (!connected) {
    return (
      <Error message={"No internet connection"} fn={()=>setLoading(true)} />
    );
  }
  const setUserData = async (userData, token) => {
    if (token) await AsyncStorage.setItem("Token", token);
    if (userData) await AsyncStorage.setItem("User", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["Token", "User", "Projects"]);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUserData,
        logout,
        loading,
        config,
        cacheProject,
      }}
    >
      {user ? children : <Loading />}
    </AuthContext.Provider>
  );
}
