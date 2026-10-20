import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { customCard } from "../../../../assets/themes/style";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "../../../../assets/mainColor/colors";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';


export default function DetailItemCard({ icon, title, value, iconStyle }) {

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    if (!fontsLoaded) return <ActivityIndicator style={{ marginTop: 50 }} />;

    return (
        <View style={styles.item}>
            <View style={iconStyle}>
                {icon}
            </View>
            <View style={{ marginLeft: 25 }}>
                <Text style={{
                    fontFamily: "Inter_400Regular",
                    color: Colors.textPrimary,
                    fontSize: 16
                }}>{title} </Text>
                <Text style={{
                    fontFamily: "Inter_400Regular",
                    color: Colors.textSecondary,
                    fontSize: 14
                }}>{value} </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row"
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    }
})