'use no memo';
import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Spacing } from '@/constants/theme';

type Props = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

export function AnimatedModal({ visible, onClose, children }: Props) {
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    zIndex: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {},
});
