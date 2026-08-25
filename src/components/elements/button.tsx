// Pure presentational button component with smooth spring press feedback and opacity transition.
import type { PropsWithChildren } from "react";
import { Pressable, type PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonProps = PressableProps & PropsWithChildren;

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 220,
  mass: 0.8,
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
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(0.95, SPRING_CONFIG);
        // eslint-disable-next-line react-hooks/immutability
        opacity.value = withSpring(0.85, SPRING_CONFIG);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withSpring(1, SPRING_CONFIG);
        // eslint-disable-next-line react-hooks/immutability
        opacity.value = withSpring(1, SPRING_CONFIG);
        onPressOut?.(e);
      }}
      style={[animStyle, style as any]}
    />
  );
}
