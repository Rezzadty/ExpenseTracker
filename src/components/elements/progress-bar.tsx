// Pure presentational animated progress bar element for category percentages.
"use no memo";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "@/constants/theme";

export type ProgressBarProps = {
  percentage: number;
  color: string;
};

export default function ProgressBar({ percentage, color }: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = 0;
    width.value = withDelay(200, withTiming(percentage, { duration: 600 }));
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
