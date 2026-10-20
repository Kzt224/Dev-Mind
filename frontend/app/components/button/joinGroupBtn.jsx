import { Pressable, StyleSheet } from "react-native";
import { Colors } from "@/assets/mainColor/colors.js";
import { shadowStyles } from "@/assets/themes/style.js";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { customCard } from "../../../assets/themes/style";
export default function JoinGroupBtn() {
    const router = useRouter();
    return (
        <Pressable style={[customCard['cardNormal'], styles.inviteBtn]} onPress={() => router.push("/components/scanner")}>
            <Ionicons name="scan-outline" size={30} color={"white"} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    inviteBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 50,
        padding: 8,
        width: 50,
        alignItems: "center",
        justifyContent: "center"
    },
})