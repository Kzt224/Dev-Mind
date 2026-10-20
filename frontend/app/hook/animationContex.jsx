import { useRef } from "react";
import { Animated } from "react-native";

export default function useScrollAnimation(threshold = 50) {
    const scrollAnim = useRef(new Animated.Value(0)).current;
    const lastOffset = useRef(0);
    const isHidden = useRef(false);

    const onScroll = (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const diff = currentOffset - lastOffset.current;

        if (diff > 0 && currentOffset > threshold && !isHidden.current) {
            isHidden.current = true;

            Animated.timing(scrollAnim, {
                toValue: 100,
                duration: 100,
                useNativeDriver: true,
            }).start();
        }

        // scroll up
        else if (diff < 0 && isHidden.current) {
            isHidden.current = false;

            Animated.timing(scrollAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }

        lastOffset.current = currentOffset;
    };

    return { scrollAnim, onScroll };
}