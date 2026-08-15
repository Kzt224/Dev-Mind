import { View, Text } from "react-native";
import { Colors } from "../../../assets/mainColor/colors";


export default function InsightDisplayForm({ data }) {

    return (
        <View>
            <Text style={{ color: Colors.textPrimary, fontSize: 17, fontWeight: "bold" }}>{data}</Text>
        </View>
    );
}