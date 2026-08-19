// Dashboard screen — shows today's spending header, category stats, filter chips, and expense list.
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, CategoryColors, Radius, Spacing, Fonts, type Category } from '@/constants/theme';
import { useExpenses } from '@/store/expenses';
import type { Expense } from '@/store/expenses';
import { useState, useMemo, useCallback } from 'react';

const CATEGORIES: ('All' | Category)[] = ['All', 'Food', 'Transport', 'Shopping', 'Health', 'Bills', 'Fun', 'Other'];

// Format number as Indonesian Rupiah.
function formatMoney(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

// Toggleable filter chip — accent style when selected, bordered when not.
function CategoryChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected ? styles.chipSelected : styles.chipUnselected,
      ]}
    >
      <ThemedText
        type="caption"
        color={selected ? 'accent' : 'textSecondary'}
        style={{ fontFamily: Fonts.sansSemiBold, fontWeight: '600' }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

// Horizontal progress bar for one category — width proportional to max category spend.
function CategoryBar({ category, amount, max }: { category: Category; amount: number; max: number }) {
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

// Single expense list row — shows category badge, note, date, amount, and delete action.
function ExpenseRow({ item, onDelete }: { item: Expense; onDelete: (id: string) => void }) {
  return (
    <View style={styles.expenseRow}>
      <View style={[styles.categoryBadge, { backgroundColor: CategoryColors[item.category] + '20' }]}>
        <ThemedText type="caption" style={{ color: CategoryColors[item.category], fontFamily: Fonts.sansSemiBold, fontWeight: '600' }}>
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

// Returns current date as uppercase string, e.g. "WEDNESDAY, AUGUST 19".
function formatDate() {
  const now = new Date();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const month = now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const day = now.getDate();
  return `${weekday}, ${month} ${day}`;
}

export default function DashboardScreen() {
  const { expenses, deleteExpense, todaySpent, byCategory } = useExpenses();
  const [filter, setFilter] = useState<'All' | Category>('All');

  const maxCategory = useMemo(() => Math.max(...Object.values(byCategory), 0), [byCategory]);

  const filtered = useMemo(
    () => (filter === 'All' ? expenses : expenses.filter((e) => e.category === filter)),
    [expenses, filter],
  );

  const renderExpense = useCallback(
    ({ item }: { item: Expense }) => <ExpenseRow item={item} onDelete={deleteExpense} />,
    [deleteExpense],
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FlatList
          data={filtered}
          keyExtractor={(e) => e.id}
          renderItem={renderExpense}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <ThemedText type="sectionTitle" color="textMuted">
                  {formatDate()}
                </ThemedText>
                <ThemedText type="body" color="textSecondary" style={{ marginTop: Spacing.xs }}>
                  Today's spending
                </ThemedText>
                <ThemedText type="money" color="textPrimary" style={{ marginTop: Spacing.sm }}>
                  {formatMoney(todaySpent)}
                </ThemedText>
              </View>

              <ThemedView surface="surface" style={styles.card}>
                <ThemedText type="sectionTitle" color="textSecondary" style={{ marginBottom: Spacing.base }}>
                  Outcome Statistics
                </ThemedText>
                {(Object.entries(byCategory) as [Category, number][]).map(([cat, amt]) => (
                  <CategoryBar key={cat} category={cat} amount={amt} max={maxCategory} />
                ))}
              </ThemedView>

              <View style={styles.chipRow}>
                {CATEGORIES.map((c) => (
                  <CategoryChip key={c} label={c} selected={filter === c} onPress={() => setFilter(c)} />
                ))}
              </View>

              <ThemedText type="sectionTitle" color="textSecondary" style={{ marginBottom: Spacing.md }}>
                Recent Expenses
              </ThemedText>
            </>
          }
          ListEmptyComponent={
            <View style={{ paddingVertical: Spacing.xxl, alignItems: 'center' }}>
              <ThemedText type="body" color="textMuted">No expenses found</ThemedText>
            </View>
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  listContent: { padding: Spacing.base, paddingBottom: 100 },
  header: { marginBottom: Spacing.xl },
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  categoryRow: { marginBottom: Spacing.md },
  categoryLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  categoryDot: { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.sm },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.track,
    overflow: 'hidden',
  },
  barFill: { height: 8, borderRadius: 4 },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
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
