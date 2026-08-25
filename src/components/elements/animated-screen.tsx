// Pure presentational animated screen wrapper.
import type { PropsWithChildren } from "react";
import { View } from "react-native";

export default function AnimatedScreen({ children }: PropsWithChildren) {
  return <View style={{ flex: 1 }}>{children}</View>;
}
