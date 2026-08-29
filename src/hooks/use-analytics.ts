import { useMemo, useState } from "react";
import type { Category } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";

export type Timeframe = "daily" | "weekly" | "monthly";

export function useAnalytics() {
  const { expenses } = useExpenses();
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");

  const filteredExpenses = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    if (timeframe === "daily") {
      return expenses.filter((e) => e.date === todayStr);
    }

    if (timeframe === "weekly") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 6);
      const weekAgoStr = weekAgo.toISOString().slice(0, 10);
      return expenses.filter((e) => e.date >= weekAgoStr && e.date <= todayStr);
    }

    const currentMonth = todayStr.slice(0, 7);
    return expenses.filter((e) => e.date.startsWith(currentMonth));
  }, [expenses, timeframe]);

  const totalSpent = useMemo(
    () => filteredExpenses.reduce((s, e) => s + e.amount, 0),
    [filteredExpenses],
  );

  const byCategory = useMemo(() => {
    const map: Partial<Record<Category, number>> = {};
    for (const e of filteredExpenses) {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    }
    return map;
  }, [filteredExpenses]);

  const slices = useMemo(() => {
    if (totalSpent === 0) return [];
    return (Object.entries(byCategory) as [Category, number][]).map(
      ([category, amount]) => ({
        category,
        amount,
        pct: (amount / totalSpent) * 100,
      }),
    );
  }, [byCategory, totalSpent]);

  const maxCategory = useMemo(() => {
    const values = Object.values(byCategory).filter((v): v is number => typeof v === 'number');
    return values.length > 0 ? Math.max(...values) : 0;
  }, [byCategory]);

  return {
    timeframe,
    setTimeframe,
    filteredExpenses,
    totalSpent,
    byCategory,
    slices,
    maxCategory,
  };
}
