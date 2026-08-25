// Fragment chart displaying daily spending trends across the last N days.
import { ThemedText } from "@/components/elements";
import { Colors, Spacing } from "@/constants/theme";
import type { Expense } from "@/types/expense";
import { StyleSheet, View } from "react-native";

type DayData = { label: string; amount: number };

function getDailyTrend(expenses: Expense[], days: number = 7): DayData[] {
  const result: DayData[] = [];
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

export type CardAnalyticsTrendProps = {
  expenses: Expense[];
};

export default function CardAnalyticsTrend({
  expenses,
}: CardAnalyticsTrendProps) {
  const data = getDailyTrend(expenses);
  const max = Math.max(...data.map((d) => d.amount), 1);

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {data.map((day, i) => {
          const heightPct = (day.amount / max) * 100;
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
                {day.label}
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
    justifyContent: "space-between",
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
