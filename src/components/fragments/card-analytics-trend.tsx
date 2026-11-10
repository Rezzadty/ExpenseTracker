// Fragment chart displaying daily or weekly trend based on selected timeframe.
import { ThemedText } from "@/components/elements";
import { Spacing } from "@/constants/theme";
import type { Timeframe } from "@/hooks/use-analytics";
import { useExpenses } from "@/hooks/use-expenses";
import type { Expense } from "@/types/expense";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { toLocalDateString } from "@/utils/period";

type BarData = { label: string; amount: number };

function getDailyTrend(expenses: Expense[], days: number = 7): BarData[] {
  const result: BarData[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = toLocalDateString(d);
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const amount = expenses
      .filter((e) => e.date === key)
      .reduce((s, e) => s + e.amount, 0);
    result.push({ label, amount });
  }
  return result;
}

function getMonthlyTrend(expenses: Expense[]): BarData[] {
  if (expenses.length === 0) {
    return [
      { label: "W1", amount: 0 },
      { label: "W2", amount: 0 },
      { label: "W3", amount: 0 },
      { label: "W4", amount: 0 },
    ];
  }

  // Determine year/month from first expense (all expenses are from same period)
  const firstDate = expenses[0].date;
  const year = parseInt(firstDate.slice(0, 4), 10);
  const month = parseInt(firstDate.slice(5, 7), 10);
  const daysInMonth = new Date(year, month, 0).getDate();

  const weeks: BarData[] = [
    { label: "W1", amount: 0 },
    { label: "W2", amount: 0 },
    { label: "W3", amount: 0 },
    { label: "W4", amount: 0 },
  ];

  for (const exp of expenses) {
    const day = parseInt(exp.date.slice(8, 10), 10);
    if (day <= 7) weeks[0].amount += exp.amount;
    else if (day <= 14) weeks[1].amount += exp.amount;
    else if (day <= 21) weeks[2].amount += exp.amount;
    else if (day <= daysInMonth) weeks[3].amount += exp.amount;
  }

  return weeks;
}

export type CardAnalyticsTrendProps = {
  expenses: Expense[];
  timeframe: Timeframe;
};

export default function CardAnalyticsTrend({
  expenses,
  timeframe,
}: CardAnalyticsTrendProps) {
  const { colors } = useExpenses();
  const data = useMemo(
    () =>
      timeframe === "monthly"
        ? getMonthlyTrend(expenses)
        : getDailyTrend(expenses),
    [timeframe, expenses],
  );
  const max = useMemo(() => Math.max(...data.map((d) => d.amount), 1), [data]);

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {data.map((item, i) => {
          const heightPct = (item.amount / max) * 100;
          return (
            <View
              key={i}
              style={styles.barCol}
              accessible={true}
              accessibilityLabel={`${item.label}: ${item.amount}`}
            >
              <View
                style={[styles.barTrack, { backgroundColor: colors.track }]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${Math.max(heightPct, 2)}%`,
                      backgroundColor: colors.accent,
                    },
                  ]}
                />
              </View>
              <ThemedText
                type="caption"
                color="textMuted"
                style={{ fontSize: 10, marginTop: Spacing.xs }}
              >
                {item.label}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  bars: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 120,
  },
  barCol: { flex: 1, alignItems: "center" },
  barTrack: {
    width: 24,
    height: 100,
    borderRadius: 12,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: { width: 24, borderRadius: 12 },
});
