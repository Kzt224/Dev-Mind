import { Colors } from "@/assets/mainColor/colors";
import { Text, TextInput, View } from "react-native";
import { useModalStore } from "@/assets/store/modalStore";
import QRCode from "react-native-qrcode-svg";

export default function InviteForm() {
  const { step, data } = useModalStore();

  return (
    <View>
      {step === 1 && (
        <Text style={{ color: Colors.textPrimary, fontWeight: "bold" }}>You want to invite team member?. So you need to generate invite link.</Text>
      )}
      {step === 2 && (
        <View style={{
          width: "100%",
          alignItems: "center", justifyContent: "center",
          display: "flex",
          flexDirection: "column"
        }}>
          <QRCode
            value={data ? data?.token : 'www.google.com'}
            size={200}
            color={Colors.textPrimary}
            backgroundColor={Colors.bgPrimary}
          />
        </View>
      )}
    </View>
  );
}
