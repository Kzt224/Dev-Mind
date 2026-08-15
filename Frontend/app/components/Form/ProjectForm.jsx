import { Colors } from "@/assets/mainColor/colors";
import { TextInput } from "react-native";
import { useModalStore } from "@/assets/store/modalStore";
import { useContext, useState } from "react";
import { LanguageContext } from "@/app/hook/languageContex";
import Dropdown from "../card/items/dropDown";

export default function ProjectForm() {
  const { inputData, setInputData } = useModalStore();
  const { t, changeLanguage } = useContext(LanguageContext);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const fields = ["project Name", "project Summary", "duration", "category", "priority"];
  //priority list
  const priotirityList = [
    { id: 1, name: "LOW" },
    { id: 2, name: "NORMAL" },
    { id: 3, name: "MEDIUM" },
    { id: 4, name: "HIGH" },
    { id: 5, name: "URGENT" },
  ];
  const categoryList = [
    { id: 1, name: "BACKEND" },
    { id: 2, name: "FRONTEND" },
    { id: 3, name: "BOTH" },
  ];
  return (
    <>
      {fields.map((key, index) => {
        const isDropdown = key == 'priority' || key === 'category';
        if (isDropdown) {
          const isPriority = key === 'priority';
          const dropdownData = isPriority ? priotirityList : categoryList;
          const placeholderText = isPriority ? "Priority" : "Category";

          return (
            <Dropdown
              key={index}
              placeholder={placeholderText}
              value={inputData[key]}
              data={dropdownData}
              visible={activeDropdown === key}
              onToggle={() =>
                setActiveDropdown(activeDropdown === key ? null : key)
              }
              onSelect={(item) => {
                setInputData(key, item.name);
                setActiveDropdown(null);
              }}
            />
          );
        }
        return (
          <TextInput
            key={index}
            placeholder={t[key]} // show field name as placeholder
            placeholderTextColor={Colors.textSecondary}
            keyboardType={key == 'duration' ? 'numeric' : 'default'}
            value={inputData[key] || ""}
            onChangeText={(text) => setInputData(key, text)}
            style={{
              borderBottomWidth: 1,
              borderColor: Colors.primary,
              outlineStyle: 'none',
              marginBottom: 10,
              color: Colors.textPrimary,
              fontWeight: "bold"
            }}
          />
        );
      })}
    </>
  );
}
