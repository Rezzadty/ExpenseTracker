// Pure presentational animated screen wrapper with smooth subtle entry fade and cross-theme transition.
import { useExpenses } from "@/hooks/use-expenses";
import type { PropsWithChildren } from "react";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

export default function AnimatedScreen({ children }: PropsWithChildren) {
  const { themeMode } = useExpenses();

  return (
    <Animated.View
      key={themeMode}
      layout={LinearTransition.duration(250)}
      entering={FadeIn.duration(280)}
      exiting={FadeOut.duration(180)}
      style={{ flex: 1 }}
    >
      {children}
    </Animated.View>
  );
}
