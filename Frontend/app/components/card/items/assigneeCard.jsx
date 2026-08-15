import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/assets/mainColor/colors";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { customCard } from "@/assets/themes/style";
import tepImage from "@/assets/images/bgImages/applogo.png";
import { useAlertStore } from "@/assets/store/aleartStore";

export default function AssngineeCard({ item }) {

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    const { onlineUsers } = useAlertStore();

    if (!fontsLoaded) return <ActivityIndicator style={{ marginTop: 50 }} />;
    return (
        <View style={{ width: "100%", flexDirection: "column", marginTop: 30 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{
                    fontFamily: "Inter_400Regular",
                    color: Colors.textPrimary,
                    fontSize: 20
                }}>{(item && item?.length > 1) ? "Project collabrators" : "Assigneee person profile"}</Text>
                {(item && item?.length > 2) && (
                    <Pressable >
                        <Text style={{ color: Colors.primary }}>See All</Text>
                    </Pressable>
                )}
            </View>
            {(item && item[0] !== undefined) && item?.slice(0, 2)?.map((i) => (
                <View key={i?.id} style={[styles.profileContainer, customCard['cardNormal']]}>
                    <View style={styles.leftContainer}>
                        <View style={styles.imageContainer}>
                            <Image source={tepImage} style={{ width: 45, height: 45, borderRadius: 50 }} />
                        </View>
                        <View style={styles.nameContainer}>
                            <Text style={{
                                fontFamily: "Inter_400Regular",
                                color: Colors.textPrimary,
                                fontSize: 18
                            }}>{(i?.name)?.slice(0, 16)}</Text>
                            <Text style={{
                                fontFamily: "Inter_400Regular",
                                color: Colors.success,
                                fontSize: 14
                            }}
                            >
                                {onlineUsers?.includes(i?.id) ? "Active" : "Offline"},
                                Accepted Task</Text>
                        </View>
                    </View>
                    <Pressable>
                        <MaterialIcons name="keyboard-arrow-right" size={30} color={Colors.textPrimary} />
                    </Pressable>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    profileContainer: {
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 55,
        borderColor: Colors.primary,
        borderWidth: 2,
        alignItems: "baseline",
        justifyContent: "center"
    },
    nameContainer: {
        marginLeft: 20,
        flexDirection: "column"
    },
})