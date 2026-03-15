import { Stack, usePathname } from "expo-router";
import NavBar from "./components/navbar.jsx";
import DrawerProvider from "./hook/drawercontex.jsx";
import BottomBarHeightProvider from "./hook/barHeighContex.jsx";
import AuthProvider from "./hook/authContex.jsx";
import LanguageProvider from "./hook/languageContex.jsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useReducer, useState } from "react";
import Loading from "./components/card/loading.jsx";
import SuccessModal from "./components/card/successModal.jsx";
import WarningModal from "./components/card/warningModal.jsx";
import Bar from "./components/bar.jsx";
import PopupInput from "./components/Form/PoputInput.jsx";
import { setGlobalTheme } from "@/assets/themes/theme.js";
import { Appearance, View } from "react-native";
import NavBarHeightProvider from "./hook/navHeighContex.jsx";
import { Colors } from "@/assets/mainColor/colors.js";

export default function RootLayout() {
  const queryClient = new QueryClient();
  const pathname = usePathname();

  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useReducer(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setGlobalTheme(colorScheme);
      setTheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const hideBottomBarRoute = [
    "/chat",
    "/components/notification",
    "/components/scanner"
  ];
  const showBottomBar = !hideBottomBarRoute.includes(pathname);
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <NavBarHeightProvider>
            <BottomBarHeightProvider>
              <DrawerProvider>
                <View style={{flex:1,backgroundColor: Colors.bgPrimary}}>
                  <Stack key={theme}>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="projectDetail" options={{
                      header: () => <NavBar name={"project Detail"} />
                    }} />
                    <Stack.Screen name="task" options={{
                      header: () => <NavBar name={"all tasks"} />
                    }} />
                    <Stack.Screen name="chat" options={{
                      header: () => <NavBar name={"chat"} />
                    }} />
                    <Stack.Screen name="taskDetail" options={{
                      header: () => <NavBar name={"goal detail"} />
                    }} />
                    <Stack.Screen name="components/notification" options={{
                      header: () => <NavBar name={'notification'} />
                    }} />
                    <Stack.Screen name="components/account" options={{
                      header: () => <NavBar name={'profile'} />
                    }} />
                    <Stack.Screen name="team" options={{
                      header: () => <NavBar name={'team'} />
                    }} />
                    <Stack.Screen name="teamDetail" options={{
                      header: () => <NavBar name={"group detail"} />
                    }} />
                    <Stack.Screen name="components/scanner" options={{
                      headerShown: false
                    }} />
                    <Stack.Screen name="components/setting/accountDetail" options={{
                      header: () => <NavBar name={"account detail"} />
                    }} />
                  </Stack>
                </View>
                {/* modal input */}
                <PopupInput />
              </DrawerProvider>
              {showBottomBar && (<Bar page={pathname ? pathname : "/"} />)}
              <SuccessModal />
              <WarningModal />
            </BottomBarHeightProvider>
          </NavBarHeightProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>

  );
}
