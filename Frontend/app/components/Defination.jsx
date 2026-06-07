import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { customCard, shadowStyles } from "../../assets/themes/style";
import { Colors } from "../../assets/mainColor/colors";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useContext } from "react";
import { LanguageContext } from "../hook/languageContex";


export default function Defination() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    const {t} = useContext(LanguageContext);
    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color={Colors.primary} />;
    }
    return (
        <View style={[styles.Container,customCard['cardNormal']]}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 50
            }}>
                <View style={{ backgroundColor: Colors.processing, width: 90, height: 30, borderRadius: 5 }}></View>
                <View style={{ display: "flex", flexDirection: "row", gap: 15, alignItems: "center" }}>
                    <Text style={{ fontFamily: "Inter_400Regular", color: Colors.textSecondary, fontSize: 18, }}>
                        {t["Processing"]}
                    </Text>
                    <MaterialCommunityIcons name="progress-clock" size={25} color={Colors.processing} />
                </View>
            </View>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 50
            }}>
                <View style={{ backgroundColor: Colors.waiting, width: 90, height: 30, borderRadius: 5 }}></View>
                <View style={{ display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
                    <Text style={{ fontFamily: "Inter_400Regular", color: Colors.textSecondary, fontSize: 18, }}>
                        {t["Waiting"]}
                    </Text>
                    <MaterialCommunityIcons name="timer-sand" size={25} color={Colors.waiting} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        marginTop: 15,
        display: "flex",
        flexDirection: "column",
        padding: 20,
        gap: 30
    }
})