import type { PropsWithChildren } from 'react';
import Animated, { FadeInDown, FadeOutLeft } from 'react-native-reanimated';

type Props = PropsWithChildren<{ index: number }>;

export function AnimatedListItem({ index, children }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(350).springify().damping(18)}
      exiting={FadeOutLeft.duration(200)}
    >
      {children}
    </Animated.View>
  );
}
