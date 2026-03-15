import { View, Text } from "react-native";
import { Colors } from "@/assets/mainColor/colors";
import { useModalStore } from "@/assets/store/modalStore";


export default function JoinConfirmForm() {
  const { step, data } = useModalStore();
  return (
    <View>
      {step === 2 ? (
        data ? (
          <Text style={{ color: Colors.primary, fontWeight: "bold",alignSelf: "center"}}>
            {data.message}
          </Text>
        ) : (
          <Text style={{ color: Colors.primary, fontWeight: "bold" }}>
            Loading...
          </Text>
        )
      ) : (
        <Text style={{ color: Colors.primary, fontWeight: "bold" }}>
          You want to join this group?
        </Text>
      )}
    </View>
  );
}
