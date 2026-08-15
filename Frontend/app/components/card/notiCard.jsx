import { View, Text, StyleSheet, TouchableOpacity, Animated, Pressable } from "react-native";
import { customCard, dvmBtn, shadowStyles } from "../../../assets/themes/style";
import { Colors } from "../../../assets/mainColor/colors";
import { formatDistanceToNow } from "date-fns";
import { useRef, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendGroupJoinFeekback } from "@/assets/api/fetchData.js";

export default function NotiCard({ item, onRead, selected, setSelected, selectMode, setSelectMode }) {
    const animation = useRef(new Animated.Value(100)).current;
    const [expanded, setExpanded] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data) => sendGroupJoinFeekback(data),
        onSuccess: () => {
            queryClient.refetchQueries(['notification']);
        },
    });

    const toggleExpand = () => {
        if (!item?.read) {
            onRead(item?.id);
        }
        setSelectMode(false);
        if (item.type !== 'REQUEST') return;
        if (item.isAction) return;
        const next = !expanded;

        Animated.timing(animation, {
            toValue: next ? 180 : 100,
            duration: 400,
            useNativeDriver: false,
        }).start();

        setExpanded(next);
    };

    const handleMode = () => {
        if (selectMode) {
            setSelected(prev => {
                if (prev.includes(item.id)) {
                    const next = prev.filter(id => id !== item.id);
                    if (next.length === 0) setSelectMode(false);
                    return next;
                }
                return [...prev, item.id];
            });
            return;
        }
        toggleExpand();
    };

    const handleSelect = () => {
        setSelectMode(true);
        setSelected(prev => {
            if (prev.includes(item.id)) return prev;
            return [...prev, item.id];
        });
    };

    const handleStatus = (status) => {
        const data = {
            status,
            info: item?.info,
            requestId: item?.requestId || ''
        };
        mutation.mutate(data);
    };
    const isSelected = selected.includes(item.id);
    return (
        <View>
            <Animated.View
                style={[
                    { height: animation },
                    [styles.animate, customCard['cardNormal']],
                    isSelected && { backgroundColor: Colors.lightIndigo }
                ]}
            >
                <TouchableOpacity onPress={handleMode} onLongPress={handleSelect}>
                    <View style={[styles.noti]}>
                        <View style={styles.icon}>
                            <Feather name="mail" size={30} color={Colors.primary} />
                        </View>
                        <View style={styles.notiLeft}>
                            <Text style={{ color: Colors.textPrimary, fontWeight: "bold", fontSize: 13.4 }}>
                                {item.header}
                            </Text>

                            <View style={{ width: "90%", marginTop: 5 }}>
                                <Text style={{ color: Colors.textSecondary }}>{item.body}</Text>

                                <View style={styles.timeRow}>
                                    <Text style={{ color: Colors.success, fontSize: 12 }}>
                                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                    </Text>

                                    {item.type === 'REQUEST' && (
                                        <Feather name="chevrons-down" size={22} color={Colors.primary} />
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {expanded && item.type === 'REQUEST' && !selectMode && (
                    <View style={styles.btnContainer}>
                        <Pressable
                            disabled={item?.isAction}
                            style={[dvmBtn.btnPrimary,
                            { backgroundColor: Colors.primary }
                            ]}
                            onPress={() => handleStatus('ACCEPTED')}
                        >
                            <Text style={{ color: Colors.white, fontWeight: "bold" }}>
                                {mutation.isPending ? "Acceipting" : "Accept"}
                            </Text>
                        </Pressable>

                        <Pressable
                            style={dvmBtn.btnWhite}
                            onPress={() => handleStatus('REJECTED')}
                            disabled={item?.isAction}
                        >
                            <Text style={{ color: Colors.reject, fontWeight: "bold" }}>
                                {mutation.isPending ? "Rejecting" : "Reject"}
                            </Text>
                        </Pressable>
                    </View>
                )}
            </Animated.View>

            {!item.read && <View style={styles.dot} />}
        </View>
    );
}

const styles = StyleSheet.create({
    animate: {
        marginTop: 20,
        padding: 10,
        gap: 20,
        overflow: "hidden",
        boxSizing: "border-box",
    },
    noti: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        gap: 30
    },
    icon: {
        width: 50,
        height: 50,
        backgroundColor: Colors.gray,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    notiLeft: {
        flexDirection: "column",
        padding: 3
    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2
    },
    dot: {
        position: "absolute",
        width: 12,
        height: 12,
        borderRadius: 50,
        backgroundColor: Colors.warning,
        right: 0,
        top: 15
    },
    btnContainer: {
        marginLeft: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "65%",
        alignSelf: "center"
    },
});
