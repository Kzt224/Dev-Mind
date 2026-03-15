import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
import { useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import EditButton from "./components/button/editButton.jsx";
import Item from "./components/item.jsx";
import { customCard, shadowStyles } from "../assets/themes/style.js";
import AddButton from "./components/button/addBtn.jsx";
import { useBottomBarHeight } from "./hook/barHeighContex.jsx";
import {useNavBarHeight } from "./hook/navHeighContex.jsx";
export default function projectDetail() {
    const { openModal, closeModal, setEditData } = useModalStore();
    const { id } = useLocalSearchParams();
    const { bottomBarHeight } = useBottomBarHeight();
    const {NavBarHeight} = useNavBarHeight();
    const [showEditBtn, setShowEditBtn] = useState(false);
    const { data, isLoading, isError,refetch } = useQuery({
        queryKey: ['projectDetail', id],
        queryFn: () => getProjectById(id)
    });
    const project = data?.result;
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

    const handleEdit = (item, type = 'project') => {
        openModal('editProject', item.id);
        setEditData(item, type);
    }
    const permission = project?.permission;
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1,padding: 15, backgroundColor: Colors.bgPrimary }}>
                <ScrollView showsVerticalScrollIndicator={false}
                    style={{ marginBottom: bottomBarHeight,marginTop: NavBarHeight}}
                >
                    {/* loading */}
                    {isLoading && <Loading/>}
                    {/* error */}
                    {isError && <Error fn={refetch}/>}
                    {/* project container */}
                    <Pressable onLongPress={() => setShowEditBtn(true)} style={[styles.upperContainer, customCard['cardNormal']]}>
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "90%",
                        }}>
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                width: "100%",
                                gap: 15
                            }}>
                                <ProgressBar progress={project?.progress} />
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
                            {(showEditBtn && permission?.canEdit) && (
                                <EditButton item={project} isShake={true} handleEdit={handleEdit} />
                            )}
                        </View>
                        {/* edit close btn */}
                        {showEditBtn && (
                            <Pressable
                                onPress={() => setShowEditBtn(false)}
                                style={{ position: "absolute", right: -1, top: -10, width: 24, height: 24, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", borderRadius: 24 }}>
                                <Entypo name="cross" size={20} color={Colors.white} />
                            </Pressable>
                        )}
                    </Pressable>
                    {/* goals session */}
                    <View style={{ marginTop: 50 }}>
                        <Text style={{ fontSize: 25, color: Colors.textPrimary, fontFamily: "Inter_700Bold" }}>Goals</Text>
                    </View>
                    {project?.tasks?.length > 0 ? (
                        <Item useFor={'task'} data={project?.tasks} />
                    ) : (
                        <View style={[styles.delayBox, customCard['cardNormal']]}>
                            <Text style={{ fontWeight: "bold", color: Colors.warning, fontSize: 19, textAlign: "center" }}>Add new goals</Text>
                        </View>
                    )}
                    {/* timeline session */}
                    <TimeLine tasks={project?.tasks} />
                </ScrollView>
                {permission?.canAddTask && (
                    <AddButton name={'forTask'} id={project?.id} />
                )}
            </SafeAreaView>
        </SafeAreaProvider>
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

