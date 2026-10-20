import { Pressable, StyleSheet, Text } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Colors } from "@/assets/mainColor/colors.js";
import { useModalStore } from "../../../assets/store/modalStore.js";
import { customCard, shadowStyles } from "@/assets/themes/style.js";
import { usePathname } from "expo-router";

export default function AddButton({ name, icName, id, text = "", size = 20 }) {
    const { openModal, closeModal } = useModalStore();
    const pathname = usePathname();

    const generateName = () => {
        if (!name) return;
        let temp = '';
        if (name === "forProject") temp = "Project";
        if (name === "forTask") temp = "Task";
        if (name === 'forTeam') temp = "Group";
        return temp;
    }

    return (
        <Pressable style={[customCard['cardNormal'], styles.addBtn]} onPress={() => openModal(name, id)}>
            {!['/project', '/task'].includes(pathname) && (
                <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>
                    {text ? text : "Create new"} {generateName(name)}
                </Text>
            )}
            <AntDesign name={icName ? icName : "plus"} size={size} color={"white"} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    addBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 50,
        padding: 10,
        flexDirection: "row",
        gap: 8,
        alignItems: "center"
    },
})