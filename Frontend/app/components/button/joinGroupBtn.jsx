import { Pressable, StyleSheet } from "react-native";
import { Colors } from "@/assets/mainColor/colors.js";
import { shadowStyles } from "@/assets/themes/style.js";
import Ionicons from '@expo/vector-icons/Ionicons';
import {useRouter} from "expo-router";
import { customCard } from "../../../assets/themes/style";
export default function JoinGroupBtn() {
    const router = useRouter();
    return (
        <Pressable style={[styles.inviteBtn,customCard['cardNormal']]} onPress={() =>router.push("/components/scanner") }>
            <Ionicons name="scan-outline" size={35} color={Colors.textPrimary} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    inviteBtn: {
        position: "absolute",
        right: 90,
        bottom: 140,
        backgroundColor: Colors.white,
        borderRadius: 15,
        padding: 7,
    },
})