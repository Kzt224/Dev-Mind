import { Text, View, TextInput, StyleSheet, Pressable, Image, Animated, Dimensions, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather.js";
import { Colors } from "../../assets/mainColor/colors";
import { shadowStyles } from "@/assets/themes/style";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotification } from "@/assets/api/fetchData";
import Loading from "./card/loading";
import Error from "./card/error";
import SearchForm from "./searchForm";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { calculateNotiLength } from "@/assets/helper/calculateNotiLength.js"
import appImage from "../../assets/images/bgImages/applogo.png";
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { IBMPlexSans_700Bold } from "@expo-google-fonts/ibm-plex-sans";
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from "expo-router";
import { AuthContext } from "../hook/authContex";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useDrawer } from "../hook/drawercontex";
import { useSearchStore } from "@/assets/store/searchStore";
import { useNavBarHeight } from "../hook/navHeighContex";
import { getUserById } from "@/assets/api/fetchUser.js";

export default function TopBar({ icon, search, greet, bell, name }) {
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { openDrawer } = useDrawer();
    const { openModal, closeModal } = useSearchStore();
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        IBMPlexSans_700Bold
    });

    const { data: noti, isLoading, isError } = useQuery({
        queryKey: ['notification', 'userInfo'],
        queryFn: () => getNotification(),
    });
    const { data: account } = useQuery({
        queryKey: ['userInfo', user?.id],
        queryFn: () => getUserById(user?.id),
        enabled: !!user?.id
    })
    const { setNavBarHeight } = useNavBarHeight();

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: showSearch ? 200 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [showSearch]);
    if (isLoading) {
        return (
            <Loading />
        );
    }
    if (isError) {
        return (
            <Error />
        );
    }
    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color={Colors.primary} />;
    }
    const handleDrawer = () => openDrawer();
    const unReadCount = noti?.filter(not => !not.read).length || 0;
    return (
        <SafeAreaView style={{ backgroundColor: Colors.bgPrimary }}
            onLayout={(e) => setNavBarHeight(e.nativeEvent.layout.height)}
        >
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 8
            }}>
                <View style={{ display: "flex", justifyContent: "center", padding: 10, }}>
                    {icon && (
                        <Image source={appImage} style={{ width: 55, height: 55, borderRadius: 15, borderWidth: 2, borderColor: Colors.primary }} />
                    )}
                    {greet && (
                        <View>
                            <Text style={{
                                color: Colors.textPrimary,
                                fontFamily: "Inter_400Regular",
                                fontSize: 20,
                            }}>Good Morning,</Text>
                            <Text style={{
                                color: Colors.primary,
                                fontFamily: "Inter_700Bold",
                                fontSize: 20,
                            }}> {(account?.user?.name).slice(0, 16)}!</Text>
                        </View>
                    )}
                    {(!icon && !greet) && (
                        <Pressable onPress={() => router.back()}>
                            <Octicons name="arrow-left" size={35} color={Colors.textPrimary} />
                        </Pressable>
                    )}
                </View>
                <View style={{ alignContent: "center", padding: 10, marginRight: 50 }}>
                    {(name && name !== '') && (
                        <Text style={{
                            color: Colors.textPrimary,
                            fontFamily: "Inter_700Bold",
                            fontSize: 22,
                        }}>{name}</Text>
                    )}
                </View>
                <View style={styles.iconBox}>
                    {search && (
                        <Pressable onPress={() => openModal()}>
                            <Ionicons name="search" size={35} color={Colors.textPrimary} />
                        </Pressable>
                    )}
                    {bell && (
                        <Pressable onPress={() => router.push("/components/notification")}>
                            <FontAwesome5 name="bell" size={30} color={Colors.textPrimary} />
                            {unReadCount > 0 && (
                                <View style={{
                                    position: "absolute",
                                    fontWeight: "bold",
                                    top: -1,
                                    left: 14,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 12,
                                    height: 12,
                                    borderRadius: 50,
                                    backgroundColor: Colors.danger
                                }}>
                                </View>
                            )}
                        </Pressable>
                    )}
                    {name === 'Chat' && (
                        <Pressable onPress={handleDrawer}>
                            <MaterialCommunityIcons name="menu" size={35} color={Colors.textPrimary} style={{ marginRight: 0 }} />
                        </Pressable>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    search: {
        height: 50,
        fontSize: 15,
        color: Colors.primary,
        position: "relative",
        fontWeight: "bold",
        borderRadius: 30,
        backgroundColor: "#fff",
        width: "100%",
        paddingHorizontal: 80,
    },
    iconBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 15,
        alignSelf: "center"
    }
})