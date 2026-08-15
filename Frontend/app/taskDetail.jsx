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
import { useModalStore } from "@/assets/store/modalStore";
import { AuthContext } from "./hook/authContex.jsx";
import { getUserById } from "@/assets/api/fetchUser.js";
import SummaryCard from "./components/card/items/summaryCard.jsx";
import AssngineeCard from "./components/card/items/assigneeCard.jsx";
import DetailItemCard from "./components/card/items/detailItemCard.jsx";

export default function TaskDetail() {
    const { id } = useLocalSearchParams();
    const { t } = useContext(LanguageContext);
    const { bottomBarHeight } = useBottomBarHeight();
    const { NavBarHeight } = useNavBarHeight();
    const { openModal, setEditData } = useModalStore();
    const { user, logout } = useContext(AuthContext);

    const { data: task, isLoading, isError, refetch } = useQuery({
        queryKey: ['task'],
        queryFn: () => getTaskById(id)
    });

    const { data: account } = useQuery({
        queryKey: ['userInfo', user?.id],
        queryFn: () => getUserById(user?.id),
        enabled: !!user?.id
    })
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    if (!fontsLoaded) return <ActivityIndicator style={{ marginTop: 50 }} />;

    const handleEdit = () => {
        openModal("editTask", id);
        setEditData(task, "task");
    }
    let userList = [];
    const userName =
        task?.assignTo ?? task?.author?.name;

    const userId =
        task?.assignToId ?? task?.author?.id;

    if (userId && userName) {
        userList.push({ id: userId, name: userName });
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, padding: 15, backgroundColor: Colors.bgPrimary }}>
                {/* loading */}
                {isLoading && <Loading />}
                {/* error */}
                {isError && <Error fn={refetch} />}
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: bottomBarHeight }}>
                    {/* summary card */}
                    <SummaryCard summary={task?.note} />
                    {/* assigneee card */}
                    <AssngineeCard item={userList} />
                    {/* bottom conatiner start */}
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
                                title={"Task Name"}
                                value={task?.name}
                            />
                            <DetailItemCard
                                iconStyle={[styles.iconContainer, { backgroundColor: Colors.bgWarning }]}
                                icon={(<FontAwesome name="calendar-minus-o" size={24} color={Colors.warning} />)}
                                title={"Start Date"}
                                value={getTaskEndDate(task?.startDate)}
                            />
                            <DetailItemCard
                                iconStyle={[styles.iconContainer, { backgroundColor: Colors.bgWarning }]}
                                icon={(<FontAwesome name="calendar-minus-o" size={24} color={Colors.warning} />)}
                                title={"Deadline (End on)"}
                                value={getTaskEndDate(task?.endDate)}
                            />
                            <DetailItemCard
                                iconStyle={[styles.iconContainer, { backgroundColor: Colors[getStatusBgColor(task?.status)] }]}
                                icon={(<MaterialCommunityIcons
                                    name={GetIcon(task)} size={24} color={Colors[getStatusColor(task)]} />)}
                                title={"Status"}
                                value={task?.status.toLowerCase()}
                            />
                            <DetailItemCard
                                iconStyle={[styles.iconContainer, { backgroundColor: Colors.bgDanger }]}
                                icon={(<AntDesign name="clock-circle" size={24} color={Colors.danger} />)}
                                title={"Delay"}
                                value={task?.delay + "Days"}
                            />
                            <DetailItemCard
                                iconStyle={[styles.iconContainer, { backgroundColor: Colors.bgDanger }]}
                                icon={(<MaterialIcons name="feedback" size={24} color={Colors.tagUrgentText} />)}
                                title={"Reason"}
                                value={task?.reason || "N/A"}
                            />
                        </View>
                    </View>
                    {/* bottom conatiner end */}
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