import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import SearchForm from "./components/searchForm";
import { shadowStyles } from "@/assets/themes/style.js";
import AddButton from "./components/button/addBtn.jsx";
import Item from "./components/item.jsx";
import { useQuery } from "@tanstack/react-query";
import { getAllGroup } from "@/assets/api/fetchData.js";
import Loading from "./components/card/loading.jsx";
import Error from "./components/card/error.jsx";
import groupImage from "@/assets/images/bgImages/null-group3.png";
import JoinGroupBtn from "./components/button/joinGroupBtn.jsx";
import { Colors } from "../assets/mainColor/colors.js";
import { useBottomBarHeight } from "./hook/barHeighContex.jsx";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavBarHeight } from "./hook/navHeighContex.jsx";

export default function Team() {

    const { data: group, isLoading, isError,refetch } = useQuery({
        queryKey: ['group'],
        queryFn: () => getAllGroup()
    });
    const { bottomBarHeight } = useBottomBarHeight();
    const { NavBarHeight } = useNavBarHeight();
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, padding: 4, backgroundColor: Colors.bgPrimary }}>
                {/* loadingn */}
                {isLoading && <Loading/>}
                {/* error */}
                {isError && <Error fn={refetch}/>}
                <ScrollView showsVerticalScrollIndicator={false}
                    style={{ marginBottom: bottomBarHeight,marginTop:NavBarHeight}}
                >
                    {/* group list and create team */}
                    <Item data={group} useFor={'team'} />
                </ScrollView>
                <View>
                    <JoinGroupBtn />
                    <AddButton name={'forTeam'} />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
