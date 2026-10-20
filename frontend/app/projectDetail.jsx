import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ProgressBar from "./components/progressBar.jsx";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Feather';
import TimeLine from "./components/timeline.jsx";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Colors } from "../assets/mainColor/colors.js";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useModalStore } from "../assets/store/modalStore.js";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/assets/api/fetchData.js";
import Loading from "./components/card/loading.jsx";
import Error from "./components/card/error.jsx";
import { useContext, useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import EditButton from "./components/button/editButton.jsx";
import Item from "./components/item.jsx";
import { customCard, shadowStyles } from "../assets/themes/style.js";
import AddButton from "./components/button/addBtn.jsx";
import { useBottomBarHeight } from "./hook/barHeighContex.jsx";
import { useNavBarHeight } from "./hook/navHeighContex.jsx";
import useScrollAnimation from "./hook/animationContex.jsx";
import { LanguageContext } from "./hook/languageContex.jsx";
import TaskCard from "./components/card/items/TaskCard.jsx";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons.js";

export default function projectDetail() {
    const { openModal, closeModal, setEditData } = useModalStore();
    const { t } = useContext(LanguageContext);
    const { id } = useLocalSearchParams();
    const { bottomBarHeight } = useBottomBarHeight();
    const { NavBarHeight } = useNavBarHeight();
    const [showEditBtn, setShowEditBtn] = useState(false);
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['projectDetail', id],
        queryFn: () => getProjectById(id)
    });
    const { scrollAnim, onScroll } = useScrollAnimation();

    const project = data;
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    const router = useRouter();
    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#8255F5" />;
    }
    const handleNavigate = () => {
        router.push("/chat");
    }
    const gotToProjectSubDetail = () => {
        router.push({
            pathname: "/components/projectSubDetail",
            params: { projectId: id }
        })
    }
    const permission = project?.permission;
    return (
        <View style={{ flex: 1, padding: 15, backgroundColor: Colors.bgPrimary }}>
            <Pressable onPress={() => gotToProjectSubDetail()} style={[styles.upperContainer, customCard['cardNormal']]}>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "90%",
                    alignItems: "center"
                }}>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                        gap: 15
                    }}>
                        <View style={{
                            backgroundColor: Colors.cardBlue,
                            width: 50,
                            height: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10
                        }}>
                            <AntDesign name="api" size={24} color={Colors.primary} />
                        </View>
                        <View style={{ display: "flex", flexDirection: "column" }}>
                            <Text style={{
                                fontSize: 25,
                                color: Colors.textPrimary,
                                fontFamily: "Inter_700Bold"
                            }}>
                                {project?.name}
                            </Text>
                            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                                <Text style={{ color: Number(project?.duration) < 7 ? Colors.danger : Colors.textSecondary }}>Project end On:</Text>
                                <Text style={{ color: Number(project?.duration) < 7 ? Colors.danger : Colors.textSecondary }}>{project?.duration} days</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: "10%", alignItems: "flex-end" }}>
                        <Entypo name="chevron-right" color={Colors.textPrimary} size={30} />
                    </View>
                </View>
            </Pressable>
            <ScrollView onScroll={onScroll} showsVerticalScrollIndicator={false}
                style={{ marginBottom: bottomBarHeight }}
            >
                {/* loading */}
                {isLoading && <Loading />}
                {/* error */}
                {isError && <Error fn={refetch} />}

                {/* goals session */}
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 25, color: Colors.textPrimary, fontFamily: "Inter_700Bold" }}>Task List</Text>
                </View>
                {project?.tasks?.length > 0 ? (
                    <TaskCard data={project?.tasks} />
                ) : (
                    <View style={[styles.delayBox, customCard['cardNormal']]}>
                        <Text style={{ fontWeight: "bold", color: Colors.warning, fontSize: 19, textAlign: "center" }}>{t["Add new goals"]}</Text>
                    </View>
                )}
                {/* timeline session */}
                <TimeLine tasks={project?.tasks} />
            </ScrollView>
            <Animated.View
                style={{
                    position: "absolute",
                    right: 20,
                    bottom: 80,
                    transform: [{
                        translateY: scrollAnim.interpolate({
                            inputRange: [0, 50],
                            outputRange: [0, 100]
                        })
                    }]
                }}
            >
                {permission?.canAddTask && (
                    <AddButton name={'forTask'} id={project?.id} />
                )}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    upperContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        marginTop: 20,
        padding: 15
    },
    delayBox: {
        width: "100%",
        padding: 10,
        borderRadius: 15,
        marginTop: 25,
        padding: 30,
        paddingHorizontal: 20
    }
})

