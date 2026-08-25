// Pure presentational animated modal backdrop and content wrapper.
import { Spacing } from "@/constants/theme";
import type { PropsWithChildren } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export type AnimatedModalProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

export default function AnimatedModal({
  visible,
  onClose,
  children,
}: AnimatedModalProps) {
  if (!visible) return null;

  return (
    <View style={[StyleSheet.absoluteFill, styles.wrapper]}>
      <Animated.View
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
        style={styles.content}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    zIndex: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  content: {},
});
