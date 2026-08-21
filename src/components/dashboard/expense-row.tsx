import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { CategoryColors, Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import type { Expense } from '@/types/expense';
import { formatMoney } from '@/utils/format';

export function ExpenseRow({ item, onDelete }: { item: Expense; onDelete: (id: string) => void }) {
  return (
    <View style={styles.expenseRow}>
      <View style={[styles.categoryBadge, { backgroundColor: CategoryColors[item.category] + '20' }]}>
        <ThemedText
          type="caption"
          style={{ color: CategoryColors[item.category], fontFamily: Fonts.sansSemiBold, fontWeight: '600' }}
        >
          {item.category.slice(0, 3).toUpperCase()}
        </ThemedText>
      </View>
      <View style={{ flex: 1, marginLeft: Spacing.md }}>
        <ThemedText type="body">{item.note}</ThemedText>
        <ThemedText type="caption" color="textMuted">{item.date}</ThemedText>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <ThemedText type="body" style={{ fontFamily: Fonts.sansSemiBold, fontWeight: '600' }}>
          {formatMoney(item.amount)}
        </ThemedText>
        <Pressable onPress={() => onDelete(item.id)} hitSlop={8}>
          <ThemedText type="caption" color="danger">Delete</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.listRow,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.listRow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
