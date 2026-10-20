import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/assets/mainColor/colors";
import { customCard } from "@/assets/themes/style";
import { useBottomBarHeight } from "../../hook/barHeighContex";
import { useNavBarHeight } from "../../hook/navHeighContex";
import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../hook/languageContex";


export default function Language() {
    const bottomBarHeight = useBottomBarHeight();
    const { NavBarHeight } = useNavBarHeight();
    const { t, changeLanguage, lang } = useContext(LanguageContext);
    const [language, setLanguage] = useState('En');

    const changeLan = (language) => {
        changeLanguage(language);
        setLanguage(language);
    }
    useEffect(() => {
        setLanguage(lang);
    }, [])
    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: Colors.bgPrimary,
                    padding: 15,
                }}
            >
                <View
                >
                    <View style={[customCard['cardNormal'], styles.card]}>
                        <View style={styles.langList}>
                            <Text style={{ color: Colors.textPrimary, fontSize: 18, fontWeight: "bold" }}>English</Text>
                            <Pressable onPress={() => changeLan("En")} style={[styles.checkBox,
                            { backgroundColor: language == "En" ? Colors.primary : "transparent" }]}>
                            </Pressable>
                        </View>
                        <View style={[styles.langList, { marginTop: 20 }]}>
                            <Text style={{ color: Colors.textPrimary, fontSize: 18, fontWeight: "bold" }}>{t['Myanmar'] || "Myanmar"}</Text>
                            <Pressable onPress={() => changeLan("Myan")} style={[styles.checkBox,
                            { backgroundColor: language == "Myan" ? Colors.primary : "transparent" }]}>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 15,
    },
    langList: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    checkBox: {
        width: 23,
        height: 23,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: Colors.textPrimary,
    }
})