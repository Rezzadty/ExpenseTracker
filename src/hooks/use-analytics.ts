import { useMemo, useState } from "react";
import type { Category } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { useToday } from "@/hooks/use-today";
import { getPeriodRange, shiftPeriod, isInPeriod } from "@/utils/period";

export type Timeframe = "daily" | "weekly" | "monthly";

export function useAnalytics() {
  const { expenses } = useExpenses();
  const today = useToday();
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const [periodKey, setPeriodKey] = useState<string | null>(null); // YYYY-MM for monthly picker

  const currentMonthKey = getPeriodRange(today).key;
  const effectivePeriodKey = timeframe === "monthly" ? (periodKey ?? currentMonthKey) : null;
  const activeRange = effectivePeriodKey
    ? getPeriodRange(`${effectivePeriodKey}-01`)
    : null;

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

    // Monthly: use period range (inclusive start, exclusive end)
    if (activeRange) {
      return expenses.filter((e) => isInPeriod(e.date, activeRange));
    }

    return expenses;
  }, [expenses, timeframe, today, activeRange]);

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
    const values = Object.values(byCategory).filter((v): v is number => typeof v === "number");
    return values.length > 0 ? Math.max(...values) : 0;
  }, [byCategory]);

  // Previous month comparison (only for monthly timeframe)
  const previousMonthTotal = useMemo(() => {
    if (!activeRange) return 0;
    const prevRange = shiftPeriod(activeRange, -1);
    return expenses
      .filter((e) => isInPeriod(e.date, prevRange))
      .reduce((s, e) => s + e.amount, 0);
  }, [expenses, activeRange]);

  const changePercent = useMemo(() => {
    if (previousMonthTotal === 0) return totalSpent > 0 ? 100 : 0;
    return ((totalSpent - previousMonthTotal) / previousMonthTotal) * 100;
  }, [totalSpent, previousMonthTotal]);

  // Oldest expense month for picker lower bound
  const oldestMonthKey = useMemo(() => {
    if (expenses.length === 0) return currentMonthKey;
    const dates = expenses.map((e) => e.date).sort();
    const oldest = dates[0];
    return oldest.slice(0, 7); // YYYY-MM
  }, [expenses, currentMonthKey]);

  const canGoPrev = effectivePeriodKey && effectivePeriodKey > oldestMonthKey;
  const canGoNext = effectivePeriodKey && effectivePeriodKey < currentMonthKey;

  return {
    timeframe,
    setTimeframe,
    periodKey: effectivePeriodKey,
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
  };
}
