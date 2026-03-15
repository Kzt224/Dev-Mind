import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/assets/mainColor/colors.js";
import { customCard, shadowStyles } from "@/assets/themes/style.js";

export default function Loading() {
    return (
        <Modal
            transparent={true}
            visible={true}
        >
            <View style={styles.overlay}>
                <View style={[customCard['cardNormal'],{
                    width: "90%", height: "12%",
                    backgroundColor: Colors.white,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "row",
                    gap: 20,
                }]}>
                    <ActivityIndicator size={35} color={Colors.primary} />
                    <Text style={{ color: Colors.primary }}>Loading. Please wait...</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)"
    },
})