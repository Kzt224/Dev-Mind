import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFonts, Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { Colors } from "../assets/mainColor/colors";
import Feather from "@expo/vector-icons/Feather";
import { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getAllTask } from "@/assets/api/fetchData.js";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons.js";
import { GetIcon, getStatusColor } from "../assets/libs/GetIcon.js";
import { customCard, shadowStyles } from "../assets/themes/style.js";
import AddButton from "./components/button/addBtn.jsx";
import Error from "./components/card/error.jsx";
import Loading from "./components/card/loading.jsx";
import Bar from "./components/bar.jsx";
import { useBottomBarHeight } from "./hook/barHeighContex.jsx";
import { useNavBarHeight } from "./hook/navHeighContex.jsx";
import useScrollAnimation from "./hook/animationContex.jsx";
import { LanguageContext } from "./hook/languageContex.jsx";
import Entypo from '@expo/vector-icons/Entypo';
import Progress from "./components/progress.jsx";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getDate, getTaskEndDate } from "../assets/helper/calculateDate.js";
import TaskCard from "./components/card/items/TaskCard.jsx";

export default function Task() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    const { t } = useContext(LanguageContext);
    const { scrollAnim, onScroll } = useScrollAnimation();
    const { bottomBarHeight } = useBottomBarHeight();
    const { NavBarHeight } = useNavBarHeight();
    const pathName = usePathname();
    const [goals, setGoals] = useState(null);
    const { data: tasks, isError, isLoading, refetch } = useQuery({
        queryKey: ['tasks'],
        queryFn: () => getAllTask()
    });

    useEffect(() => {
        if (tasks) {
            setGoals(tasks);
        }
    }, [tasks]);
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color={Colors.primary} />;
    }

    const handleSort = (key) => {
        let sorted = [];
        if (key === "project") {
            sorted = [...goals].sort((a, b) =>
                (a.project?.name || "").localeCompare(b.project?.name || "")
            );
        } else {
            sorted = [...goals].sort((a, b) =>
                (a[key] || "").toLowerCase().localeCompare((b[key] || "").toLowerCase())
            );
        }
        setGoals(sorted);
        setShowMenu(false);
    };

    const retry = {
        refetch
    }
    const handleNavigate = (item) => {
        router.push({
            pathname: "/taskDetail",
            params: { id: item.id }
        });
    }

    if (isLoading) {
        return (
            <Loading />
        );
    }
    if (isError) {
        return (
            <Error fn={retry} />
        );
    }
    return (
        <View style={{
            padding: 15,
            flex: 1,
            backgroundColor: Colors.bgPrimary,
        }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text
                    style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 32,
                        color: Colors.textPrimary,
                    }}
                >
                    {t["Tasks"]}
                </Text>
                <AddButton name={"forTask"} />
            </View>
            <ScrollView onScroll={onScroll} style={{ padding: 2, marginBottom: bottomBarHeight }}
                contentContainerStyle={{ paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
            >
                {/* {goals?.map((d) => (
                    // <Pressable onPress={() => handleNavigate(d)} key={d?.id} style={[styles.itemContainer, customCard['cardNormal']]}>
                    //     <View style={styles.upperContainer}>
                    //         <Text style={{
                    //             color: Colors.textPrimary,
                    //             fontFamily: "Inter_700Bold",
                    //             fontSize: 20,
                    //         }}>{d?.name}</Text>
                    //         <Entypo name="dots-three-vertical" size={20} color={Colors.textPrimary} />
                    //     </View>
                    //     <View style={styles.middleContainer}>
                    //         <View style={styles.innerLeftConitainer}>
                    //             <Text
                    //                 style={{
                    //                     color: Colors.textSecondary,
                    //                     fontFamily: "Inter_700Bold",
                    //                     fontSize: 16,
                    //                 }}
                    //             >Progress</Text>
                    //             <View style={styles.dateContainer}>
                    //                 <Text style={{ fontWeight: "bold", fontSize: 12 }}>{getTaskEndDate(d?.endDate)}</Text>
                    //             </View>
                    //         </View>
                    //         <View style={styles.innerRightContiner}>
                    //             <Text style={{ color: Colors.textSecondary, fontWeight: "bold" }}>Due: 10 tasks</Text>
                    //         </View>
                    //     </View>
                    //     <Progress pg={d?.progress} />
                    //     <View style={styles.bottomContainer}>
                    //         <View style={styles.checkContainer}>
                    //             <FontAwesome name="check-circle" size={22} color={Colors.success} />
                    //             <Text style={{ color: Colors.textSecondary, fontWeight: "bold" }}>AI Health Check</Text>
                    //         </View>
                    //         <Text style={{ color: Colors.textSecondary, fontWeight: "bold" }}>10 Tasks</Text>
                    //     </View>
                    // </Pressable>
                ))} */}
                <TaskCard data={goals ? goals : []} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        padding: 15,
        marginTop: 15,
        flexDirection: "col",
        alignItems: "center",
    },
    upperContainer: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center"
    },
    middleContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 8
    },
    innerLeftConitainer: {
        display: "flex",
        flexDirection: "row",
        gap: 8
    },
    dateContainer: {
        backgroundColor: Colors.bgWarning,
        padding: 4,
        borderRadius: 8
    },
    bottomContainer: {
        display: "flex",
        width: "100%",
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    checkContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.bgSuccess,
        padding: 3,
        gap: 8,
        paddingHorizontal: 5,
        borderRadius: 10
    }

});
