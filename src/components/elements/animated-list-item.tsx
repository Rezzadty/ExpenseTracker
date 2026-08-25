// Pure presentational animated list item with enter/exit transitions.
import type { PropsWithChildren } from "react";
import Animated, { FadeInDown, FadeOutLeft } from "react-native-reanimated";

export type AnimatedListItemProps = PropsWithChildren<{ index: number }>;

export default function AnimatedListItem({
  index,
  children,
}: AnimatedListItemProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(350)}
      exiting={FadeOutLeft.duration(200)}
    >
      {children}
    </Animated.View>
  );
}
