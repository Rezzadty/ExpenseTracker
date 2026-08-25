// Pure presentational animated list item with smooth ease-out transitions without bounce.
import type { PropsWithChildren } from "react";
import Animated, {
  Easing,
  FadeInDown,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

export type AnimatedListItemProps = PropsWithChildren<{ index: number }>;

export default function AnimatedListItem({
  index,
  children,
}: AnimatedListItemProps) {
  return (
    <Animated.View
      layout={LinearTransition.duration(200).easing(Easing.out(Easing.quad))}
      entering={FadeInDown.delay(Math.min(index * 25, 120))
        .duration(220)
        .easing(Easing.out(Easing.cubic))}
      exiting={FadeOut.duration(140).easing(Easing.in(Easing.quad))}
    >
      {children}
    </Animated.View>
  );
}
