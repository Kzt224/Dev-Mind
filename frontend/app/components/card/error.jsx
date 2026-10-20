import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/assets/mainColor/colors.js";
import Entypo from '@expo/vector-icons/Entypo';
import { customCard, dvmBtn, shadowStyles } from "@/assets/themes/style";

export default function Error({ message, fn }) {
    return (
        <Modal
            transparent={true}
            visible={true}
        >
            <View style={styles.overlay}>
                <View style={[{
                    width: "90%", height: "13%",
                    backgroundColor: Colors.white,
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    borderRadius: 5,
                    display: "flex",
                    flexDirection: "column"

                }, customCard['cardNormal']]}>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center"
                    }}>
                        <Entypo name="warning" size={24} color={Colors.danger} />
                        <Text style={{ color: Colors.red, fontWeight: "bold" }}>{message || "Time Out. Please try again..."}</Text>
                    </View>
                    <Pressable style={[styles.saveButton, dvmBtn['btnPrimary']]} onPress={fn}>
                        <Text style={{ fontWeight: "bold", color: Colors.white }}>
                            Try Again
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    saveButton: {
        width: 100,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)"
    },
})