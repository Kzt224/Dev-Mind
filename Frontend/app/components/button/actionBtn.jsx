import Entypo from "@expo/vector-icons/Entypo";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../assets/mainColor/colors";
import { act, useState } from "react";
import { customCard } from "../../../assets/themes/style";
import DeleteButton from "./deleteButton";
import EditButton from "./editButton";
import { useModalStore } from "@/assets/store/modalStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/assets/api/fetchData";
import Loading from "../card/loading";
import Error from "../card/error";
import { useAlertStore } from "@/assets/store/aleartStore";


export default function ActionButton({ item, activeId, useFor, onToggle, showAction }) {

    const { openModal, setEditData } = useModalStore();
    const isShow = activeId == item?.id;
    const { setSuccess } = useAlertStore();
    const queryClient = useQueryClient();
    const { mutate, isPending, isError, reset } = useMutation({
        mutationFn: (id) => deleteTask(id),
        onSuccess: (data) => {
            setSuccess(data?.message);

            queryClient.invalidateQueries(["project"]);
            queryClient.invalidateQueries(["tasks"]);
        },
    });

    const handleEdit = (item) => {
        const isTask = useFor === "task";
        openModal(isTask ? "editTask" : "editProject", item.id);
        setEditData(item, isTask ? "task" : "project");
    };
    const handleDelete = (item) => {
        if (!item) return;
        mutate(item.id);
    };

    if (isPending) {
        return <Loading />;
    }
    if (isError) {
        return <Error fn={reset} />;
    }
    const isOwner = item?.permission?.isOwner ?? false;
    const canDelete = item?.permission?.canDelete ?? false;
    const canEdit = (item?.permission?.partialEdit || item?.permission?.canEdit) ?? false;
    const editSwitch = (canEdit && useFor === "task") || (isOwner && useFor === 'project');
    return (
        <>
            <Pressable style={styles.btn} onPress={onToggle}>
                <Entypo name="dots-three-vertical" size={20} color={Colors.textPrimary} />
            </Pressable>
            {/* action bobx */}
            {(isShow) && (
                <View style={[styles.actionBox, customCard['cardNormal']]}>
                    {(isOwner && canDelete) && (
                        <View style={styles.item}>
                            <DeleteButton item={item} isShake={false} handleDelete={handleDelete} size={20} />
                        </View>
                    )}
                    {editSwitch && (
                        <View style={styles.item}>
                            <EditButton item={item} isShake={false} handleEdit={handleEdit} size={20} />
                        </View>
                    )}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    btn: {
        position: "relative",
        width: "15%",
        alignItems: "flex-end",
        padding: 4
    },
    actionBox: {
        position: "absolute",
        width: "40%",
        flexDirection: "column",
        right: 20,
        zIndex: 5,
        backgroundColor: Colors.bgPrimary,
        alignItems: "center",
        justifyContent: "center",
    },
    item: {
        borderBottomWidth: 1,
        borderBottomEndRadius: 15,
        borderBottomLeftRadius: 15,
        borderColor: Colors.gray,
        width: "100%",
        padding: 10,
        flexDirection: "row",
        gap: 5
    }
})