import type { PropsWithChildren } from 'react';
import { usePathname } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

export function AnimatedScreen({ children }: PropsWithChildren) {
  const pathname = usePathname();
  
  return (
    <Animated.View key={pathname} entering={FadeIn.duration(500)} style={{ flex: 1 }}>
      {children}
    </Animated.View>
  );
}
