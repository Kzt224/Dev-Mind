import { useContext, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Animated } from "react-native";
import Feather from "@expo/vector-icons/Feather.js";
import { Colors } from "../../assets/mainColor/colors";
import { customCard, shadowStyles } from "@/assets/themes/style";
import { useSearchStore } from "@/assets/store/searchStore";
import { LanguageContext } from "../hook/languageContex";

export default function SearchForm({ trans }) {
    const { searchQuery, setQuery } = useSearchStore();
    const { t } = useContext(LanguageContext);
    const [focus, setFocus] = useState(false);

    return (
        <Animated.View style={{ width: trans, overflow: "hidden", display: "flex", flexDirection: "row", alignItems: "center" }}>
            <TextInput
                placeholder={t["Search"]}
                placeholderTextColor={Colors.textSecondary}
                value={searchQuery}
                onChangeText={(text) => setQuery(text)}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                style={[styles.search, { borderColor: focus ? Colors.primary : "#E5E7EB" }]}
            />
        </Animated.View>
    );
}
const styles = StyleSheet.create({
    search: {
        height: 50,
        fontSize: 15,
        color: Colors.primary,
        position: "relative",
        fontWeight: "bold",
        borderWidth: 2,
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        width: "100%",
        borderRadius: 15
    },
})