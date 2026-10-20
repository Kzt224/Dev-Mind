import { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Pressable,
} from "react-native";

import { useRouter } from "expo-router";
import { useFonts, Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";

import { Colors } from "@/assets/mainColor/colors";
import { GetIcon, getStatusBgColor, getStatusColor } from "@/assets/libs/GetIcon";
import { deleteTask } from "@/assets/api/fetchData";
import ProgressBar from "../components/progressBar";
import { useModalStore } from "@/assets/store/modalStore";
import { useAlertStore } from "@/assets/store/aleartStore";

import EditButton from "./button/editButton";
import DeleteButton from "./button/deleteButton";

import Loading from "./card/loading";
import Error from "./card/error";

import { customCard } from "@/assets/themes/style";

export default function Item({ data, useFor }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [showEditBtn, setShowEditBtn] = useState(false);
    const [showId, setShowId] = useState(null);

    const { setSuccess } = useAlertStore();
    const { openModal, setEditData } = useModalStore();

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });

    const { mutate, isPending, isError, reset } = useMutation({
        mutationFn: (id) => deleteTask(id),
        onSuccess: (data) => {
            setSuccess(data?.message);
            queryClient.refetchQueries(["project"]);
        },
    });

    if (!fontsLoaded) {
        return <ActivityIndicator style={{ marginTop: 50 }} />;
    }

    if (isPending) {
        return <Loading />;
    }

    if (isError) {
        return <Error fn={reset} />;
    }

    const handleNavigate = (item) => {
        if (!item) return;

        router.push({
            pathname: `/${useFor}Detail`,
            params: { id: JSON.parse(item.id) },
        });
    };

    const handleShowEdit = (item) => {
        setShowEditBtn(true);
        setShowId(item.id);
    };

    const handleEdit = (item) => {
        const isTask = useFor === "task";

        openModal(isTask ? "editTask" : "editProject", item.id);
        setEditData(item, isTask ? "task" : "project");
    };

    const handleDelete = (item) => {
        console.log(item)
        // if (!item) return;
        // mutate(item.id);
    };

    return (
        <View style={styles.boxContainer}>
            {data?.map((i) => (
                <TouchableOpacity
                    key={i.id}
                    onPress={() => handleNavigate(i)}
                    onLongPress={() => handleShowEdit(i)}
                    style={[
                        styles.box,
                        customCard.cardNormal,
                        { alignSelf: "flex-start" },
                    ]}
                >

                    {useFor === "project" && (
                        <ProgressBar progress={i?.progress} size={50} strokeWidth={4} />
                    )}

                    {useFor === "task" && (
                        <View style={{
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 3,
                            width: 50,
                            height: 50,
                            borderRadius: 5,
                            backgroundColor: Colors[getStatusBgColor(i?.status)]
                        }}>
                            <MaterialCommunityIcons
                                name={GetIcon(i)}
                                size={25}
                                color={Colors[getStatusColor(i)]}
                            />
                        </View>
                    )}

                    {useFor === "team" && (
                        <>
                            <View style={{
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 3,
                                width: 50,
                                height: 50,
                                borderRadius: 5,
                                backgroundColor: Colors.lightIndigo
                            }}>
                                <MaterialIcons
                                    name="group"
                                    size={25}
                                    color={Colors.primary}
                                />
                            </View>
                            <Text style={styles.subText}>{i?.totalMember} Members</Text>
                        </>
                    )}
                    <Text style={styles.title}>{i?.name}</Text>

                    {showEditBtn && showId === i.id && (
                        <View style={styles.actionRow}>
                            {i?.permission?.canEdit && (
                                <EditButton
                                    isShake
                                    item={i}
                                    handleEdit={handleEdit}
                                    size={23}
                                />
                            )}
                            {i?.permission?.canDelete && (
                                <DeleteButton
                                    isShake
                                    item={i}
                                    handleDelete={handleDelete}
                                    size={23}
                                />
                            )}
                        </View>
                    )}

                    {showEditBtn && showId === i.id && (
                        <Pressable
                            onPress={() => setShowEditBtn(false)}
                            style={styles.closeBtn}
                        >
                            <Entypo name="cross" size={20} color={Colors.white} />
                        </Pressable>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    boxContainer: {
        marginTop: 5,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        gap: 7,
        padding: 5,
    },

    box: {
        width: "48%",
        marginTop: 5,
        padding: 15,
    },

    title: {
        color: Colors.textPrimary,
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 30
    },

    subText: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: Colors.textSecondary,
        marginTop: 5
    },


    actionRow: {
        position: "absolute",
        bottom: 5,
        alignSelf: "flex-end",
        flexDirection: "row",
        gap: 5,
    },

    closeBtn: {
        position: "absolute",
        right: -1,
        top: -10,
        width: 24,
        height: 24,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
});
