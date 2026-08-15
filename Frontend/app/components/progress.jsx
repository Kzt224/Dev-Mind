import { View, Text } from "react-native";
import * as Progressbar from "react-native-progress";
import { Colors } from "../../assets/mainColor/colors";

export default function Progress({ pg }) {
    return (
        <View style={{ marginTop: 15, width: "100%" }}>
            <Progressbar.Bar color={pg > 50 ? Colors.success : Colors.bgWarning} progress={pg / 100} width={null} />
        </View>
    );
}