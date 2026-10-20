import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRef } from "react";
import { Animated, Pressable, Text } from "react-native";
import { Colors } from "../../../assets/mainColor/colors";


export default function EditButton({ item, isShake, handleEdit, size }) {

    const shake = useRef(new Animated.Value(0)).current;

    const startShake = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shake, { toValue: -3, duration: 100, useNativeDriver: true }),
                Animated.timing(shake, { toValue: 3, duration: 100, useNativeDriver: true }),
            ])
        ).start();
    };
    if (isShake) {
        startShake();
    }
    return (
        <Pressable style={{ width: "100%", padding: 1 }} onPress={() => handleEdit(item)}>
            <Animated.View style={{
                flexDirection: "row",
                gap: 5,
                transform: [{
                    rotate: shake.interpolate({
                        inputRange: [-3, 3],
                        outputRange: ["-3deg", "3deg"],
                    })
                }]
            }}>
                <FontAwesome name="edit" size={size ? size : 30} color={Colors.warning} style={{ marginRight: 5 }} />
                <Text style={{ color: Colors.warning, fontWeight: "bold" }}>Edit</Text>
            </Animated.View>
        </Pressable>
    );
}