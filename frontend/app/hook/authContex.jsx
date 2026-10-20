import React, { createContext, useState, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { signUpHandaler } from "@/assets/api/authFetch.js";
import { loadConfig } from "@/assets/api/fetchConfig.js";

import { createChatsTable } from "@/assets/db/chatHeader.model";
import { createMessagesTable } from "@/assets/db/messages.model";
import { createSearchHistoryTable } from "../../assets/db/searchHistory.model";

import { connectSocket, disconnectSocket } from "@/assets/socket/socket.js";

import { useQueryClient } from "@tanstack/react-query";

import { shadowStyles } from "@/assets/themes/style.js";
import { Colors } from "@/assets/mainColor/colors.js";

import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import { usePathname, useRouter } from "expo-router";

import { useAlertStore } from "@/assets/store/aleartStore.js";

import { healthCheck } from "../../assets/api/healthCheck";

import * as SplashScreen from "expo-splash-screen";

import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";

// Keep native splash visible while React starts
SplashScreen.preventAutoHideAsync().catch(() => { });

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [config, setConfig] = useState(null);
  const [cacheProject, setProject] = useState(null);
  const [cacheToken, setToken] = useState(null);
  const [dailyInsight, setDailyInsight] = useState(null);

  const queryClient = useQueryClient();
  const router = useRouter();
  const pathName = usePathname();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  const {
    setSuccess,
    setError,
    setOnlineUser,
  } = useAlertStore();

  // --------------------------------------------------
  // Hide native Expo splash as soon as React is ready
  // --------------------------------------------------

  useEffect(() => {
    const hideNativeSplash = async () => {
      if (fontsLoaded) {
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          console.log("Native splash hide error:", error);
        }
      }
    };

    hideNativeSplash();
  }, [fontsLoaded]);

  // --------------------------------------------------
  // App initialization
  // --------------------------------------------------

  useEffect(() => {
    if (!fontsLoaded) return;

    const initializeApp = async () => {
      try {
        setProgress(10);

        const cfg = await loadConfig();

        if (cfg) {
          setConfig(cfg);
        }

        setProgress(20);
        await healthCheck();
        setProgress(35);

        const initDb = await AsyncStorage.getItem("initDb");

        if (!initDb) {
          await createChatsTable();
          await createMessagesTable();
          await createSearchHistoryTable();
          await AsyncStorage.setItem("initDb", "true");
        }

        setProgress(50);
        const [
          token,
          storedUser,
          storedProject,
          storedTasks,
        ] = await Promise.all([
          AsyncStorage.getItem("Token"),
          AsyncStorage.getItem("User"),
          AsyncStorage.getItem("Projects"),
          AsyncStorage.getItem("Tasks"),
        ]);

        setProgress(70);
        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);

          setUser(parsedUser);
          setToken(token);

          if (storedProject) {
            setProject(JSON.parse(storedProject));
          }

          if (storedTasks && pathName === "/login") {
            router.replace("/");
          }
        } else {

          const res = await signUpHandaler();

          if (res?.jwt && res?.user) {
            await AsyncStorage.setItem("Token", res.jwt);

            await AsyncStorage.setItem(
              "User",
              JSON.stringify(res.user)
            );

            setUser(res.user);
            setToken(res.jwt);

            if (pathName === "/login") {
              router.replace("/");
            }
          } else {
            if (pathName !== "/login") {
              router.replace("/login");
            }
          }
        }

        setProgress(90);
        await new Promise((resolve) =>
          setTimeout(resolve, 150)
        );
        setProgress(100);
      } catch (error) {
        console.error(
          "App Initialization Error:",
          error
        );
        setProgress(100);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [fontsLoaded]);

  useEffect(() => {
    if (!user || !config?.API_URL || !cacheToken) {
      return;
    }

    const socket = connectSocket(
      user.id,
      config.API_URL,
      cacheToken
    );
    socket.on("disconnect", () => {
      setError("You are offline");
    });

    socket.on("online-users", (users) => {
      if (users) {
        setOnlineUser(users);
      }
    });

    socket.on("daily-insight", (data) => {
      if (data) {
        setDailyInsight(data?.message);
      }
    });

    socket.on("notification", (data) => {
      queryClient.setQueryData(
        ["notification"],
        (old = []) => [data, ...old]
      );

      if (data?.type === "ASSIGN" || data?.taskId) {
        queryClient.refetchQueries({
          queryKey: ["project"],
        });
      }
    });

    return () => {
      disconnectSocket();
    };
  }, [
    user,
    config,
    cacheToken,
  ]);

  const setUserData = async (userData, token) => {
    if (token) {
      await AsyncStorage.setItem(
        "Token",
        token
      );
      setToken(token);
    }

    if (userData) {
      await AsyncStorage.setItem(
        "User",
        JSON.stringify(userData)
      );
    }

    setUser(userData);
  };


  const logout = async () => {
    await AsyncStorage.multiRemove([
      "Token",
      "User",
      "Projects",
    ]);

    setUser(null);
    setToken(null);

    router.replace("/login");
  };

  if (!fontsLoaded || loading) {
    return (
      <StartupLoading
        progress={progress}
      />
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUserData,
        logout,
        loading,
        config,
        cacheProject,
        dailyInsight,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// STARTUP LOADING SCREEN
// =====================================================

function StartupLoading({ progress }) {
  return (
    <View style={styles.container}>

      <Image
        source={require("../../assets/images/bgImages/applogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.progressText}>
        {progress}%
      </Text>

    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },

  logo: {
    width: 200,
    height: 200,
    marginBottom: 18,
    borderRadius: 20,
    boxShadow:
      shadowStyles.containerStyle.boxShadow,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 30,
  },

  progressContainer: {
    width: "50%",
    height: 7,
    backgroundColor:
      "rgba(255,255,255,0.25)",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },

  progressText: {
    marginTop: 10,
    fontSize: 12,
    color: "#FFFFFF",
  },
});