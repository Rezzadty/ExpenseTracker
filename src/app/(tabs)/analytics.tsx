// Analytics screen displaying period filters, total spend, donut breakdown, category bars, and trend chart.
import {
  AnimatedScreen,
  Chip,
  ThemedText,
  ThemedView,
} from "@/components/elements";
import {
  CardAnalyticsDonut,
  CardAnalyticsTrend,
  CardCategoryProgress,
  CardExpenseItem,
  Navbar,
} from "@/components/fragments";
import { Radius, Spacing, Fonts, type Category } from "@/constants/theme";
import { useAnalytics, type Timeframe } from "@/hooks/use-analytics";
import { useExpenses } from "@/hooks/use-expenses";
import { formatHeaderDate } from "@/utils/period";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 10;

const TIMEFRAMES: { label: string; value: Timeframe }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const PERIOD_LABELS: Record<Timeframe, string> = {
  daily: "Today Spending",
  weekly: "This Week Spending",
  monthly: "This Month Spending",
};

function formatMonthKey(key: string): string {
  const [year, month] = key.split("-").map(Number);
  const monthNames = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ];
  return `${monthNames[month - 1]} ${year}`;
}

export default function AnalyticsScreen() {
  const { formatAmount, colors } = useExpenses();
  const {
    timeframe,
    setTimeframe,
    periodKey,
    setPeriodKey,
    canGoPrev,
    canGoNext,
    filteredExpenses,
    totalSpent,
    previousMonthTotal,
    changePercent,
    byCategory,
    slices,
    maxCategory,
  } = useAnalytics();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const isMonthly = timeframe === "monthly";
  const periodLabel = isMonthly && periodKey
    ? formatMonthKey(periodKey)
    : PERIOD_LABELS[timeframe];

  const handleSelectTimeframe = (value: Timeframe) => {
    setTimeframe(value);
    setSelectedCategory(null);
    setVisibleCount(PAGE_SIZE);
  };

  const handlePrevMonth = () => {
    if (!periodKey || !canGoPrev) return;
    setSelectedCategory(null);
    setVisibleCount(PAGE_SIZE);
    const [year, month] = periodKey.split("-").map(Number);
    const date = new Date(year, month - 2, 1); // previous month
    setPeriodKey(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  };

  const handleNextMonth = () => {
    if (!periodKey || !canGoNext) return;
    setSelectedCategory(null);
    setVisibleCount(PAGE_SIZE);
    const [year, month] = periodKey.split("-").map(Number);
    const date = new Date(year, month, 1); // next month
    setPeriodKey(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  };

  const handleToggleCategory = (cat: Category) => {
    setSelectedCategory((prev) => (prev === cat ? null : cat));
    setVisibleCount(PAGE_SIZE);
  };

  const transactions = useMemo(() => {
    const list = selectedCategory
      ? filteredExpenses.filter((e) => e.category === selectedCategory)
      : filteredExpenses;
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredExpenses, selectedCategory]);

  const visibleTransactions = useMemo(() => {
    return transactions.slice(0, visibleCount);
  }, [transactions, visibleCount]);

  const groupedTransactions = useMemo(() => {
    if (timeframe === "daily") return [];
    const groups: { date: string; formattedDate: string; items: typeof visibleTransactions }[] = [];
    const map = new Map<string, typeof visibleTransactions>();

    for (const item of visibleTransactions) {
      let group = map.get(item.date);
      if (!group) {
        group = [];
        map.set(item.date, group);
        groups.push({
          date: item.date,
          formattedDate: formatHeaderDate(item.date),
          items: group,
        });
      }
      group.push(item);
    }
    return groups;
  }, [visibleTransactions, timeframe]);

  const getChangeColorKey = (pct: number) => (pct >= 0 ? "accent" : "danger");
  const getChangePrefix = (pct: number) => (pct >= 0 ? "+" : "");

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Navbar />
        <AnimatedScreen>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.timeframeRow}>
              {TIMEFRAMES.map((t) => (
                <Chip
                  key={t.value}
                  label={t.label}
                  selected={timeframe === t.value}
                  onPress={() => handleSelectTimeframe(t.value)}
                />
              ))}
            </View>

            {isMonthly && periodKey && (
              <View style={styles.monthPickerRow}>
                <Pressable
                  style={[
                    styles.monthNavBtn,
                    { backgroundColor: canGoPrev ? colors.surface : colors.surfaceRaised },
                  ]}
                  onPress={handlePrevMonth}
                  disabled={!canGoPrev}
                  accessibilityLabel="Previous month"
                >
                  <ThemedText type="body" color={canGoPrev ? "accent" : "textMuted"} style={{ fontSize: 20 }}>
                    ‹
                  </ThemedText>
                </Pressable>
                <ThemedText
                  type="sectionTitle"
                  color="textPrimary"
                  style={styles.monthPickerLabel}
                >
                  {formatMonthKey(periodKey)}
                </ThemedText>
                <Pressable
                  style={[
                    styles.monthNavBtn,
                    { backgroundColor: canGoNext ? colors.surface : colors.surfaceRaised },
                  ]}
                  onPress={handleNextMonth}
                  disabled={!canGoNext}
                  accessibilityLabel="Next month"
                >
                  <ThemedText type="body" color={canGoNext ? "accent" : "textMuted"} style={{ fontSize: 20 }}>
                    ›
                  </ThemedText>
                </Pressable>
              </View>
            )}

            <View style={[styles.totalCard, { backgroundColor: colors.surface }]}>
              <ThemedText type="sectionTitle" color="textSecondary">
                {periodLabel}
              </ThemedText>
              <ThemedText
                type="money"
                color="textPrimary"
                style={{ fontSize: 32, marginTop: Spacing.sm }}
              >
                {formatAmount(totalSpent)}
              </ThemedText>
              <ThemedText
                type="caption"
                color="textMuted"
                style={{ marginTop: Spacing.xs }}
              >
                {filteredExpenses.length} transactions
              </ThemedText>
              {isMonthly && periodKey && previousMonthTotal > 0 && totalSpent > 0 && (
                <ThemedText
                  type="caption"
                  color={getChangeColorKey(changePercent)}
                  style={{
                    marginTop: Spacing.xs,
                    fontFamily: Fonts.sansSemiBold,
                    fontWeight: "600",
                  }}
                >
                  {getChangePrefix(changePercent)}{changePercent.toFixed(1)}% vs last month
                </ThemedText>
              )}
            </View>

            <ThemedView surface="surface" style={styles.card}>
              <ThemedText
                type="sectionTitle"
                color="textSecondary"
                style={{ marginBottom: Spacing.base }}
              >
                Spending Breakdown
              </ThemedText>
              {slices.length === 0 ? (
                <View style={styles.empty}>
                  <ThemedText type="body" color="textMuted">
                    No data for this period
                  </ThemedText>
                </View>
              ) : (
                <CardAnalyticsDonut
                  data={slices}
                  total={totalSpent}
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleToggleCategory}
                />
              )}
            </ThemedView>

            <ThemedView surface="surface" style={styles.card}>
              <ThemedText
                type="sectionTitle"
                color="textSecondary"
                style={{ marginBottom: Spacing.base }}
              >
                Category Details
              </ThemedText>
              {Object.keys(byCategory).length === 0 ? (
                <View style={styles.empty}>
                  <ThemedText type="body" color="textMuted">
                    No transactions
                  </ThemedText>
                </View>
              ) : (
                (Object.entries(byCategory) as [Category, number][]).map(
                  ([cat, amt]) => (
                    <CardCategoryProgress
                      key={cat}
                      category={cat}
                      amount={amt}
                      max={maxCategory}
                      selected={selectedCategory === cat}
                      onPress={() => handleToggleCategory(cat)}
                    />
                  ),
                )
              )}
            </ThemedView>

            <ThemedView surface="surface" style={styles.card}>
              <View style={styles.transactionsHeader}>
                <ThemedText type="sectionTitle" color="textSecondary">
                  Transactions
                </ThemedText>
                {selectedCategory && (
                  <Chip
                    label={`${selectedCategory} ✕`}
                    selected
                    onPress={() => setSelectedCategory(null)}
                  />
                )}
              </View>

              {transactions.length === 0 ? (
                <View style={styles.empty}>
                  <ThemedText type="body" color="textMuted">
                    No transactions in this period
                  </ThemedText>
                </View>
              ) : timeframe === "daily" ? (
                visibleTransactions.map((item) => (
                  <CardExpenseItem key={item.id} item={item} />
                ))
              ) : (
                groupedTransactions.map((group) => (
                  <View key={group.date} style={styles.dateGroup}>
                    <ThemedText
                      type="caption"
                      color="textSecondary"
                      style={styles.dateHeader}
                    >
                      {group.formattedDate}
                    </ThemedText>
                    {group.items.map((item) => (
                      <CardExpenseItem key={item.id} item={item} />
                    ))}
                  </View>
                ))
              )}

              {transactions.length > visibleCount && (
                <Pressable
                  style={[
                    styles.seeAllBtn,
                    { backgroundColor: colors.surfaceRaised },
                  ]}
                  onPress={() => setVisibleCount((v) => v + PAGE_SIZE)}
                >
                  <ThemedText
                    type="body"
                    color="accent"
                    style={{
                      fontFamily: Fonts.sansSemiBold,
                      fontWeight: "600",
                    }}
                  >
                    Show more ({transactions.length - visibleCount} remaining)
                  </ThemedText>
                </Pressable>
              )}
            </ThemedView>

            {timeframe !== "daily" && (
              <ThemedView surface="surface" style={styles.card}>
                <ThemedText
                  type="sectionTitle"
                  color="textSecondary"
                  style={{ marginBottom: Spacing.base }}
                >
                  {timeframe === "monthly" ? "Monthly Breakdown" : "Daily Trend"}
                </ThemedText>
                <CardAnalyticsTrend
                  expenses={filteredExpenses}
                  timeframe={timeframe}
                />
              </ThemedView>
            )}
          </ScrollView>
        </AnimatedScreen>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: 100 },
  timeframeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  monthPickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  monthNavBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.chip,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  monthPickerLabel: {
    minWidth: 100,
    textAlign: "center",
  },
  totalCard: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    boxShadow: "0px 8px 16px rgba(0,0,0,0.15)",
  },
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  empty: {
    paddingVertical: Spacing.lg,
    alignItems: "center",
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.base,
  },
  dateGroup: {
    marginBottom: Spacing.sm,
  },
  dateHeader: {
    fontFamily: Fonts.sansSemiBold,
    fontWeight: "600",
    marginBottom: Spacing.xs,
    marginTop: Spacing.xs,
  },
  seeAllBtn: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderRadius: Radius.chip,
    marginTop: Spacing.sm,
  },
});
