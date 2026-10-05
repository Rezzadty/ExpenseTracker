import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { Pressable, StyleSheet, type PressableProps } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import ThemedText from "./themed-text";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ChipProps = PressableProps & {
  label: string;
  selected?: boolean;
};

export default function Chip({ label, selected = false, style, ...rest }: ChipProps) {
  const { colors } = useExpenses();
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [selected, progress]);

  const animStyle = useAnimatedStyle(() => ({
    backgroundColor:
      progress.value > 0.5 ? colors.accentSoft : "transparent",
    borderColor: progress.value > 0.5 ? "transparent" : colors.border,
  }));

  return (
    <AnimatedPressable
      style={[
        styles.chip,
        animStyle,
        selected
          ? { backgroundColor: colors.accentSoft, borderColor: "transparent" }
          : { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.border },
        typeof style === "function" ? undefined : style,
      ]}
      {...rest}
    >
      <ThemedText
        type="caption"
        color={selected ? "accent" : "textSecondary"}
        style={{ fontFamily: Fonts.sansSemiBold, fontWeight: "600" }}
      >
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.chip,
  },
});
