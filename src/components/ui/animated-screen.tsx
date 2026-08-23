import type { PropsWithChildren } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

export function AnimatedScreen({ children }: PropsWithChildren) {
  return (
    <Animated.View entering={FadeIn.duration(500)} style={{ flex: 1 }}>
      {children}
    </Animated.View>
  );
}
