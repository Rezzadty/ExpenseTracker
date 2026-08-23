import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { AnimatedModal } from '@/components/ui/animated-modal';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function SetBudgetModal({ visible, onClose }: Props) {
  const [budget, setBudget] = useState('');

  return (
    <AnimatedModal visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="body" color="textPrimary" style={{ fontFamily: Fonts.sansBold, fontWeight: '700', fontSize: 18 }}>
            Set Budget
          </ThemedText>
          <Pressable onPress={onClose} hitSlop={12}>
            <ThemedText type="body" color="textMuted" style={{ fontSize: 22 }}>✕</ThemedText>
          </Pressable>
        </View>

        <ThemedText type="caption" color="textSecondary" style={{ marginBottom: Spacing.xs }}>Daily Budget (Rp)</ThemedText>
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.textMuted}
          placeholder="e.g. 200000"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
        />

        <Pressable style={styles.saveBtn} onPress={onClose}>
          <ThemedText type="body" color="textOnAccent" style={{ fontFamily: Fonts.sansSemiBold, fontWeight: '600' }}>
            Save Budget
          </ThemedText>
        </Pressable>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  input: {
    backgroundColor: Colors.background,
    color: Colors.textPrimary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.base,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
    marginTop: Spacing.lg,
  },
});
