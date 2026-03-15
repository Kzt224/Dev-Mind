import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRef } from "react";
import { Animated, Pressable } from "react-native";
import { Colors } from "../../../assets/mainColor/colors";

export default function DeleteButton({item,isShake,handleDelete,size}) {

    const shake = useRef(new Animated.Value(0)).current;

    const startShake = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shake, { toValue: -3, duration: 100, useNativeDriver: true }),
                Animated.timing(shake, { toValue: 3, duration: 100, useNativeDriver: true }),
            ])
        ).start();
    };
    if(isShake){
        startShake();
    }
    return (
        <Pressable onPress={() => handleDelete(item)}>
            <Animated.View style={{
                transform: [{
                    rotate: shake.interpolate({
                        inputRange: [-3, 3],
                        outputRange: ["-3deg", "3deg"],
                    })
                }]
            }}>
                <FontAwesome name="trash" size={size ? size : 30} color={Colors.danger} style={{ marginRight: 5 }} />
            </Animated.View>
        </Pressable>
    );
}