import { useEffect, useState, useCallback, useContext } from "react";
import { View, StyleSheet, Pressable, Alert, Image, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../assets/mainColor/colors";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from "expo-image-picker";
import { useDrawer } from "./hook/drawercontex.jsx";
import Drawer from "./components/drawer";
import { useChatStore } from "../assets/store/chatStore.js";
import Loading from "./components/card/loading.jsx";
import Error from "./components/card/error.jsx";
import { getAllChats, deleteChatsById } from "@/assets/db/chatHeader.model.js";
import { getMessagesByChatsId, deleteMessagesById } from "@/assets/db/messages.model.js";
import { AuthContext } from "./hook/authContex.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventSourcePolyfill } from "event-source-polyfill";
import { shadowStyles, customCard } from "@/assets/themes/style.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {GiftedChat} from 'react-native-gifted-chat';
export default function Chat() {
    const { closeDrawer, showDrawer } = useDrawer();
    const { user } = useContext(AuthContext);
    const { sentMessage, chatHeader } = useChatStore();
    const [messages, setMessages] = useState([]);
    const [image, setImage] = useState(null);
    const [inputText, setInputText] = useState('');
    const generateId = () => Date.now() + Math.floor(Math.random() * 1000);
    const queryClient = useQueryClient();
    const { data: chHeader, isLoading, isError } = useQuery({
        queryKey: ['chHeader'],
        queryFn: async () => {
            if (!user?.id) return [];
            const data = await getAllChats(user.id);
            return data ?? [];
        },
    });

    useEffect(() => {
        if (!messages.length) {
            setMessages([{
                _id: 1,
                text: "Hello! what I assist today!.",
                createdAt: new Date(),
                user: { _id: 2, name: "AI" },
            }]);
        }
    }, []);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission required", "Please allow gallery access in settings.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) setImage(result.assets[0].uri);
    };

    const streamAI = async (aiId, userMessage, headerId, contextString) => {
        const config = await AsyncStorage.getItem("config");
        const parsed = JSON.parse(config || '{}');
        const DEV_MIND_API = parsed?.API_URL;
        const token = await AsyncStorage.getItem("Token");

        // append contextString to the content if provided
        const fullContent = contextString ? `${contextString}\nUser: ${userMessage}` : userMessage;
        const url = `${DEV_MIND_API}/api/message/chat/stream?aiId=${aiId}&content=${encodeURIComponent(fullContent)}`;

        const es = new EventSourcePolyfill(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        let aiResponse = '';
        es.onmessage = (e) => {
            if (e.data === "[END]") {
                es.close();
                // use provided headerId (from stored user message) to save AI response
                const targetHeader = headerId || chatHeader;
                sentMessage(aiResponse, "ai", targetHeader).catch(dbError => {
                    console.error("DB SAVE FAILED:", dbError);
                });
                return;
            }

            const token = e.data.replace(/^"|"$/g, '');
            aiResponse += token;

            setMessages(prev =>
                prev.map(msg =>
                    msg._id === aiId ? { ...msg, text: msg.text + token } : msg
                )
            );
        };

        es.onerror = (err) => {
            console.error("SSE ERROR:", err);
            es.close();
        };
    };

    const mutation = useMutation({
        mutationFn: () => { },
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['chHeader'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await deleteMessagesById(id);
            await deleteChatsById(id);
        },
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['chHeader'] });
        }
    });

    const saveChat = () => {
        setMessages([]);
        mutation.mutate();
        useChatStore.setState({ chatHeader: "" }); // fixed key
    }

    const handleLoadChat = useCallback(async (id) => {
        if (!id) return;
        useChatStore.setState({ chatHeader: id });
        const res = await getMessagesByChatsId(id);

        const formatted = res.map(m => ({
            _id: m.id,
            text: m.content,
            createdAt: new Date(m.createdAt * 1000),
            user: {
                _id: String(m.sender_id) === String(user.id) ? user.id : 2,
                name: String(m.sender_id) === String(user.id) ? "You" : "AI"
            }
        }));
        setMessages(formatted);
    }, [user.id]);

    const handleDelete = useCallback(async (id) => {
        deleteMutation.mutate(id);
    }, [deleteMutation]);

    const onSend = useCallback(async (newMessages = []) => {
        const updatedMessages = newMessages.map(msg => ({
            ...msg,
            _id: generateId(),
            image: image || '',
        }));

        setMessages(prev => GiftedChat.append(prev, updatedMessages));
        // ensure user message is persisted and get header id
        const headerId = await sentMessage(updatedMessages, "", chatHeader);
        setImage(null);

        // AI placeholder
        const aiId = generateId();
        setMessages(prev => GiftedChat.append(prev, {
            _id: aiId,
            text: "",
            createdAt: new Date(),
            user: { _id: 2, name: "AI" },
        }));

        // prepare memory/context: fetch last messages (excluding the one we just saved)
        let contextString = '';
        try {
            const allMsgs = await getMessagesByChatsId(headerId);
            const previous = Array.isArray(allMsgs) ? allMsgs.slice(1) : [];
            const lastN = previous.slice(0, 3).reverse(); // take last 3 in chronological order
            contextString = lastN.map(m => (m.type === 'ai' || m.sender_id === 'ai') ? `AI: ${m.content}` : `User: ${m.content}`).join('\n');
        } catch (err) {
            console.error('Failed to load previous messages for context:', err);
        }

        streamAI(aiId, updatedMessages[0].text, headerId, contextString);
    }, [image, chatHeader]);

    if (isLoading) return <Loading />;
    if (isError) return <Error />;

    return (
        <>
            {showDrawer && <Pressable style={[StyleSheet.absoluteFill, { zIndex: 1 }]} onPress={closeDrawer}><View style={{ flex: 1 }} /></Pressable>}
            <Drawer onNewChat={() => setMessages([])} header={chHeader} saveChat={saveChat} loadChat={handleLoadChat} deleteChat={handleDelete} />

            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: Colors.bgPrimary }}>
                    <GiftedChat
                        messages={messages}
                        onSend={onSend}
                        user={{ _id: user.id }}
                        isKeyboardInternallyHandled={false}
                        disableKeyboardAccessory={true}
                        forceGetKeyboardHeight={true}
                        renderBubble={(props) => (
                            <Bubble
                                {...props}
                                wrapperStyle={{
                                    right: [customCard['cardNormal'], { margin: 10 }],
                                    left: customCard['cardNormal']
                                }}
                                textStyle={{
                                    right: { color: Colors.textSecondary, fontWeight: "bold" },
                                    left: { color: Colors.textSecondary, fontWeight: "bold" },
                                }}
                            />
                        )}
                        renderInputToolbar={(props) => (
                            <>
                                <InputToolbar {...props} containerStyle={[styles.toolbar, customCard['cardNormal']]} textInputStyle={{ color: Colors.textSecondary }} />
                                <Pressable onPress={pickImage} style={{ position: "absolute", bottom: 25, left: 10 }}>
                                    <AntDesign name="plus" size={25} color={Colors.textPrimary} />
                                </Pressable>
                                <Pressable style={{ position: "absolute", bottom: 25, left: 50 }}>
                                    <FontAwesome name="microphone" size={22} color={Colors.textPrimary} />
                                </Pressable>
                                {image && (
                                    <>
                                        <View style={{ position: "absolute", bottom: 60, width: 100, height: 100, backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 15, alignItems: "center", justifyContent: "center" }}>
                                            <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 15 }} />
                                        </View>
                                        <Pressable onPress={() => setImage(null)} style={{ position: "absolute", bottom: 130, left: 70, backgroundColor: "#ddd", borderRadius: 50 }}>
                                            <Feather name="x-circle" size={23} color={Colors.textPrimary} />
                                        </Pressable>
                                    </>
                                )}
                            </>
                        )}
                        renderSend={(props) => (
                            <Send {...props} containerStyle={{ width: 50 }}>
                                <Feather name="send" size={23} color={Colors.textPrimary} style={{ marginBottom: 10, marginEnd: 5 }} />
                            </Send>
                        )}
                        textInputProps={{ placeholderTextColor: Colors.textSecondary }}
                    />
                </SafeAreaView>
            </SafeAreaProvider>
        </>
    );
}

const styles = StyleSheet.create({
    toolbar: {
        position: "relative",
        marginBottom: 6,
        padding: 5,
        paddingLeft: 100,
        marginTop: 15,
    },
});
