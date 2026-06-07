import { Animated, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import TopBar from "./components/topBar.jsx";
import Item from "./components/item.jsx";
import Bar from "./components/bar.jsx";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/assets/mainColor/colors.js";
import AddButton from "./components/button/addBtn.jsx"
import PopupInput from "./components/Form/PoputInput.jsx";
import { useQuery } from "@tanstack/react-query";
import { getAllProject } from "@/assets/api/fetchData.js";
import Loading from "./components/card/loading.jsx";
import Error from "./components/card/error.jsx";
import { useSearchStore } from "@/assets/store/searchStore.js";
import { useBottomBarHeight } from "./hook/barHeighContex.jsx";
import useScrollAnimation from "./hook/animationContex.jsx";
import { useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LanguageContext } from "./hook/languageContex.jsx";
import ActivityCard from "./components/card/items/ActivityCard.jsx";
import { LinearGradient } from "expo-linear-gradient";
import ProjectCard from "./components/card/items/ProjectCard.jsx";
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');
export default function Index() {
    const { data, isLoading, isError, refetch, isSuccess } = useQuery({
        queryKey: ["project"],
        queryFn: () => getAllProject(),
    });
    const router = useRouter();
    const { t } = useContext(LanguageContext);
    const projects = data?.result;
    useEffect(() => {
        const setCache = async () => {
            if (isSuccess) {
                await AsyncStorage.setItem('Projects', JSON.stringify(projects));
            }
        }
        setCache();
    }, []);
    const { scrollAnim, onScroll } = useScrollAnimation();
    const { bottomBarHeight } = useBottomBarHeight();
    const permission = data?.permission;
    const { searchQuery } = useSearchStore();
    const searchResult = searchQuery?.trim() === ''
        ? projects
        : projects.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const filterProject = projects?.filter((d) => d.progress > 0);
    return (
        <View style={{ flex: 1, backgroundColor: Colors.bgPrimary }}>
            {/* loading state */}
            {isLoading && <Loading />}
            {isError && <Error fn={refetch} />}
            {/* title */}
            <View style={styles.container}>
                <Text style={[styles.title, { fontFamily: "Inter_700Bold", color: Colors.textPrimary }]}>Dashboard</Text>
            </View>
            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <ActivityCard project={projects} />
                </ScrollView>
            </View>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 15
            }}>
                <Text style={{ color: Colors.textPrimary, fontSize: 24, fontWeight: "bold" }}>Project Backlog</Text>
                <Pressable onPress={() => router.push("/project")}>
                    <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: "bold" }}>See all</Text>
                </Pressable>
            </View>
            {/* all project */}
            <ScrollView onScroll={onScroll} showsVerticalScrollIndicator={false} style={{
                marginBottom: bottomBarHeight
            }}>
                {/* <Item data={searchResult ? searchResult : projects} permission={permission} useFor={'project'} /> */}
                <ProjectCard data={filterProject} />
            </ScrollView>
            {/* add button */}
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
                <AddButton name={"forProject"} />
            </Animated.View>
            {/* bottom bar for home page */}
            <Bar />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        padding: 15,
    },
    title: {
        fontSize: 32,
    },

})