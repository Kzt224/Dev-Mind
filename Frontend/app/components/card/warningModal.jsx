import { Animated, Modal, Text, View } from "react-native";
import { Colors } from "@/assets/mainColor/colors.js";
import { shadowStyles } from "@/assets/themes/style.js";
import { useAlertStore } from "../../../assets/store/aleartStore";
import { useEffect, useRef } from "react";
import Entypo from '@expo/vector-icons/Entypo';

export default function WarningModal({ duration = 3000 }) {
    const { showError, error, setClose } = useAlertStore();
    const slideAnim = useRef(new Animated.Value(50)).current; // slide from bottom
    const opacity = useRef(new Animated.Value(0)).current; // fade in/out

    useEffect(() => {
        if (showError) {
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
    }, [showError]);

    if (!showError) return null;

    return (
        <Modal transparent visible={showError} animationType="none">
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Animated.View
                    style={{
                        transform: [{ translateY: slideAnim }],
                        opacity,
                        width: "90%",
                        height: "9%",
                        position: "absolute",
                        bottom: 90,
                        backgroundColor: Colors.bgInfo,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 5,
                        boxShadow: shadowStyles.containerStyle.boxShadow,
                    }}
                >
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center"
                    }}>
                        <Entypo name="warning" size={24} color={Colors.white} />
                        <Text style={{ color: Colors.white,fontWeight: "bold" }}>{error || "Something Wrong..."}</Text>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}
