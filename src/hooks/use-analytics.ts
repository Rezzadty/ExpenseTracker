import { useMemo, useState } from "react";
import type { Category } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { useToday } from "@/hooks/use-today";

export type Timeframe = "daily" | "weekly" | "monthly";

export function useAnalytics() {
  const { expenses } = useExpenses();
  const today = useToday();
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");

  const filteredExpenses = useMemo(() => {
    if (timeframe === "daily") {
      return expenses.filter((e) => e.date === today);
    }

    if (timeframe === "weekly") {
      const todayDate = new Date(today + "T00:00:00");
      const weekAgo = new Date(todayDate);
      weekAgo.setDate(weekAgo.getDate() - 6);
      const weekAgoStr = weekAgo.toISOString().slice(0, 10);
      return expenses.filter((e) => e.date >= weekAgoStr && e.date <= today);
    }

    // Monthly: explicit start and end of month
    const [year, month] = today.split("-").map(Number);
    const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
    const monthEnd = new Date(year, month, 0); // last day of month
    const monthEndStr = `${year}-${String(month).padStart(2, "0")}-${String(monthEnd.getDate()).padStart(2, "0")}`;
    return expenses.filter((e) => e.date >= monthStart && e.date <= monthEndStr);
  }, [expenses, timeframe, today]);

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
