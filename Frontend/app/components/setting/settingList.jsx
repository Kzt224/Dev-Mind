import { useRouter } from "expo-router";
import { settingList } from "@/assets/helper/settingList";
import { customCard } from "@/assets/themes/style.js";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { Colors } from "@/assets/mainColor/colors.js";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useContext } from "react";
import { LanguageContext } from "../../hook/languageContex";
import { AuthContext } from "../../hook/authContex";


export default function SettingList() {
    const router = useRouter();
    const { t } = useContext(LanguageContext);
    const { user, logout } = useContext(AuthContext);

    const handleNavigate = (link) => {
        if (!link) return;
        if (link === 'logout') {
            logout();
        } else {
            router.push({
                pathname: `/components/setting/${link}`,
                params: { id: user?.id || 0 }
            })
        }
    }
    return (
        <View style={[{ paddingHorizontal: 15, paddingBottom: 15 }, customCard['cardNormal']]}>
            {settingList?.map((i) => (
                <Pressable onPress={() => handleNavigate(i?.link)} style={styles.list} key={i.id}>
                    <View style={[styles.icon, {
                        backgroundColor: Colors[i?.bg],
                    }]}>
                        <MaterialIcons name={i?.icon} size={30} color={Colors[i?.color]} />
                    </View>
                    <View style={styles.listText}>
                        <Text style={{ color: Colors.textPrimary, fontWeight: "bold" }}>{t[i?.name]}</Text>
                        <Text style={{ color: Colors.textSecondary, fontSize: 13 }}>{i?.description}</Text>
                    </View>
                </Pressable>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    list: {
        display: "flex",
        flexDirection: "row",
        gap: 25,
        marginTop: 20
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: 'center'
    },
    listText: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
    }
})