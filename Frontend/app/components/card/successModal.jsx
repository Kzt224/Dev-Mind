import { Animated, Modal, Text, View } from "react-native";
import { Colors } from "@/assets/mainColor/colors.js";
import { shadowStyles } from "@/assets/themes/style.js";
import { useAlertStore } from "../../../assets/store/aleartStore";
import { useEffect, useRef } from "react";

export default function SuccessModal({ duration = 3000 }) {
    const { showSuccess, success, setClose } = useAlertStore();
    const slideAnim = useRef(new Animated.Value(50)).current; // slide from bottom
    const opacity = useRef(new Animated.Value(0)).current; // fade in/out

    useEffect(() => {
        if (showSuccess) {
            // Animate in
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();

            // Auto hide after duration
            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 50,
                        duration: 300,
                        useNativeDriver: true,
                    })
                ]).start(() => setClose());
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    if (!showSuccess) return null;

    return (
        <Modal transparent visible={showSuccess} animationType="none">
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Animated.View
                    style={{
                        transform: [{ translateY: slideAnim }],
                        opacity,
                        width: "90%",
                        height: "9%",
                        position: "absolute",
                        bottom: 90,
                        backgroundColor: Colors.bgSuccess,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 5,
                        boxShadow: shadowStyles.containerStyle.boxShadow,
                    }}
                >
                    <Text style={{ color: Colors.success, fontWeight: "bold" }}>
                        {success || "Success!"}
                    </Text>
                </Animated.View>
            </View>
        </Modal>
    );
}
