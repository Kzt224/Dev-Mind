import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/assets/mainColor/colors";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';



export default function SummaryCard({ summary }) {

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    if (!fontsLoaded) return <ActivityIndicator style={{ marginTop: 50 }} />;
    return (
        <View style={styles.container}>
            <Text style={{
                fontFamily: "Inter_700Bold",
                color: Colors.textPrimary,
                fontSize: 22
            }}>Summary</Text>
            <View style={{ flexDirection: "column" }}>
                <Text style={{ color: Colors.textSecondary, marginTop: 8, fontSize: 14 }}>
                    {summary}.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        borderRadius: 15
    },
})