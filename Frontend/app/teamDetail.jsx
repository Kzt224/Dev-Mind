import { ActivityIndicator, Animated, ScrollView, StyleSheet, View } from "react-native";
import AddButton from "./components/button/addBtn.jsx";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getGroupMember } from '@/assets/api/fetchData.js';
import Loading from "./components/card/loading.jsx";
import Error from "./components/card/error.jsx";
import { useContext } from "react";
import { AuthContext } from "./hook/authContex.jsx";
import MemberItem from "./components/card/items/memberItem.jsx";
import { Colors } from "../assets/mainColor/colors.js";
import { useNavBarHeight } from "./hook/navHeighContex.jsx";
import useScrollAnimation from "./hook/animationContex.jsx";
export default function TeamDetail() {

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    const { id } = useLocalSearchParams();
    const { scrollAnim, onScroll } = useScrollAnimation();
    const { user } = useContext(AuthContext);
    const { NavBarHeight } = useNavBarHeight();
    const { data: groupDetail, isLoading, isError, refetch } = useQuery({
        queryKey: ['member'],
        queryFn: () => getGroupMember(id),
    });
    const member = groupDetail?.result;
    const permission = groupDetail?.permission;

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#8255F5" />;
    }

    const retry = () => {
        refetch();
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
        <View style={{ flex: 1, padding: 15, backgroundColor: Colors.bgPrimary }}>
            <ScrollView style={{ marginTop: NavBarHeight }}>
                <View style={styles.itemParent}>
                    {member?.map((i) => (
                        <MemberItem
                            member={i}
                            key={i.id}
                            currentUser={user}
                            permission={permission}
                        />
                    ))}
                </View>
            </ScrollView>
            {permission.canInvite && (
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
                    <AddButton name={'forInvite'} id={id} size={25} text={'invite new user'} icName={"usergroup-add"} />
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    itemParent: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
})