import { useModalStore } from "@/assets/store/modalStore";
import { View, TextInput, Pressable, Text, StyleSheet, FlatList } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/assets/mainColor/colors";
import { useEffect, useState } from "react";
import { getDate } from "@/assets/helper/calculateDate.js";

export default function TaskEditForm({ projectList }) {
    const { inputData, setInputData, editTask, id } = useModalStore();
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [permission, setPermission] = useState(null);
    // Example projects — replace with real fetched data
    const showPicker = (field) => {
        setActiveField(field);
        setPickerVisible(true);
    };
    useEffect(() => {
        if (editTask && Object.keys(editTask).length > 0) {
            setPermission(editTask?.permission);
            setInputData("task Name", editTask.name);
            setInputData("start Date", editTask.startDate);
            setInputData("end Date", editTask.endDate);
            setInputData("note", editTask.note);
            setInputData('progress', Number(editTask.progress));
        }
    }, [editTask]);

    const hidePicker = () => setPickerVisible(false);

    const handleConfirm = (date) => {
        setInputData(activeField, date.toISOString());
        hidePicker();
    };
    const checkPermission = (permission) => {
        let isDisable = false;
        if (permission === undefined) return;
        if (permission?.isOwner) {
            return isDisable;
        } else if (!permission?.isOwner && permission?.partialEdit) {
            isDisable = true;
        } else {
            isDisable = true;
        }
        return isDisable;
    }
    const disable = checkPermission(permission);
    return (
        <>
            {["task Name", "start Date", "end Date", 'progress', "note"].map((key) => {
                const isDateField = key === "start Date" || key === "end Date";
                const isDropdown = key === "Project Name";

                return (
                    <View key={key} style={{ marginBottom: 15 }}>
                        <Pressable
                            onPress={() => {
                                if (isDateField && !disable) showPicker(key);
                                if (isDropdown) setShowDropdown(!showDropdown);
                            }}
                        >
                            <TextInput
                                placeholder={key === 'progress' ? key + '(%)' : key}
                                value={
                                    isDateField
                                        ? getDate(inputData[key]) || ""
                                        : String(inputData[key] ?? "")
                                }
                                editable={!isDateField && !isDropdown}
                                readOnly={key != 'progress' && disable}
                                multiline={key === 'note'}
                                placeholderTextColor={Colors.secondary}
                                keyboardType={key === 'progress' ? "numeric" : "default"}
                                onChangeText={(text) => {
                                    if (key === 'progress') {
                                        const number = Number(text);
                                        if (number > 100 || number < 0) {
                                            return;
                                        }
                                        setInputData(key, Number(text));
                                    }
                                    setInputData(key, text)
                                }}
                                style={{
                                    borderBottomWidth: 1,
                                    borderColor: Colors.primary,
                                    color: Colors.primary,
                                    fontWeight: "bold",
                                    paddingRight: isDateField || isDropdown ? 30 : 0,
                                }}
                            />
                        </Pressable>

                        {/* Calendar icon for date fields */}
                        {isDateField && (
                            <Pressable
                                onPress={() => {
                                    if (!disable) {
                                        showPicker(key)
                                    } else {
                                        return '';
                                    }
                                }}
                                style={{ position: "absolute", right: 0, top: 8 }}
                            >
                                <FontAwesome name="calendar-plus-o" size={20} color={Colors.primary} />
                            </Pressable>
                        )}

                        {/* Dropdown icon for project field */}
                        {isDropdown && (
                            <Pressable
                                onPress={() => setShowDropdown(!showDropdown)}
                                style={{ position: "absolute", right: 0, top: 8 }}
                            >
                                <AntDesign name="caret-down" size={20} color={Colors.primary} />
                            </Pressable>
                        )}
                    </View>
                );
            })}

            {/* Custom Dropdown List */}
            {showDropdown && (
                <View style={styles.dropDown}>
                    <FlatList
                        data={projectList}
                        style={{ maxHeight: 100 }}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => {
                                    setInputData("Project Name", item.name);
                                    setInputData("Project Id", item.id)
                                    setShowDropdown(false);
                                }}
                                style={styles.dropDownItem}
                            >
                                <Text style={{ color: Colors.white }}>{item.name}</Text>
                            </Pressable>
                        )}
                    />
                </View>
            )}

            {/* Date Picker */}
            <DateTimePickerModal
                isVisible={isPickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hidePicker}
            />
        </>
    );
}

const styles = StyleSheet.create({
    dropDown: {
        width: "100%",
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        position: "absolute",
        top: 35
    },
    dropDownItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.white,
    },
});
