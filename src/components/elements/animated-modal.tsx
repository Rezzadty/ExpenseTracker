import { Spacing } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { useEffect, useState, type PropsWithChildren } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type AnimatedModalProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

const ANIM_IN_CONFIG = {
  duration: 220,
  easing: Easing.out(Easing.cubic),
};

const ANIM_OUT_CONFIG = {
  duration: 160,
  easing: Easing.in(Easing.cubic),
};

export default function AnimatedModal({
  visible,
  onClose,
  children,
}: AnimatedModalProps) {
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(visible ? 1 : 0);

  if (visible && !mounted) {
    setMounted(true);
  }

  useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, ANIM_IN_CONFIG);
    } else if (mounted) {
      progress.value = withTiming(0, ANIM_OUT_CONFIG, (finished) => {
        if (finished) {
          runOnJS(setMounted)(false);
        }
      });
    }
  }, [visible, mounted, progress]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: interpolate(progress.value, [0, 1], [0.94, 1]) },
      { translateY: interpolate(progress.value, [0, 1], [8, 0]) },
    ],
  }));

  if (!mounted) return null;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.wrapper}>
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <Animated.View style={[styles.content, contentStyle]}>
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
