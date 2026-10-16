import * as Haptics from "expo-haptics";
import type { PropsWithChildren } from "react";
import { Pressable, type PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonProps = PressableProps & PropsWithChildren;

const SPRING_CONFIG = {
  damping: 25,
  stiffness: 300,
  mass: 1,
};

export default function Button({
  style,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(0.97, SPRING_CONFIG);
        // eslint-disable-next-line react-hooks/immutability
        opacity.value = withTiming(0.85, { duration: 100 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(1, SPRING_CONFIG);
        // eslint-disable-next-line react-hooks/immutability
        opacity.value = withTiming(1, { duration: 150 });
        onPressOut?.(e);
      }}
      style={[animStyle, style as any]}
    />
  );
}
