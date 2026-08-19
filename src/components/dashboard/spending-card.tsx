import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { formatDate } from '@/utils/format';
import { formatMoney } from '@/utils/format';

export function SpendingCard({ todaySpent }: { todaySpent: number }) {
  return (
    <View style={styles.spendingCard}>
      <ThemedText type="sectionTitle" color="accent">
        {formatDate()}
      </ThemedText>
      <ThemedText type="body" color="textSecondary" style={{ marginTop: Spacing.sm }}>
        Today Spending
      </ThemedText>
      <View style={styles.spendingRow}>
        <ThemedText type="money" color="textPrimary">
          {formatMoney(todaySpent)}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  spendingCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  spendingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
});
