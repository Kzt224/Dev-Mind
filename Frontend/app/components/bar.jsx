import { StyleSheet, Text, View, Pressable } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from "expo-router";
import { Colors } from "@/assets/mainColor/colors";
import { customCard, shadowStyles } from "@/assets/themes/style";
import { useBottomBarHeight } from "../hook/barHeighContex";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useContext } from "react";
import { LanguageContext } from "../hook/languageContex.jsx";

export default function Bar({ page }) {

    const router = useRouter();
    const { setBottomBarHeight } = useBottomBarHeight();
    const insets = useSafeAreaInsets();
    const handleNavigate = (item) => {
        router.push(item.link)
    }
    const { t } = useContext(LanguageContext);

    const tabLink = [
        { id: 1, tabName: "Project", iconName: "home", link: "/" },
        { id: 2, tabName: "Project", iconName: "folder-open", link: "/project" },
        { id: 3, tabName: 'Ai', iconName: 'assistant', link: "/chat" },
        { id: 4, tabName: "Team", iconName: "group", link: "/team" },
        { id: 5, tabName: "Profile", iconName: "person", link: "/components/account" },
    ];
    return (
        <View
            style={[styles.bottomContainer, { bottom: insets.bottom }]}
            onLayout={(e) => setBottomBarHeight(e.nativeEvent.layout.height)}
        >
            <View style={styles.bottomBar}>
                {tabLink.map((tab) => {
                    const activeStyle = tab.link === page
                        ? { color: Colors.lightIndigo, borderRadius: 40 }
                        : { color: "transparent", borderRadius: 40 };
                    const isActive = tab.link === page;
                    return (
                        <Pressable key={tab.id} style={styles.barBtn} onPress={() => handleNavigate(tab)}>
                            <View style={[styles.btn, activeStyle]}>
                                <MaterialIcons name={tab.iconName} size={26} color={isActive ? Colors.primary : Colors.textPrimary} />
                                <Text style={{ color: isActive ? Colors.primary : Colors.textPrimary, fontWeight: "bold", fontSize: 13 }}>{tab.tabName}</Text>
                            </View>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        alignSelf: "center",
    },
    bottomBar: {
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        paddingHorizontal: 10,
        display: "flex",
        flexDirection: "row",
    },
    barBtn: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    btn: {
        alignItems: "center",
        justifyContent: "center"
    }
})