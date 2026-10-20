import { Colors } from "@/assets/mainColor/colors";
import { TextInput } from "react-native";
import { useModalStore } from "@/assets/store/modalStore";
import { useEffect } from "react";

export default function ProjectEditForm() {
  const { inputData, setInputData,editProject} = useModalStore();

  const fields = ["project Name", "project Summary","duration"];
  useEffect(() => {
    if (editProject && Object.keys(editProject).length > 0) {
      setInputData("project Name", editProject.name);
      setInputData("project Summary", editProject.summary);
      setInputData("duration", String(editProject.duration));
    }
  }, [editProject]);
  return (
    <>
      {fields.map((key, index) => (
        <TextInput
          key={index}
          placeholder={key} // show field name as placeholder
          placeholderTextColor={Colors.secondary}
          keyboardType={key == 'duration'? 'numeric' : 'default'}
          value={inputData[key] || ""}
          autoFocus={key === 'project Name'}
          onChangeText={(text) => setInputData(key, text)}
          style={{
            borderBottomWidth: 1,
            borderColor: Colors.primary,
            outlineStyle: 'none', 
            marginBottom: 10,
            color: Colors.primary,
            fontWeight: "bold"
          }}
        />
      ))}
    </>
  );
}
