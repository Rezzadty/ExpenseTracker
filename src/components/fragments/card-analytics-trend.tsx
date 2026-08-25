// Fragment chart displaying daily or weekly trend based on selected timeframe.
import { ThemedText } from "@/components/elements";
import { Colors, Spacing } from "@/constants/theme";
import type { Timeframe } from "@/hooks/use-analytics";
import type { Expense } from "@/types/expense";
import { StyleSheet, View } from "react-native";

type BarData = { label: string; amount: number };

function getDailyTrend(expenses: Expense[], days: number = 7): BarData[] {
  const result: BarData[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const amount = expenses
      .filter((e) => e.date === key)
      .reduce((s, e) => s + e.amount, 0);
    result.push({ label, amount });
  }
  return result;
}

function getMonthlyTrend(expenses: Expense[]): BarData[] {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const weeks: BarData[] = [
    { label: "W1", amount: 0 },
    { label: "W2", amount: 0 },
    { label: "W3", amount: 0 },
    { label: "W4", amount: 0 },
  ];

  const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;

  for (const exp of expenses) {
    if (!exp.date.startsWith(monthPrefix)) continue;
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
  const data =
    timeframe === "monthly" ? getMonthlyTrend(expenses) : getDailyTrend(expenses);
  const max = Math.max(...data.map((d) => d.amount), 1);

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {data.map((item, i) => {
          const heightPct = (item.amount / max) * 100;
          return (
            <View key={i} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${Math.max(heightPct, 2)}%` },
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
    backgroundColor: Colors.track,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: { width: 24, borderRadius: 12, backgroundColor: Colors.accent },
});
