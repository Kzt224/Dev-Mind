import { Stack, usePathname } from "expo-router";
import { View, Appearance } from "react-native";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import NavBar from "./components/navbar.jsx";
import TopBar from "./components/topBar.jsx";
import Bar from "./components/bar.jsx";
import PopupInput from "./components/Form/PoputInput.jsx";

import DrawerProvider from "./hook/drawercontex.jsx";
import BottomBarHeightProvider from "./hook/barHeighContex.jsx";
import NavBarHeightProvider from "./hook/navHeighContex.jsx";
import AuthProvider from "./hook/authContex.jsx";
import LanguageProvider from "./hook/languageContex.jsx";

import SuccessModal from "./components/card/successModal.jsx";
import WarningModal from "./components/card/warningModal.jsx";

import { setGlobalTheme } from "@/assets/themes/theme.js";
import { Colors } from "@/assets/mainColor/colors.js";
import SearchForm from "./components/Form/SearchForm.jsx";

export default function RootLayout() {
  const pathname = usePathname();

  const [queryClient] = useState(() => new QueryClient());

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setGlobalTheme(colorScheme);
      setTheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  // routes that hide bottom bar
  const hideBottomBarRoute = [
    "/chat",
    "/components/notification",
    "/components/scanner",
    "/login",
  ];

  const showBottomBar = !hideBottomBarRoute.some((route) =>
    pathname?.startsWith(route)
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <NavBarHeightProvider>
            <BottomBarHeightProvider>
              <DrawerProvider>
                <View style={{ flex: 1, backgroundColor: Colors.bgPrimary }}>
                  <Stack key={theme}>
                    <Stack.Screen
                      name="index"
                      options={{ header: () => <TopBar icon={true} greet={false} search={true} bell={true} name='' /> }}
                    />
                    <Stack.Screen
                      name="projectDetail"
                      options={{ header: () => <TopBar icon={false} greet={true} search={true} bell={true} name="" /> }}
                    />
                    <Stack.Screen
                      name="task"
                      options={{ header: () => <TopBar icon={false} greet={true} search={true} bell={true} name="" /> }}
                    />
                    <Stack.Screen
                      name="project"
                      options={{ header: () => <TopBar icon={false} greet={true} search={true} bell={true} name="" /> }}
                    />
                    <Stack.Screen
                      name="chat"
                      options={{ header: () => <TopBar icon={false} greet={false} search={false} bell={false} name="Chat" /> }}
                    />

                    <Stack.Screen
                      name="taskDetail"
                      options={{ header: () => <TopBar icon={false} greet={false} search={false} bell={false} name="Task Detail" /> }}
                    />

                    <Stack.Screen
                      name="components/notification"
                      options={{ header: () => <TopBar icon={false} greet={false} search={false} bell={false} name="Notification" /> }}

                    />

                    <Stack.Screen
                      name="components/account"
                      options={{ header: () => <TopBar icon={false} greet={false} search={false} bell={false} name="Profile" /> }}

                    />

                    <Stack.Screen
                      name="team"
                      options={{ header: () => <TopBar icon={false} greet={false} search={false} bell={false} name="Team" /> }}
                    />

                    <Stack.Screen
                      name="teamDetail"
                      options={{ header: () => <TopBar icon={false} greet={false} search={false} bell={false} name="Group Detail" /> }}
                    />

                    <Stack.Screen
                      name="login"
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="components/scanner"
                      options={{ headerShown: false }}
                    />

                    <Stack.Screen
                      name="components/setting/accountDetail"
                      options={{ header: () => <TopBar icon={false} greet={false} search={false} bell={false} name="Account Detail" /> }}

                    />

                    <Stack.Screen
                      name="components/setting/language"
                      options={{ header: () => <TopBar icon={false} greet={false} search={false} bell={false} name="Language" /> }}
                    />
                    <Stack.Screen
                      name="components/projectSubDetail"
                      options={{ header: () => <TopBar icon={false} greet={false} search={false} bell={false} name="Project Summary" /> }}
                    />
                  </Stack>

                </View>

                {/* overlays */}
                <PopupInput />
                <SuccessModal />
                <WarningModal />
                <SearchForm />
              </DrawerProvider>

              {/* bottom bar */}
              {showBottomBar && <Bar page={pathname || "/"} />}

            </BottomBarHeightProvider>
          </NavBarHeightProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}