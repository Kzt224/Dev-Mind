import { useModalStore } from "@/assets/store/modalStore";
import { View, TextInput, Pressable, Text, StyleSheet, FlatList } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/assets/mainColor/colors";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "expo-router";
import { LanguageContext } from "@/app/hook/languageContex";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dropdown from "../card/items/dropDown";

export default function TaskForm() {
  const { inputData, setInputData } = useModalStore();
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathName = usePathname();
  const { t } = useContext(LanguageContext);
  const [projectList, setProjectList] = useState(null);

  useEffect(() => {
    const fetchCacheProject = async () => {
      const project = await AsyncStorage.getItem('Projects');
      setProjectList(JSON.parse(project));
    }
    fetchCacheProject();
  }, []);

  const showPicker = (field) => {
    setActiveField(field);
    setPickerVisible(true);
  };

  const hidePicker = () => setPickerVisible(false);
  const handleConfirm = (date) => {
    setInputData(activeField, date.toLocaleDateString());
    hidePicker();
  };
  const cacheProject = projectList?.result;

  return (
    <>
      {["Project Name", "task Name", "start Date", "end Date", "note"].map((key) => {
        const isDateField = key === "start Date" || key === "end Date";
        const isDropdown = key === "Project Name";
        const isOnProjectDetail = key === 'Project Name' && pathName === '/projectDetail';
        if (isOnProjectDetail) return null;
        if (isDropdown) {
          return (
            <Dropdown
              key={key}
              placeholder={"Project Name"}
              value={inputData[key]}
              data={cacheProject}
              visible={showDropdown}
              onToggle={() => setShowDropdown(!showDropdown)}
              onSelect={(item) => {
                setInputData("Project Name", item.name);
                setInputData("Project Id", item.id)
                setShowDropdown(false);
              }}
            />
          );
        }
        return (
          <View key={key} style={{ marginBottom: 15 }}>
            <Pressable
              onPress={() => {
                if (isDateField) showPicker(key);
                if (isDropdown) setShowDropdown(!showDropdown);
              }}
            >
              <TextInput
                placeholder={t[key] || key}
                value={inputData[key] || ""}
                editable={!isDateField && !isDropdown}
                placeholderTextColor={Colors.textSecondary}
                onChangeText={(text) => setInputData(key, text)}
                style={{
                  borderBottomWidth: 1,
                  borderColor: Colors.primary,
                  color: Colors.textPrimary,
                  fontWeight: "bold",
                  paddingRight: isDateField || isDropdown ? 30 : 0,
                }}
              />
            </Pressable>
            {/* Calendar icon for date fields */}
            {isDateField && (
              <Pressable
                onPress={() => showPicker(key)}
                style={{ position: "absolute", right: 0, top: 8 }}
              >
                <FontAwesome name="calendar-plus-o" size={20} color={Colors.primary} />
              </Pressable>
            )}
          </View>
        );
      })}
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
