import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GetIcon, getStatusColor } from "../assets/libs/GetIcon";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "../assets/mainColor/colors.js";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/assets/api/fetchData.js";
import { getDate } from "../assets/helper/calculateDate";
import { customCard } from "../assets/themes/style.js";
import { useContext } from "react";
import { LanguageContext } from "./hook/languageContex.jsx";
import { useBottomBarHeight } from "./hook/barHeighContex.jsx";
import { useNavBarHeight } from "./hook/navHeighContex.jsx";
import Loading from "./components/card/loading.jsx";
import Error from "./components/card/error.jsx";
export default function TaskDetail() {
    const { id } = useLocalSearchParams();
    const { t, changeLanguage } = useContext(LanguageContext);
    const { bottomBarHeight } = useBottomBarHeight();
    const { NavBarHeight } = useNavBarHeight();

    const { data: task, isLoading, isError, refetch } = useQuery({
        queryKey: ['task'],
        queryFn: () => getTaskById(id)
    });

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    if (!fontsLoaded) return <ActivityIndicator style={{ marginTop: 50 }} />;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, padding: 15, backgroundColor: Colors.bgPrimary }}>
                {/* loading */}
                {isLoading && <Loading />}
                {/* error */}
                {isError && <Error fn={refetch} />}
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: bottomBarHeight, marginTop: NavBarHeight }}>
                    {/* upper container */}
                    <View style={[styles.container, customCard['cardNormal']]}>
                        <Text style={{
                            fontFamily: "Inter_700Bold",
                            color: Colors.textPrimary,
                            fontSize: 24
                        }}>{task?.name}</Text>
                        <View style={styles.hr}></View>
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 10, gap: 8,
                        }}>
                            <Text style={{
                                color: Colors.textSecondary,
                                fontFamily: "Inter_700Bold",
                                fontSize: 15
                            }}>Status:  {t[task?.status]}
                            </Text>
                            <MaterialCommunityIcons name={GetIcon(task)} size={22} color={Colors[getStatusColor(task || [])]} />
                        </View>
                        <Text style={{
                            color: Colors.textSecondary,
                            fontFamily: "Inter_700Bold",
                            fontSize: 15, marginTop: 10
                        }}>
                            TimeLeft: {task?.duration}
                        </Text>
                    </View>

                    <View style={[styles.container, customCard['cardNormal']]}>
                        <View style={{ marginTop: 10, display: "flex", flexDirection: "column" }}>
                            <Text style={{ fontFamily: "Inter_700Bold", color: Colors.textPrimary, fontSize: 24 }}>Details</Text>
                            <View style={styles.hr}></View>
                        </View>
                        {task && Object.entries(task)?.map(([key, value]) => {
                            if (["id", "authorId", "name", "createdAt", "status", 'projectId'].includes(key)) return null;
                            let displayValue = value;
                            if (key === "startDate" || key === "endDate") {
                                displayValue = getDate(value);   // value is a string, so this will work
                            }
                            else if (typeof value === "object" && value !== null) {
                                displayValue = value.name ?? JSON.stringify(value);
                            } else if (value === null) {
                                displayValue = '';
                            }
                            return (
                                <View
                                    key={key}
                                    style={{
                                        marginTop: 10,
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 8
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: "Inter_700Bold",
                                        fontSize: 15,
                                        color: Colors.textSecondary,
                                    }}>{t[key] || key}:</Text>
                                    <Text style={{
                                        fontSize: 14,
                                        fontFamily: "Inter_700Bold",
                                        color: Colors.textSecondary,
                                    }}>{String(displayValue)}</Text>
                                </View>
                            );
                        })}

                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        borderRadius: 15
    },
    hr: {
        width: "100%",
        borderWidth: 1,
        borderColor: Colors.gray,
        marginTop: 10
    }
})