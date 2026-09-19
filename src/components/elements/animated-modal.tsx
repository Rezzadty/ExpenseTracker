// Pure presentational animated modal backdrop and content wrapper.
import { Spacing } from "@/constants/theme";
import { BlurView } from "expo-blur";
import type { PropsWithChildren } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.wrapper}>
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={styles.overlay}
        >
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <Animated.View
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(150)}
          style={styles.content}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    width: "100%",
    maxWidth: 420,
    zIndex: 1,
  },
});
