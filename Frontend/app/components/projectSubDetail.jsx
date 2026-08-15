import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/assets/mainColor/colors";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjectById } from "@/assets/api/fetchData";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import tepImage from "@/assets/images/bgImages/applogo.png";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { customCard } from "@/assets/themes/style";
import AssngineeCard from "./card/items/assigneeCard";
import SummaryCard from "./card/items/summaryCard";
import Feather from "@expo/vector-icons/Feather";
import DetailItemCard from "./card/items/detailItemCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getTaskEndDate } from "@/assets/helper/calculateDate";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useBottomBarHeight } from "../hook/barHeighContex";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { getPriorityStyles } from "@/assets/libs/getPriorityBg";
import { useModalStore } from "@/assets/store/modalStore";

export default function ProjectSubDetail() {

    const { projectId } = useLocalSearchParams();
    const { bottomBarHeight } = useBottomBarHeight();
    const { openModal, setEditData } = useModalStore();

    const { data: project, isLoading, isError } = useQuery({
        queryKey: ['projectDetail', projectId],
        queryFn: () => getProjectById(projectId)
    });
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    if (!fontsLoaded) return <ActivityIndicator style={{ marginTop: 50 }} />;

    const usersList = [
        ...new Map(
            project?.tasks.map((task) => {
                const user = {
                    id: task?.assignTo?.assignUser?.id ?? task?.authorId,
                    name: task?.assignTo?.assignUser?.name ?? task?.author?.name,
                };

                return [user.id, user];
            })
        ).values(),
    ];
    const handleEdit = () => {
        openModal("editProject", projectId);
        setEditData(project, "project");
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgPrimary, padding: 15 }}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: bottomBarHeight }}>
                    {/* upper container */}
                    <SummaryCard summary={project?.summary} />
                    {/* assignee card */}
                    <AssngineeCard item={usersList} />
                    {/* detail card  */}
                    <View style={{ flexDirection: "column", width: "100%", marginTop: 30, }}>
                        {/* item header */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{
                                fontFamily: "Inter_400Regular",
                                color: Colors.textPrimary,
                                fontSize: 20
                            }}>Detail</Text>
                            <Pressable onPress={handleEdit}>
                                <Feather name="edit" size={24} color={Colors.warning} />
                            </Pressable>
                        </View>
                        {/* item list */}
                        <View style={[styles.bottomContainer, customCard['cardNormal']]}>
                            <DetailItemCard
                                iconStyle={[styles.iconContainer, { backgroundColor: Colors.lightIndigo }]}
                                icon={(<Ionicons name="checkbox-outline" size={24} color={Colors.primary} />)}
                                title={"Project Name"}
                                value={project?.name}
                            />
                            <DetailItemCard
                                iconStyle={[styles.iconContainer, { backgroundColor: Colors.waitingBg }]}
                                icon={(<MaterialIcons name="category" size={24} color={Colors.waiting} />)}
                                title={"Category"}
                                value={project?.category == "BOTH" ? "Frontend, Backend" : projct?.category}
                            />
                            <DetailItemCard
                                iconStyle={[styles.iconContainer, { backgroundColor: Colors.bgWarning }]}
                                icon={(<FontAwesome name="calendar-minus-o" size={24} color={Colors.warning} />)}
                                title={"Start Date"}
                                value={getTaskEndDate(project?.startDate)}
                            />
                            <DetailItemCard
                                iconStyle={[styles.iconContainer, { backgroundColor: Colors.bgWarning }]}
                                icon={(<FontAwesome name="calendar-minus-o" size={24} color={Colors.warning} />)}
                                title={"Deadline (End on)"}
                                value={getTaskEndDate(project?.endDate)}
                            />
                            <DetailItemCard
                                iconStyle={[styles.iconContainer, { backgroundColor: getPriorityStyles(project?.priority).bg }]}
                                icon={(<MaterialCommunityIcons name="priority-high" size={24} color={getPriorityStyles(project?.priority).text} />)}
                                title={"Priority"}
                                value={project?.priority}
                            />
                            <DetailItemCard
                                iconStyle={[styles.iconContainer, { backgroundColor: Colors.bgSuccess }]}
                                icon={(<FontAwesome6 name="bars-progress" size={24} color={Colors.success} />)}
                                title={"Progress"}
                                value={project?.progress + "%"}
                            />
                            <DetailItemCard
                                iconStyle={[styles.iconContainer, { backgroundColor: Colors.warning }]}
                                icon={(<MaterialCommunityIcons name="timeline-alert" size={24} color={Colors.bgWarning} />)}
                                title={"Duration"}
                                value={project?.duration + " day left"}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
const styles = StyleSheet.create({
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