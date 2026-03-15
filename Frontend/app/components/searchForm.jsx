import { useState } from "react";
import { View,Text, TextInput, Pressable, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather.js";
import { Colors } from "../../assets/mainColor/colors";
import { customCard, shadowStyles } from "@/assets/themes/style";
import { useSearchStore } from "@/assets/store/searchStore";

export default function SearchForm()
{
    const {searchQuery,setQuery} = useSearchStore();
    const [focus,setFocus] = useState(false);
    return(
        <View style={{display: "flex",flexDirection: "row",alignItems: "center"}}>
            <TextInput
                    placeholder="Search"
                    placeholderTextColor={Colors.textSecondary}
                    value={searchQuery}
                    onChangeText={(text) => setQuery(text)}
                    onFocus={() => setFocus(true)}
                    style={[styles.search,{borderColor: focus ? Colors.primary :"#E5E7EB"}]}
                />
                <Pressable style={{ position: "absolute",left:20}} >
                    <Feather name="search" size={25} color={Colors.textPrimary} />
                </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    search: {
        height: 50,
        fontSize: 15,
        color: Colors.primary,
        position: "relative",
        fontWeight: "bold",
        borderWidth: 1,
        backgroundColor: Colors.white,
        width: "100%",
        paddingHorizontal: 80,
        borderRadius: 15
    },
})