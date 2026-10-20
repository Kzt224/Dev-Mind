import { Pressable, View, Text } from "react-native";
import SuccessModal from "../card/successModal";
import { useAlertStore } from "../../../assets/store/aleartStore";
import { Colors } from "../../../assets/mainColor/colors";
import WarningModal from "../card/warningModal";


export default function Theme() {
    const { showSuccess, setSuccess, setError, success, setClose } = useAlertStore();
    return (
        <View style={{ flex: 1, backgroundColor: Colors.bgPrimary }}>
            <Pressable onPress={() => setError("Error when yupload profile")}>
                <Text>Press me</Text>
            </Pressable>
            <WarningModal />
        </View>
    );
}