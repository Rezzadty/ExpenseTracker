// Pure presentational animated progress bar element for category percentages.
"use no memo";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Colors } from "@/constants/theme";

export type ProgressBarProps = {
  percentage: number;
  color: string;
};

export default function ProgressBar({ percentage, color }: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(percentage, {
      duration: 450,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage, width]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    backgroundColor: color,
  }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, barStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.track,
    overflow: "hidden",
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
});
