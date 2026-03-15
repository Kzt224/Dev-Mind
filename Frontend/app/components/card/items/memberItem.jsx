import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { Colors } from "@/assets/mainColor/colors.js";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { shadowStyles, customCard } from "@/assets/themes/style.js";
import { useModalStore } from "@/assets/store/modalStore.js";
import { useContext } from "react";
import { AuthContext } from "../../../hook/authContex";
export default function MemberItem({ member, currentUser, permission }) {
    const { openModal } = useModalStore();
    const { user } = useContext(AuthContext);

    const handleGroupLeft = () => {
        Alert.alert("Your sure to leave group");
    }
    const getActionButtons = () => {
        if (permission.isAdmin && member?.userId !== currentUser?.id) {
            return (
                <>
                    <Pressable onPress={() => openModal('forAssignTask', member?.userId)}>
                        <MaterialIcons name="assignment-add" size={24} color={Colors.success} />
                    </Pressable>
                    <Pressable>
                        <Ionicons name="person-remove" size={24} color={Colors.danger} />
                    </Pressable>
                </>
            );
        }

        if (member.userId === currentUser.id) {
            return (
                    <Pressable onPress={handleGroupLeft}>
                        <MaterialIcons name="logout" size={24} color={Colors.danger} />
                    </Pressable>
            );
        }

        return (
            <Pressable>
                <Ionicons name="person-remove" size={24} color={Colors.danger} />
            </Pressable>
        );
    };
    //check is you
    const isYou = user?.id === member?.user?.id;
    return (
        <Pressable style={[styles.item, customCard['cardNormal']]}>
            <View style={styles.userCircle}>
                <View style={styles.userImage}>
                    <Text style={{ color: Colors.white, fontSize: 27, fontWeight: "bold" }}>
                        {member?.user?.name.slice(0, 1).toUpperCase()}
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: "column", width: "45%", gap: 4 }}>
                <Text style={{ color: Colors.textPrimary, fontWeight: "bold", fontSize: 16 }}>
                    {isYou ? "You" : member?.user?.name.slice(0, 10)} ({member?.role.toLowerCase()})
                </Text>
                <Text style={{ color: Colors.textSecondary, fontSize: 13, fontWeight: "700" }}>
                    {"Some task"} <Text style={{ fontSize: 11, fontWeight: "500" }}>{member?.joinedAt}</Text>
                </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}>
                {getActionButtons()}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    item: {
        width: "100%",
        marginTop: 15,
        padding: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 30
    },
    userCircle: {
        width: 60,
        height: 60,
        borderRadius: 100,
        backgroundColor: Colors.white,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    userImage: {
        width: 55,
        height: 55,
        borderRadius: 100,
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center"
    }
});
