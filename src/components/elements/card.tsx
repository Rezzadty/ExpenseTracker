import { useExpenses } from "@/hooks/use-expenses";
import type { ViewProps } from "react-native";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";

type Surface = "background" | "surface" | "surfaceRaised";

export type CardProps = ViewProps & {
  surface?: Surface;
  animated?: boolean;
};

export default function Card({
  style,
  surface = "surface",
  animated = false,
  ...props
}: CardProps) {
  const { colors } = useExpenses();

  const cardStyle = [
    {
      backgroundColor: colors[surface],
      borderWidth: 1,
      borderColor: colors.border,
    },
    style,
  ];

  if (!animated) {
    return (
      <Animated.View
        style={cardStyle}
        {...props}
      />
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(280).springify().damping(20).stiffness(180)}
      layout={LinearTransition.springify().damping(20).stiffness(180)}
      style={cardStyle}
      {...props}
    />
  );
}
