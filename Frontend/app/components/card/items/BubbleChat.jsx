import { Text, View } from "react-native";
import { customCard } from "@/assets/themes/style.js";
import { Colors } from "../../../../assets/mainColor/colors";

export default function BubbleChat({ message }) {
    const user = message?.user?.name === "User";
    const ai = message?.user?.name === "AI";

    return (
        <View style={{ flexDirection: "column" }}>
            {ai && (
                <View style={{
                    width: 28,
                    height: 28,
                    borderRadius: 15,
                    backgroundColor: Colors.white,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style={{ color: Colors.textPrimary }}>AI</Text>
                </View>
            )}
            <View style={[customCard['cardNormal'],
            {
                width: "auto",
                padding: 10,
                margin: 5,
                marginLeft: ai ? 8 : '',
                marginHorizontal: 10,
                alignSelf: user ? "flex-end" : "flex-start"
            }]}>
                <View style={{ width: "85%" }}>
                    <Text style={{ color: Colors.textPrimary }}>{message?.text}</Text>
                </View>
            </View>
        </View>

    );
}