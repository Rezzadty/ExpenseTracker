import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { AnimatedModal } from '@/components/ui/animated-modal';
import { CategoryColors, Colors, Fonts, Radius, Spacing, type Category } from '@/constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { amount: number; category: Category; note: string; date: string }) => void;
};

export function AddExpenseModal({ visible, onClose, onSave }: Props) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<Category>('Food');

  const handleSave = () => {
    const amt = parseInt(amount, 10);
    if (!amt || !note.trim()) return;
    onSave({ amount: amt, category, note: note.trim(), date: new Date().toISOString().slice(0, 10) });
    setAmount('');
    setNote('');
    setCategory('Food');
    onClose();
  };

  return (
    <AnimatedModal visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="body" color="textPrimary" style={{ fontFamily: Fonts.sansBold, fontWeight: '700', fontSize: 18 }}>
            Add Expense
          </ThemedText>
          <Pressable onPress={onClose} hitSlop={12}>
            <ThemedText type="body" color="textMuted" style={{ fontSize: 22 }}>✕</ThemedText>
          </Pressable>
        </View>

        <ThemedText type="caption" color="textSecondary" style={{ marginBottom: Spacing.xs }}>Amount (Rp)</ThemedText>
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.textMuted}
          placeholder="e.g. 50000"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <ThemedText type="caption" color="textSecondary" style={{ marginBottom: Spacing.xs }}>Note</ThemedText>
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.textMuted}
          placeholder="What was it for?"
          value={note}
          onChangeText={setNote}
        />

        <ThemedText type="caption" color="textSecondary" style={{ marginBottom: Spacing.xs }}>Category</ThemedText>
        <View style={styles.chipRow}>
          {(Object.keys(CategoryColors) as Category[]).map((c) => (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.chip, category === c ? styles.chipSelected : styles.chipUnselected]}
            >
              <ThemedText type="caption" color={category === c ? 'accent' : 'textSecondary'} style={{ fontFamily: Fonts.sansSemiBold, fontWeight: '600' }}>
                {c}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <ThemedText type="body" color="textOnAccent" style={{ fontFamily: Fonts.sansSemiBold, fontWeight: '600' }}>
            Save Expense
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.chip,
  },
  chipSelected: { backgroundColor: Colors.accentSoft },
  chipUnselected: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
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
