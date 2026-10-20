import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Colors } from "@/assets/mainColor/colors";

export default function ProgressBar({
  size = 90,
  strokeWidth = 8,
  progress = 0
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (circumference * progress) / 100;

  const getColor = () => {
    if (progress >= 70) return Colors.success;
    if (progress >= 40) return Colors.warning;
    return Colors.danger;
  };

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.disable}
          strokeWidth={strokeWidth}
          fill="none"
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* center text */}
      <View style={styles.center}>
        <Text style={[styles.percent,{color: getColor()}]}>{progress}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  percent: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
