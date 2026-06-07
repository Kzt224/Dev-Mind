import { View, TextInput, Pressable, Text, FlatList, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/assets/mainColor/colors";

export default function Dropdown({
    placeholder,
    value,
    data = [],
    onSelect,
    visible,
    onToggle,
}) {
    return (
        <View style={{ marginBottom: 15 }}>
            <Pressable onPress={onToggle}>
                <TextInput
                    placeholder={placeholder}
                    value={value}
                    editable={false}
                    placeholderTextColor={Colors.textSecondary}
                    style={styles.input}
                />
            </Pressable>

            <Pressable onPress={onToggle} style={styles.icon}>
                <AntDesign name="caret-down" size={20} color={Colors.primary} />
            </Pressable>

            {visible && (
                <View style={styles.dropDown}>
                    {(data && data?.length > 0) ? (
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => onSelect(item)}
                                    style={styles.dropDownItem}
                                >
                                    <Text style={{ color: Colors.textPrimary }}>{item.name}</Text>
                                </Pressable>
                            )}
                        />
                    ) : (
                        <Text style={{ alignSelf: "center", color: Colors.white, fontWeight: "bold" }}>No data found add first</Text>
                    )}

                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 1,
        borderColor: Colors.primary,
        color: Colors.textPrimary,
        fontWeight: "bold",
        paddingRight: 30,
    },
    icon: {
        position: "absolute",
        right: 0,
        top: 8,
    },
    dropDown: {
        width: "100%",
        backgroundColor: Colors.gray,
        borderRadius: 10,
        padding: 8,
        height: 95,
        position: "absolute",
        top: 30,
        zIndex: 5,
        justifyContent: "center"
    },
    dropDownItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.white,
    },
});
