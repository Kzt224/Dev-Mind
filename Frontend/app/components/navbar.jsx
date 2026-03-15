import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFonts, IBMPlexSans_400Regular, IBMPlexSans_700Bold, } from '@expo-google-fonts/ibm-plex-sans';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from "expo-router";
import { Colors } from "@/assets/mainColor/colors";
import { useDrawer } from "../hook/drawercontex";
import { customCard, shadowStyles } from "@/assets/themes/style";
import { useNavBarHeight } from "../hook/navHeighContex";
export default function NavBar({ name }) {
    const { openDrawer } = useDrawer();
    const router = useRouter();
    const [fontsLoaded] = useFonts({
        IBMPlexSans_400Regular,
        IBMPlexSans_700Bold,
    });
    const { setNavBarHeight } = useNavBarHeight();
    const handleDrawer = () => openDrawer();


    return (
        <View style={[customCard['cardNormal'], styles.navContainer]}
            onLayout={(e) => setNavBarHeight(e.nativeEvent.layout.height)}
        >
            <View style={styles.navItem}>
                <Pressable onPress={() => router.back()}>
                    <MaterialIcons name="keyboard-arrow-left" size={40} color={Colors.textPrimary} />
                </Pressable>
                <Text style={{ color: Colors.textPrimary, fontFamily: "IBMPlexSans_700Bold", fontSize: 20, marginBottom: 3 }}>{name.toUpperCase()}</Text>
                {name === 'chat' ? (
                    <Pressable onPress={handleDrawer}>
                        <MaterialCommunityIcons name="menu" size={35} color={Colors.textPrimary} style={{ marginRight: 20 }} />
                    </Pressable>
                ) : (
                    <View style={{ marginRight: 20 }}></View>
                )}
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    navContainer: {
        width: "100%",
        paddingVertical: 20,
        padding: 2,
        position: "absolute",
        borderBottomEndRadius: 30,
        borderBottomLeftRadius: 30,
        zIndex: 10,
    },
    navItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10
    }
})