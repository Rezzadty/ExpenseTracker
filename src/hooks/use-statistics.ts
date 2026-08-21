import { useMemo } from 'react';
import type { Category } from '@/constants/theme';
import { useExpenses } from '@/hooks/use-expenses';

export function useStatistics() {
  const { expenses, totalSpent, byCategory } = useExpenses();

  const slices = useMemo(() => {
    if (totalSpent === 0) return [];
    return (Object.entries(byCategory) as [Category, number][]).map(([category, amount]) => ({
      category,
      amount,
      pct: (amount / totalSpent) * 100,
    }));
  }, [byCategory, totalSpent]);

  const maxCategory = useMemo(() => Math.max(...Object.values(byCategory), 0), [byCategory]);

  return { expenses, totalSpent, byCategory, slices, maxCategory };
}
