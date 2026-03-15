import { ScrollView, StyleSheet, Text, View } from "react-native";
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
export default function Index() {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["project"],
        queryFn: () => getAllProject(),
    });
    const {bottomBarHeight} = useBottomBarHeight();
    const projects = data?.result;
    const permission = data?.permission;
    const { searchQuery } = useSearchStore();
    const searchResult = searchQuery?.trim() === ''
        ? projects
        : projects.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgPrimary }}>
                {/* loading state */}
                {isLoading && <Loading/>}
                {isError && <Error fn={refetch}/>}
                {/* search */}
                <TopBar />
                {/* title */}
                <View style={styles.container}>
                    <Text style={[styles.title, { fontFamily: "Inter_700Bold", color: Colors.textPrimary }]}>Project list</Text>
                    <FontAwesome name="list-ul" size={28} color={Colors.textPrimary} />
                </View>
                {/* all project */}
                <ScrollView showsVerticalScrollIndicator={false} style={{
                    marginBottom: bottomBarHeight
                }}>
                    <Item data={searchResult ? searchResult : projects} permission={permission} useFor={'project'} />
                </ScrollView>
                {/* add button */}
                <AddButton name={"forProject"} />
                {/* bottom bar for home page */}
                <Bar />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: "8%",
        display: "flex",
        flexDirection: "row",
        padding: 30,
        alignItems: "center",
        justifyContent: "space-between"
    },
    title: {
        fontSize: 28,
    },

})