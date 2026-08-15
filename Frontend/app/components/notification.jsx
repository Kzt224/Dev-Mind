import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Colors } from "@/assets/mainColor/colors.js";
import { getNotification, updateReadedNoti, deleteNoti } from "@/assets/api/fetchData";
import Loading from "./card/loading";
import Error from "./card/error";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NotiCard from "./card/notiCard";
import { useContext, useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAlertStore } from "../../assets/store/aleartStore";
import { useNavBarHeight } from "../hook/navHeighContex.jsx";
import { LanguageContext } from "../hook/languageContex.jsx";


export default function NotiFication() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    const { t } = useContext(LanguageContext);
    const { NavBarHeight } = useNavBarHeight();
    const { setSuccess, setError } = useAlertStore();
    const [selectMode, setSelectMode] = useState(false);
    const [selected, setSelected] = useState([]); const queryClient = useQueryClient();
    const { data: noti, isLoading, isError } = useQuery({
        queryKey: ['notification'],
        queryFn: () => getNotification(),
    });

    const mutation = useMutation({
        mutationFn: (id) => updateReadedNoti(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['notification'] });
            const previousNotifications = queryClient.getQueryData(['notification']);
            queryClient.setQueryData(['notification'], (old = []) =>
                old.map((noti) =>
                    noti.id === id ? { ...noti, is_read: true } : noti
                )
            );
            return { previousNotifications };
        },
        onError: (err, id, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(['notification'], context.previousNotifications);
            }
            console.error("Failed to update notification:", err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['notification'] });
        },
    });
    const mutationDelete = useMutation({
        mutationFn: (ids) => deleteNoti(ids),
        onMutate: async (ids) => {
            await queryClient.cancelQueries({ queryKey: ['notification'] });
            const previousNotifications = queryClient.getQueryData(['notification']);

            queryClient.setQueryData(['notification'], (old = []) =>
                old.filter((n) => !ids.includes(n.id))
            );

            return { previousNotifications };
        },
        onSuccess: (data) => {
            setSuccess(data?.message || "Deleted successfully");
            setSelected([]); // Clear selection
            setSelectMode(false);
        },
        onError: (error, ids, context) => {
            setError(error?.message || "Delete failed");
            if (context?.previousNotifications) {
                queryClient.setQueryData(['notification'], context.previousNotifications);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['notification'] });
        },
    });

    const handleDelete = () => {
        if (!selected && selected.length < 0) {
            return;
        }
        mutationDelete.mutate(selected);
    }
    return (
        <View style={{
            flex: 1,
            padding: 15,
            backgroundColor: Colors.bgPrimary,
        }}>
            <View style={{
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                display: "flex",
            }}>
                <Text style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 20, color: Colors.textPrimary, fontWeight: "bold"
                }}>{t["Notifications"]}</Text>
                {selectMode && (
                    <Pressable onPress={handleDelete}>
                        <FontAwesome name="trash" size={24} color={Colors.danger} />
                    </Pressable>
                )}
            </View>
            {/* loading */}
            {(!fontsLoaded || isLoading || mutation.isPending) && <Loading />}
            {/* error */}
            {isError && <Error />}
            {/* main loop all noti */}
            <ScrollView style={styles.notiParent} showsVerticalScrollIndicator={false}>
                {noti && noti?.map((not) => (
                    <NotiCard
                        key={not?.id}
                        item={not}
                        onRead={(i) => mutation.mutate(i)}
                        selected={selected}          // parent array
                        setSelected={setSelected}
                        setSelectMode={setSelectMode}    // parent setter
                        selectMode={selected.length > 0} // derived
                    />))}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    notiParent: {
        display: "flex",
        flexDirection: "column",
    },
})