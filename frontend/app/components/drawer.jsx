import { Pressable, StyleSheet, Animated, Dimensions, View, Text, ScrollView } from "react-native";
import { useDrawer } from "../hook/drawercontex";
import Feather from '@expo/vector-icons/Feather';
import { Colors } from "../../assets/mainColor/colors";
import { useEffect, useRef, useContext } from "react";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useChatStore } from "../../assets/store/chatStore";
import { useQueryClient } from '@tanstack/react-query';
import {shadowStyles} from "@/assets/themes/style.js";
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Drawer({header,saveChat,loadChat,deleteChat}) {
    const { closeDrawer, showDrawer } = useDrawer();
    const slideAnim = useRef(new Animated.Value(0)).current;
    const { deleteHistory } = useChatStore();
    const queryClient = useQueryClient();
    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: showDrawer ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [showDrawer]);
    const translateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [SCREEN_WIDTH, SCREEN_WIDTH * 0.01],
    });

    const handleLoad = (item) => {
        loadChat(item.id);
        closeDrawer();
    }

    const handleDelete = (item) => {
         deleteChat(item.id);
         closeDrawer();
    }

    // Separate history by date (Today / Yesterday)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const parseHeaderDate = (chat) => {
        if (!chat?.lastUpdated) return null;
        const v = Number(chat.lastUpdated);
        if (!Number.isNaN(v)) {
            const timestamp = v < 1e12 ? v * 1000 : v; // seconds->ms if needed
            return new Date(timestamp);
        }
        return new Date(chat.lastUpdated);
    };

    const todayChats = header?.filter(chat => {
        const chatDate = parseHeaderDate(chat);
        return chatDate && chatDate.toDateString() === today.toDateString();
    });

    const yesterdayChats = header?.filter(chat => {
        const chatDate = parseHeaderDate(chat);
        return chatDate && chatDate.toDateString() === yesterday.toDateString();
    });

    const olderChats = header?.filter(chat => {
        const chatDate = parseHeaderDate(chat);
        return chatDate && chatDate.toDateString() !== today.toDateString() && chatDate.toDateString() !== yesterday.toDateString();
    });

    return (
        <Animated.View style={[styles.container, { transform: [{ translateX }] }]}>
            <Pressable style={{ marginTop: 15 }} onPress={closeDrawer}>
                <Feather name="x" color={Colors.textPrimary} size={35} />
            </Pressable>

            {/* New Chat Button */}
            <Pressable style={styles.chatHistory} onPress={() => {
                saveChat(); 
                closeDrawer();
            }}>
                <SimpleLineIcons name="note" size={25} color={Colors.textPrimary} />
                <Text style={{ color: Colors.textPrimary, fontWeight: "bold" }}>New Chat</Text>
            </Pressable>

            <ScrollView>
                {/* Today */}
                <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 25, gap: 5 }}>
                        <View style={{ borderWidth: 0.8, borderColor: Colors.textSecondary, width: 80 }} />
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>Today</Text>
                        <View style={{ borderWidth: 0.8, borderColor: Colors.textSecondary, width: 100 }} />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        {todayChats?.length > 0 ? todayChats.map(chat => (
                            <View key={chat.id} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", margin: 5,alignItems: "center", }}>
                                <Pressable onPress={() => handleLoad(chat)}>
                                    <Text style={{ color: Colors.textPrimary, fontWeight: "bold" }}>{(chat.title).slice(0,15)}</Text>
                                </Pressable>
                                <Pressable onPress={() => {
                                    deleteHistory(chat.id).then(() => {
                                        if (chat.id === (useChatStore.getState().chatHeader || '')) {
                                            loadChat('');
                                        }
                                        queryClient.invalidateQueries({ queryKey: ['chHeader'] });
                                        // Keep drawer open so user can continue selecting a chat
                                    });
                                }}>
                                    <Feather name="x-circle" size={20} color={Colors.danger} />
                                </Pressable>
                            </View>
                        )) : (
                            <Text style={{ color: Colors.textSecondary, fontStyle: "italic" }}>No chats today</Text>
                        )}
                    </View>
                </View>

                {/* Yesterday */}
                <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 25, gap: 5 }}>
                        <View style={{ borderWidth: 0.8, borderColor: Colors.textSecondary, width: 80 }} />
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>Yesterday</Text>
                        <View style={{ borderWidth: 0.8, borderColor: Colors.textSecondary, width: 100 }} />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        {yesterdayChats?.length > 0 ? yesterdayChats.map(chat => (
                            <View key={chat.id} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", margin: 5, alignItems: "center" }}>
                                <Pressable onPress={() => handleLoad(chat)}>
                                    <Text style={{ color: Colors.textPrimary, fontWeight: "bold" }}>{chat.title}</Text>
                                </Pressable>
                                <Pressable onPress={() => handleDelete(chat)}>
                                    <Feather name="x-circle" size={20} color={Colors.danger} />
                                </Pressable>
                            </View>
                        )) : (
                            <Text style={{ color: Colors.primary, fontStyle: "italic" }}>No chats yesterday</Text>
                        )}
                    </View>
                </View>

                {/* Older */}
                <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 25, gap: 5 }}>
                        <View style={{ borderWidth: 0.8, borderColor: Colors.textSecondary, width: 80 }} />
                        <Text style={{ fontWeight: "bold", color: Colors.textPrimary }}>Older</Text>
                        <View style={{ borderWidth: 0.8, borderColor: Colors.textSecondary, width: 100 }} />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        {olderChats?.length > 0 ? olderChats.map(chat => (
                            <View key={chat.id} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", margin: 5, alignItems: "center" }}>
                                <Pressable onPress={() => handleLoad(chat)}>
                                    <Text style={{ color: Colors.textPrimary, fontWeight: "bold" }}>{chat.title}</Text>
                                </Pressable>
                                <Pressable onPress={() => handleDelete(chat)}>
                                    <Feather name="x-circle" size={20} color={Colors.danger} />
                                </Pressable>
                            </View>
                        )) : (
                            <Text style={{ color: Colors.primary, fontStyle: "italic" }}>No older chats</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        right: 0,
        height: "100%",
        width: SCREEN_WIDTH * 0.6,
        backgroundColor: Colors.bgPrimary,
        zIndex: 999,
        padding: 20,
        borderRadius: 25,
        boxShadow: shadowStyles.containerStyle.boxShadow,
    },
    chatHistory: {
        flexDirection: "row",
        marginTop: 25,
        alignItems: "center",
        gap: 20
    }
});
