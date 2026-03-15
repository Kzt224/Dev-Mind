import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFonts, Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { Colors } from "../assets/mainColor/colors";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
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

export default function Task() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
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
                    marginTop: NavBarHeight,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text
                    style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 25,
                        color: Colors.textPrimary,
                    }}
                >
                    TaskList
                </Text>
                <Pressable onPress={() => setShowMenu(!showMenu)}>
                    <Feather name="filter" size={35} color={Colors.textPrimary} />
                </Pressable>
                {showMenu && (
                    <View style={[styles.menu, customCard['cardNormal']]}>
                        <Pressable style={[styles.item, styles.itemBorder]} onPress={() => handleSort("name")}>
                            <Text style={styles.menuText}>Sort By name</Text>
                        </Pressable>
                        <Pressable style={[styles.item, styles.itemBorder]} onPress={() => handleSort("project")}>
                            <Text style={styles.menuText}>Sort By project</Text>
                        </Pressable>
                        <Pressable style={styles.item} onPress={() => handleSort("status")}>
                            <Text style={styles.menuText}>Sort By status</Text>
                        </Pressable>
                    </View>
                )}
            </View>
            <ScrollView style={{ padding: 2, marginBottom: bottomBarHeight }}
                contentContainerStyle={{ paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
            >
                {goals?.map((d) => (
                    <Pressable onPress={() => handleNavigate(d)} key={d?.id} style={[styles.itemContainer, customCard['cardNormal']]}>
                        <Text style={{ fontWeight: "bold", color: Colors.textSecondary }}>{d?.name}</Text>
                        <Text style={{ fontWeight: "bold", color: Colors.textSecondary }}>{d?.project?.name}</Text>
                        <MaterialCommunityIcons name={GetIcon(d)} size={25} color={Colors[getStatusColor(d)]} />
                    </Pressable>
                ))}
            </ScrollView>
            {/* add button */}
            <AddButton name={"forTask"} />
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        padding: 30,
        marginTop: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    menu: {
        width: "50%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        position: "absolute",
        right: 35,
        top: 20,
        zIndex: 5,
    },
    itemBorder: {
        borderBottomWidth: 0.5,
        borderColor: Colors.lightIndigo
    },
    item: {
        width: "100%",
        padding: 8
    },
    menuText: {
        color: Colors.textSecondary,
        fontWeight: "bold",
        alignItems: "center",
        alignSelf: "center",
    },
});
