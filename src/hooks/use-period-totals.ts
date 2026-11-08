import { useMemo } from "react";
import type { Category } from "@/constants/theme";
import type { PeriodRange } from "@/utils/period";
import { isInPeriod } from "@/utils/period";
import { useExpenses } from "./use-expenses";

export function usePeriodTotals(range: PeriodRange | null) {
  const { expenses } = useExpenses();

  const filteredExpenses = useMemo(() => {
    if (!range) return expenses;
    return expenses.filter((e) => isInPeriod(e.date, range));
  }, [expenses, range]);

  const total = useMemo(
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

  return { filteredExpenses, total, byCategory };
}