import { useEffect, useState, useCallback, useContext } from "react";
import { FlatList, KeyboardAvoidingView, StyleSheet, View, Platform, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/assets/mainColor/colors";
import Drawer from "./components/drawer";
import BubbleChat from "./components/card/items/BubbleChat";
import ChatInput from "./components/card/items/ChatInput";
import { useDrawer } from "./hook/drawercontex";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllChats, deleteChatsById } from "@/assets/db/chatHeader.model.js";
import { getMessagesByChatsId, deleteMessagesById } from "@/assets/db/messages.model.js";
import { useChatStore } from "@/assets/store/chatStore";
import { AuthContext } from "./hook/authContex.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useNavBarHeight } from "./hook/navHeighContex.jsx";

export default function Chat() {

    const { closeDrawer, showDrawer } = useDrawer();
    const { user } = useContext(AuthContext);
    const { sentMessage, chatHeader } = useChatStore();
    const { NavBarHeight } = useNavBarHeight();

    const [messages, setMessages] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const queryClient = useQueryClient();

    const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const { data: chHeader, isLoading, isError } = useQuery({
        queryKey: ['chHeader', user?.id],
        enabled: !!user?.id,
        queryFn: async () => {
            if (!user?.id) return [];
            const data = await getAllChats(user.id);
            return data ?? [];
        },
    });

    useEffect(() => {

        setMessages([
            {
                _id: generateId(),
                text: "Hello! what I assist today!.",
                createdAt: new Date(),
                user: { _id: 2, name: "AI" },
            },
        ]);

    }, [])


    // ================= STREAM AI =================

    const streamAI = async (aiId, userMessage, headerId) => {

        setIsStreaming(true);

        const config = await AsyncStorage.getItem("config");
        const parsed = JSON.parse(config || '{}');

        const DEV_MIND_API = parsed?.API_URL;
        const token = await AsyncStorage.getItem("Token");

        const url =
            `${DEV_MIND_API}/api/message/chat/stream?content=${encodeURIComponent(userMessage)}`;

        const es = new EventSourcePolyfill(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        let aiResponse = '';
        let buffer = '';
        let lastRender = Date.now();

        const flushBuffer = () => {
            if (!buffer) return;
            const chunk = buffer;
            buffer = '';

            setMessages(prev =>
                prev.map(msg =>
                    msg._id === aiId
                        ? { ...msg, text: msg.text + chunk }
                        : msg
                )
            );
        };

        es.onmessage = (e) => {
            if (e.data === "[END]") {
                es.close();

                if (buffer) flushBuffer();
                setIsStreaming(false);

                sentMessage(aiResponse, "ai", headerId, user?.id).then(() => {
                    queryClient.invalidateQueries({ queryKey: ['chHeader', user?.id] });
                }).catch(err => console.log("Error saving AI message:", err));

                return;
            }

            const tokenText = e.data.replace(/^"|"$/g, '');
            aiResponse += tokenText;
            buffer += tokenText;

            const now = Date.now();
            if (now - lastRender >= 80) {
                flushBuffer();
                lastRender = now;
            }
        };
        es.onerror = (err) => {
            console.log("SSE ERROR", err);
            es.close();
            setIsStreaming(false);
        };

    };

    // ================= SEND MESSAGE =================

    const handleSend = async (text) => {

        if (!text || isStreaming) return;

        const userMessage = {
            _id: generateId(),
            text,
            createdAt: new Date(),
            user: { _id: user.id, name: "User" }
        };

        setMessages(prev => [userMessage, ...prev]);

        const headerId = await sentMessage(text, "user", chatHeader, user?.id);
        queryClient.invalidateQueries({ queryKey: ['chHeader', user?.id] });

        const aiId = generateId();

        const aiMessage = {
            _id: aiId,
            text: "",
            createdAt: new Date(),
            user: { _id: 2, name: "AI" }
        };

        setMessages(prev => [aiMessage, ...prev]);

        streamAI(aiId, text, headerId || chatHeader);

    };


    // ================= DELETE CHAT =================

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await deleteMessagesById(id);
            await deleteChatsById(id);
        },
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['chHeader'] });
        }
    });

    const handleDelete = useCallback((id) => {
        deleteMutation.mutate(id);
    }, []);


    // ================= LOAD CHAT =================

    const handleLoadChat = useCallback(async (id) => {

        if (!id) return;

        useChatStore.setState({ chatHeader: id });

        const res = await getMessagesByChatsId(id);
        res.reverse();
        const formatted = res.map(m => ({
            _id: `db-${m.id}`,
            text: m.content,
            createdAt: new Date(m.createdAt * 1000),
            user: {
                _id: String(m.sender_id) === String(user.id) ? user.id : 2,
                name: String(m.sender_id) === String(user.id) ? "User" : "AI"
            }
        }));

        setMessages(formatted.reverse());

    }, [user.id]);


    // ================= SAVE CHAT =================

    const saveChat = () => {
        setMessages([]);
        useChatStore.setState({ chatHeader: "" });
        queryClient.invalidateQueries({ queryKey: ['chHeader', user?.id] });
    };


    // ================= UI =================

    return (

        <>

            {showDrawer &&
                <Pressable
                    style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
                    onPress={closeDrawer}>
                    <View style={{ flex: 1 }} />
                </Pressable>
            }

            <Drawer
                header={chHeader}
                saveChat={saveChat}
                loadChat={handleLoadChat}
                deleteChat={handleDelete}
            />

            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >

                    <FlatList
                        style={{marginTop: NavBarHeight}}
                        data={messages}
                        inverted
                        keyExtractor={(item) => item._id.toString()}
                        contentContainerStyle={{ paddingVertical: 10 }}
                        renderItem={({ item }) => (
                            <BubbleChat message={item} />
                        )}
                    />

                    {isStreaming && (
                        <View style={{ padding: 8, alignItems: 'center' }}>
                            <Text style={{ color: Colors.textSecondary }}>AI is typing...</Text>
                        </View>
                    )}

                    <ChatInput onSend={handleSend} disabled={isStreaming} />

                </KeyboardAvoidingView>

            </SafeAreaView>

        </>

    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.bgPrimary
    }
});