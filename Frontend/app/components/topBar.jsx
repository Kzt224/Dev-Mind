import { Text, View, TextInput, StyleSheet, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather.js";
import { Colors } from "../../assets/mainColor/colors";
import { shadowStyles } from "@/assets/themes/style";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getNotification } from "@/assets/api/fetchData";
import Loading from "./card/loading";
import Error from "./card/error";
import SearchForm from "./searchForm";
import {calculateNotiLength} from "@/assets/helper/calculateNotiLength.js"
export default function TopBar() {
    const router = useRouter();

    const { data: noti, isLoading, isError } = useQuery({
        queryKey: ['notification'],
        queryFn: () => getNotification(),
    });

    if (isLoading) {
        return (
            <Loading />
        );
    }
    if (isError) {
        return (
            <Error />
        );
    }
  
    const unReadCount = noti?.filter(not => !not.read).length || 0;
    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        }}>
            {/* search */}
            <View style={{ display: "flex", justifyContent: "center", width: "80%", paddingHorizontal: 15, padding: 10 }}>
                <SearchForm/>
            </View>
            <View style={styles.iconBox}>
                <Pressable onPress={() => router.push("/components/account")}>
                    <FontAwesome5 name="user" size={25} color={Colors.textPrimary} />
                </Pressable>
                <Pressable onPress={() => router.push("/components/notification")}>
                    <FontAwesome5 name="bell" size={25} color={Colors.textPrimary} />
                    {unReadCount > 0 && (
                        <View style={{
                            position: "absolute",
                            fontWeight: "bold",
                            top: -2,
                            left: 10,
                            alignItems: "center",
                            justifyContent: "center",
                            width: 17,
                            height: 17,
                            borderRadius: 100,
                            backgroundColor: Colors.red
                        }}>
                            <Text style={{ color: Colors.white, fontSize: 11,textAlign: "center" }}>{calculateNotiLength(noti)}</Text>
                        </View>
                    )}
                </Pressable>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    search: {
        height: 50,
        fontSize: 15,
        color: Colors.primary,
        position: "relative",
        fontWeight: "bold",
        borderRadius: 30,
        backgroundColor: "#fff",
        width: "100%",
        paddingHorizontal: 80,
    },
    iconBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 15
    }
})