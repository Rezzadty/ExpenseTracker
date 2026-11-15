// Expenses screen displaying full expense list with period filter, search, category filter, delete, and add modal trigger.
import { AnimatedScreen, Chip, ThemedText, ThemedView } from "@/components/elements";
import {
  CardExpensesSection,
  ModalAddExpense,
  Navbar,
} from "@/components/fragments";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { useToday } from "@/hooks/use-today";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  toLocalDateString,
  getPeriodRangeForTimeframe,
  shiftPeriodByTimeframe,
  canNavigateNext,
  canNavigatePrev,
} from "@/utils/period";

type Timeframe = "daily" | "weekly" | "monthly";
type ExpenseParams = {
  timeframe?: Timeframe;
  period?: string; // YYYY-MM-DD for daily/weekly, YYYY-MM for monthly
  category?: string;
};

const TIMEFRAME_OPTIONS: { label: string; value: Timeframe | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

export default function ExpensesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<ExpenseParams>();
  const { expenses, addExpense, deleteExpense, colors } = useExpenses();
  const today = useToday();
  const [showAdd, setShowAdd] = useState(false);

  // Period filter state - initialize from router params
  const [timeframe, setTimeframe] = useState<Timeframe | "all">(() =>
    params.timeframe ?? "monthly"
  );
  const [periodDate, setPeriodDate] = useState<string>(() =>
    params.period ?? toLocalDateString()
  );

  // Compute period range and label
  const periodInfo = useMemo(() => {
    if (timeframe === "all") return null;
    return getPeriodRangeForTimeframe(periodDate, timeframe);
  }, [timeframe, periodDate]);

  // Filter expenses by period, then category + search in CardExpensesSection
  const periodFilteredExpenses = useMemo(() => {
    if (timeframe === "all" || !periodInfo) return expenses;
    return expenses.filter((e) => e.date >= periodInfo.start && e.date < periodInfo.endExclusive);
  }, [expenses, timeframe, periodInfo]);

  // Find oldest expense date for prev navigation limit
  const oldestExpenseDate = useMemo(() => {
    if (expenses.length === 0) return null;
    return expenses.map((e) => e.date).sort()[0];
  }, [expenses]);

  const canGoPrev = periodInfo && timeframe !== "all" ? canNavigatePrev(periodInfo.start, timeframe, oldestExpenseDate) : false;
  const canGoNext = periodInfo && timeframe !== "all" ? canNavigateNext(periodInfo.start, timeframe, today) : false;

  // Update URL when filters change (so tab refresh / deep link works)
  const updateUrl = (newTimeframe?: Timeframe | "all", newPeriod?: string, newCategory?: string) => {
    const searchParams = new URLSearchParams();
    const tf = newTimeframe ?? timeframe;
    const pd = newPeriod ?? periodDate;
    const cat = newCategory ?? params.category;
    if (tf !== "all") searchParams.set("timeframe", tf);
    if (pd) searchParams.set("period", pd);
    if (cat) searchParams.set("category", cat);
    const query = searchParams.toString();
    router.replace(`/(tabs)/expenses${query ? `?${query}` : ""}` as any);
  };

  const handleTimeframeChange = (value: Timeframe | "all") => {
    setTimeframe(value);
    if (value !== "all") {
      const newPeriod = toLocalDateString();
      setPeriodDate(newPeriod);
      updateUrl(value, newPeriod);
    } else {
      updateUrl("all");
    }
  };

  const handlePrevPeriod = () => {
    if (!canGoPrev || !periodInfo || timeframe === "all") return;
    const newPeriod = shiftPeriodByTimeframe(periodDate, timeframe, -1);
    setPeriodDate(newPeriod);
    updateUrl(timeframe, newPeriod);
  };

  const handleNextPeriod = () => {
    if (!canGoNext || !periodInfo || timeframe === "all") return;
    const newPeriod = shiftPeriodByTimeframe(periodDate, timeframe, 1);
    setPeriodDate(newPeriod);
    updateUrl(timeframe, newPeriod);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Navbar />
        <AnimatedScreen>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText
              type="sectionTitle"
              color="textSecondary"
              style={{ marginBottom: Spacing.base }}
            >
              All Expenses
            </ThemedText>

            {/* Period filter row */}
            <View style={styles.timeframeRow}>
              {TIMEFRAME_OPTIONS.map((t) => (
                <Chip
                  key={t.value}
                  label={t.label}
                  selected={timeframe === t.value}
                  onPress={() => handleTimeframeChange(t.value)}
                />
              ))}
            </View>

            {/* Period navigator for daily/weekly/monthly */}
            {timeframe !== "all" && periodInfo && (
              <View style={styles.periodNavigator}>
                <Pressable
                  style={[
                    styles.periodNavBtn,
                    { backgroundColor: canGoPrev ? colors.surface : colors.surfaceRaised },
                  ]}
                  onPress={handlePrevPeriod}
                  disabled={!canGoPrev}
                  accessibilityLabel="Previous period"
                >
                  <ThemedText type="body" color={canGoPrev ? "accent" : "textMuted"} style={{ fontSize: 20 }}>
                    ‹
                  </ThemedText>
                </Pressable>
                <ThemedText
                  type="sectionTitle"
                  color="textPrimary"
                  style={styles.periodLabel}
                >
                  {periodInfo.label}
                </ThemedText>
                <Pressable
                  style={[
                    styles.periodNavBtn,
                    { backgroundColor: canGoNext ? colors.surface : colors.surfaceRaised },
                  ]}
                  onPress={handleNextPeriod}
                  disabled={!canGoNext}
                  accessibilityLabel="Next period"
                >
                  <ThemedText type="body" color={canGoNext ? "accent" : "textMuted"} style={{ fontSize: 20 }}>
                    ›
                  </ThemedText>
                </Pressable>
              </View>
            )}

            <CardExpensesSection
              expenses={periodFilteredExpenses}
              onDelete={deleteExpense}
              periodLabel={timeframe === "all" ? "All time" : periodInfo?.label}
              initialCategoryFilter={params.category as any}
            />
          </ScrollView>
        </AnimatedScreen>

        <Pressable
          style={[styles.fab, { backgroundColor: colors.accent }]}
          onPress={() => setShowAdd(true)}
        >
          <ThemedText
            type="body"
            color="textOnAccent"
            style={{
              fontFamily: Fonts.sansBold,
              fontWeight: "700",
              fontSize: 24,
            }}
          >
            +
          </ThemedText>
        </Pressable>
      </SafeAreaView>

      <ModalAddExpense
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={addExpense}
      />
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
    marginBottom: Spacing.md,
  },
  periodNavigator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  periodNavBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.button,
    alignItems: "center",
    justifyContent: "center",
  },
  periodLabel: {
    flex: 1,
    textAlign: "center",
    marginHorizontal: Spacing.md,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    boxShadow: "0px 4px 12px rgba(0,217,163,0.4)",
  },
});
