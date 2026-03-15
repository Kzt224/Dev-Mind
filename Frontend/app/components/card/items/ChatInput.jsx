import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "@/assets/mainColor/colors";
import { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from '@expo/vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';

export default function ChatInput({ onSend, disabled }) {
    const [focus, setFocus] = useState(false);
    const [image, setImage] = useState(null);
    const [text, setText] = useState("");

    const sendMessage = () => {
        if (disabled || !text.trim()) return;

        onSend(text);

        setText("");
    };
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
    return (
        <View style={styles.inputContainer}>
            {!focus && (
                <>
                    <Pressable onPress={pickImage}>
                        <AntDesign name="plus" size={25} color={Colors.textPrimary} />
                    </Pressable>
                    <Pressable>
                        <FontAwesome name="microphone" size={22} color={Colors.textPrimary} />
                    </Pressable>
                    <Pressable>
                        <Entypo name="emoji-happy" size={22} color={Colors.textPrimary} />
                    </Pressable>
                </>
            )}
            <TextInput
                style={styles.input}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                value={text}
                onChangeText={setText}
                placeholder="Type to chat with ai..."
                placeholderTextColor={Colors.textSecondary}
            />
            <Pressable onPress={sendMessage}
                style={{
                    position: "absolute",
                    right: 15,
                    top: 20,
                    opacity: disabled ? 0.4 : 1
                }}>
                <Feather name="send" size={23} color={disabled ? Colors.textSecondary : Colors.textPrimary} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        paddingVertical: 8,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 15,
        padding: 5
    },
    input: {
        backgroundColor: Colors.white,
        padding: 17,
        borderRadius: 15,
        position: "relative",
        flex: 1,
        color: Colors.textPrimary
    }
});