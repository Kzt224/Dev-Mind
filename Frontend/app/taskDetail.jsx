import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GetIcon, getStatusBgColor, getStatusColor } from "../assets/libs/GetIcon";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "../assets/mainColor/colors.js";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/assets/api/fetchData.js";
import { getDate, getTaskEndDate } from "../assets/helper/calculateDate";
import { customCard } from "../assets/themes/style.js";
import { useContext } from "react";
import { LanguageContext } from "./hook/languageContex.jsx";
import { useBottomBarHeight } from "./hook/barHeighContex.jsx";
import { useNavBarHeight } from "./hook/navHeighContex.jsx";
import Loading from "./components/card/loading.jsx";
import Error from "./components/card/error.jsx";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import tepImage from "@/assets/images/bgImages/applogo.png";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

export default function TaskDetail() {
    const { id } = useLocalSearchParams();
    const { t } = useContext(LanguageContext);
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
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: bottomBarHeight }}>
                    {/* upper container start */}
                    <View style={styles.container}>
                        <Text style={{
                            fontFamily: "Inter_700Bold",
                            color: Colors.textPrimary,
                            fontSize: 22
                        }}>Task Description & Detail</Text>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ color: Colors.textSecondary, marginTop: 8, fontSize: 14 }}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam molestias laboriosam architecto corrupti eum laborum rerum esse doloribus.
                            </Text>
                            <Text style={{ color: Colors.primary }}>More</Text>
                        </View>
                    </View>
                    {/* upper container end */}
                    {/* middle container start */}
                    <View style={{ marginTop: 30 }}>
                        <Text style={{
                            fontFamily: "Inter_400Regular",
                            color: Colors.textPrimary,
                            fontSize: 20
                        }}>Assigneee person profile</Text>
                    </View>
                    <View style={[styles.profileContainer, customCard['cardNormal']]}>
                        <View style={styles.leftContainer}>
                            <View style={styles.imageContainer}>
                                <Image source={tepImage} style={{ width: 45, height: 45, borderRadius: 50 }} />
                            </View>
                            <View style={styles.nameContainer}>
                                <Text style={{
                                    fontFamily: "Inter_400Regular",
                                    color: Colors.textPrimary,
                                    fontSize: 18
                                }}>Poe Kaung</Text>
                                <Text style={{
                                    fontFamily: "Inter_400Regular",
                                    color: Colors.success,
                                    fontSize: 14
                                }}
                                >Active, Accepted Task</Text>
                            </View>
                        </View>
                        <Pressable>
                            <MaterialIcons name="keyboard-arrow-right" size={30} color={Colors.textPrimary} />
                        </Pressable>
                    </View>
                    {/* middle container end */}
                    {/* bottom conatiner start */}
                    <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{
                            fontFamily: "Inter_400Regular",
                            color: Colors.textPrimary,
                            fontSize: 20
                        }}>Detail</Text>
                        <Pressable>
                            <Feather name="edit" size={24} color={Colors.warning} />
                        </Pressable>
                    </View>
                    <View style={[styles.bottomContainer, customCard['cardNormal']]}>
                        <View style={styles.item}>
                            <View style={[styles.iconContainer, { backgroundColor: Colors.lightIndigo }]}>
                                <Ionicons name="checkbox-outline" size={24} color={Colors.primary} />
                            </View>
                            <View style={{ marginLeft: 25 }}>
                                <Text style={{
                                    fontFamily: "Inter_400Regular",
                                    color: Colors.textPrimary,
                                    fontSize: 16
                                }}>Task Name </Text>
                                <Text style={{
                                    fontFamily: "Inter_400Regular",
                                    color: Colors.textSecondary,
                                    fontSize: 14
                                }}>{task?.name} </Text>
                            </View>
                        </View>
                        <View style={styles.item}>
                            <View style={[styles.iconContainer, { backgroundColor: Colors.bgWarning }]}>
                                <FontAwesome name="calendar-minus-o" size={24} color={Colors.warning} />
                            </View>
                            <View style={{ marginLeft: 25 }}>
                                <Text style={{
                                    fontFamily: "Inter_400Regular",
                                    color: Colors.textPrimary,
                                    fontSize: 16
                                }}>Start Date </Text>
                                <Text style={{
                                    fontFamily: "Inter_400Regular",
                                    color: Colors.textSecondary,
                                    fontSize: 14
                                }}>{getTaskEndDate(task?.startDate)} </Text>
                            </View>
                        </View>
                        <View style={styles.item}>
                            <View style={[styles.iconContainer, { backgroundColor: Colors.bgWarning }]}>
                                <FontAwesome name="calendar-minus-o" size={24} color={Colors.warning} />
                            </View>
                            <View style={{ marginLeft: 25 }}>
                                <Text style={{
                                    fontFamily: "Inter_400Regular",
                                    color: Colors.textPrimary,
                                    fontSize: 16
                                }}>Deadline (End on) </Text>
                                <Text style={{
                                    fontFamily: "Inter_400Regular",
                                    color: Colors.textSecondary,
                                    fontSize: 14
                                }}>{getTaskEndDate(task?.endDate)} </Text>
                            </View>
                        </View>
                        <View style={styles.item}>
                            <View style={[styles.iconContainer, { backgroundColor: Colors[getStatusBgColor(task?.status)] }]}>
                                <MaterialCommunityIcons name={GetIcon(task)} size={24} color={Colors[getStatusColor(task)]} />
                            </View>
                            <View style={{ marginLeft: 25 }}>
                                <Text style={{
                                    fontFamily: "Inter_400Regular",
                                    color: Colors.textPrimary,
                                    fontSize: 16
                                }}>Status </Text>
                                <Text style={{
                                    fontFamily: "Inter_400Regular",
                                    color: Colors.textSecondary,
                                    fontSize: 14
                                }}>{task?.status.toLowerCase()} </Text>
                            </View>
                        </View>
                        <View style={styles.item}>
                            <View style={[styles.iconContainer, { backgroundColor: Colors.bgDanger }]}>
                                <AntDesign name="clock-circle" size={24} color={Colors.danger} />
                            </View>
                            <View style={{ marginLeft: 25 }}>
                                <Text style={{
                                    fontFamily: "Inter_400Regular",
                                    color: Colors.textPrimary,
                                    fontSize: 16
                                }}>Delay </Text>
                                <Text style={{
                                    fontFamily: "Inter_400Regular",
                                    color: Colors.textSecondary,
                                    fontSize: 14
                                }}>{task?.delay} days</Text>
                            </View>
                        </View>
                        <View style={styles.item}>
                            <View style={[styles.iconContainer, { backgroundColor: Colors.tagUrgent }]}>
                                <MaterialIcons name="feedback" size={24} color={Colors.tagUrgentText} />
                            </View>
                            <View style={{ marginLeft: 25 }}>
                                <Text style={{
                                    fontFamily: "Inter_400Regular",
                                    color: Colors.textPrimary,
                                    fontSize: 16
                                }}>Reason </Text>
                                <Text style={{
                                    fontFamily: "Inter_400Regular",
                                    color: Colors.textSecondary,
                                    fontSize: 14
                                }}>{task?.reason || "N/A"}</Text>
                            </View>
                        </View>
                    </View>
                    {/* bottom conatiner end */}
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        borderRadius: 15
    },
    hr: {
        width: "100%",
        borderWidth: 1,
        borderColor: Colors.gray,
        marginTop: 10
    },
    profileContainer: {
        marginTop: 20,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 55,
        borderColor: Colors.primary,
        borderWidth: 2,
        alignItems: "baseline",
        justifyContent: "center"
    },
    nameContainer: {
        marginLeft: 20,
        flexDirection: "column"
    },
    bottomContainer: {
        marginTop: 15,
        padding: 15,
        flexDirection: "column",
        gap: 25
    },
    item: {
        flexDirection: "row"
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    }
})