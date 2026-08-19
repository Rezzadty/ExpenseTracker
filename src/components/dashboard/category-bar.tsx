import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { CategoryColors, Colors, Spacing, type Category } from '@/constants/theme';
import { formatMoney } from '@/utils/format';

export function CategoryBar({ category, amount, max }: { category: Category; amount: number; max: number }) {
  const pct = max > 0 ? (amount / max) * 100 : 0;
  return (
    <View style={styles.categoryRow}>
      <View style={styles.categoryLabelRow}>
        <View style={[styles.categoryDot, { backgroundColor: CategoryColors[category] }]} />
        <ThemedText type="body" style={{ flex: 1 }}>{category}</ThemedText>
        <ThemedText type="body" color="textSecondary">{formatMoney(amount)}</ThemedText>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: CategoryColors[category] }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryRow: { marginBottom: Spacing.md },
  categoryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.track,
    overflow: 'hidden',
  },
  barFill: { height: 8, borderRadius: 4 },
});
