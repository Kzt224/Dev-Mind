import { Colors } from "@/assets/mainColor/colors";
import { TextInput } from "react-native";
import { useModalStore } from "@/assets/store/modalStore";
import { useContext } from "react";
import { LanguageContext } from "@/app/hook/languageContex";

export default function ProjectForm() {
  const { inputData, setInputData } = useModalStore();
  const { t, changeLanguage } = useContext(LanguageContext);


  const fields = ["project Name", "project Summary", "duration"];
  return (
    <>
      {fields.map((key, index) => (
        <TextInput
          key={index}
          placeholder={t[key]} // show field name as placeholder
          placeholderTextColor={Colors.secondary}
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
      ))}
    </>
  );
}
