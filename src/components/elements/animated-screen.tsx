// Pure presentational animated screen wrapper with smooth subtle entry fade.
import type { PropsWithChildren } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function AnimatedScreen({ children }: PropsWithChildren) {
  return (
    <Animated.View
      entering={FadeIn.duration(280)}
      exiting={FadeOut.duration(180)}
      style={{ flex: 1 }}
    >
      {children}
    </Animated.View>
  );
}
