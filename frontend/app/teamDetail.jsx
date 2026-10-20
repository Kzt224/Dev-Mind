import { Animated, ScrollView, StyleSheet, View } from "react-native";
import AddButton from "./components/button/addBtn.jsx";
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
import { useBottomBarHeight } from "./hook/barHeighContex.jsx";
import { getUserById } from "@/assets/api/fetchUser.js";
import { useAlertStore } from "../assets/store/aleartStore.js";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TeamDetail() {

    const { id } = useLocalSearchParams();
    const { scrollAnim, onScroll } = useScrollAnimation();
    const { user } = useContext(AuthContext);
    const { bottomBarHeight } = useBottomBarHeight();
    const { data: groupDetail, isLoading, isError, refetch } = useQuery({
        queryKey: ['member'],
        queryFn: () => getGroupMember(id),
    });

    const { data: account, } = useQuery({
        queryKey: ['userInfo', user?.id],
        queryFn: () => getUserById(user?.id),
        enabled: !!user?.id
    })

    const member = groupDetail?.result;
    const permission = groupDetail?.permission;

    if (isLoading) {
        return (
            <View style={{ flex: 1, padding: 15, backgroundColor: Colors.bgPrimary }}>
                <Loading />
            </View>
        );
    }
    if (isError) {
        return (
            <Error fn={refetch} />
        );
    }
    const currentUser = account?.user ?? {};
    const sortedMembers = [...member].sort((a, b) => {
        const aMe = a.userId === currentUser.id;
        const bMe = b.userId === currentUser.id;

        if (aMe && !bMe) return -1;
        if (!aMe && bMe) return 1;
        if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
        if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;
        return a.user.userName.localeCompare(b.user.userName);
    });
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, padding: 15, backgroundColor: Colors.bgPrimary }}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: bottomBarHeight }}>
                    <View style={styles.itemParent}>
                        {sortedMembers?.map((i) => (
                            <MemberItem
                                member={i}
                                key={i.id}
                                currUser={currentUser}
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
            </SafeAreaView>
        </SafeAreaProvider>
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