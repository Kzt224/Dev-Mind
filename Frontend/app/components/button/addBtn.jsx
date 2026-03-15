import { Pressable, StyleSheet } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import { Colors } from "@/assets/mainColor/colors.js";
import { useModalStore } from "../../../assets/store/modalStore.js";
import { customCard, shadowStyles } from "@/assets/themes/style.js";

export default function AddButton({ name,icName,id }) {
    const { openModal, closeModal } = useModalStore();
    return (
        <Pressable style={[styles.addBtn,customCard['cardNormal']]} onPress={() => openModal(name,id)}>
            <Octicons name={icName ? icName: "plus-circle"} size={35} color={Colors.textPrimary} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    addBtn: {
        position: "absolute",
        right: 30,
        bottom: 140,
        backgroundColor: Colors.white,
        borderRadius: 15,
        padding: 7,
    },
})