import { StyleSheet, Text, View, Pressable } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from "expo-router";
import { Colors } from "@/assets/mainColor/colors";
import { customCard, shadowStyles } from "@/assets/themes/style";
import { useBottomBarHeight } from "../hook/barHeighContex";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function Bar({ page }) {

    const router = useRouter();
    const { setBottomBarHeight } = useBottomBarHeight();
    const insets = useSafeAreaInsets();
    const handleNavigate = (item) => {
        router.push(item.link)
    }
    const tabLink = [
        { id: 1, tabName: "Project", iconName: "folder-open", link: "/" },
        { id: 2, tabName: "Task", iconName: "task-alt", link: "/task" },
        { id: 3, tabName: "Team", iconName: "group", link: "/team" },
        { id: 4, tabName: "Chat", iconName: "chat-bubble-outline", link: "/chat" },
    ];
    return (
        <View
            style={[styles.bottomContainer, { bottom: insets.bottom }]}
            onLayout={(e) => setBottomBarHeight(e.nativeEvent.layout.height)}
        >
            <View style={[customCard['cardNormal'], styles.bottomBar]}>
                {tabLink.map((t) => {
                    const activeStyle = t.link === page
                        ? { backgroundColor: Colors.lightIndigo, borderRadius: 40 }
                        : { backgroundColor: "transparent", borderRadius: 40 };
                    const isActive = t.link === page;
                    return (
                        <Pressable key={t.id} style={styles.barBtn} onPress={() => handleNavigate(t)}>
                            <View style={[styles.btn, activeStyle]}>
                                <MaterialIcons name={t.iconName} size={25} color={isActive ? Colors.primary : Colors.textPrimary} />
                                <Text style={{ color: isActive ? Colors.primary : Colors.textPrimary, fontWeight: "bold", fontSize: 13 }}>{t.tabName}</Text>
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
        width: "90%",
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "space-between",
        padding: 5,
        paddingHorizontal: 30,
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
        padding: 3,
        paddingHorizontal: 7,
        alignItems: "center",
        borderRadius: 40,
        width: "150%",
        overflow: "hidden"
    }
})