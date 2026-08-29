import { useMemo, useState } from 'react';
import type { Category } from '@/constants/theme';
import { useExpenses } from '@/hooks/use-expenses';

export function useDashboard() {
  const {
    expenses,
    dailyBudget,
    setDailyBudget,
    addExpense,
    deleteExpense,
    todaySpent,
    byCategory,
  } = useExpenses();
  const [filter, setFilter] = useState<'All' | Category>('All');
  const [expanded, setExpanded] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showBudget, setShowBudget] = useState(false);

  const maxCategory = useMemo(() => {
    const values = Object.values(byCategory).filter((v): v is number => typeof v === 'number');
    return values.length > 0 ? Math.max(...values) : 0;
  }, [byCategory]);
  const filtered = useMemo(
    () => (filter === 'All' ? expenses : expenses.filter((e) => e.category === filter)),
    [expenses, filter],
  );
  const visible = useMemo(() => (expanded ? filtered : filtered.slice(0, 4)), [filtered, expanded]);
  const budgetRemaining = dailyBudget - todaySpent;

  return {
    expenses,
    dailyBudget,
    setDailyBudget,
    budgetRemaining,
    addExpense,
    deleteExpense,
    todaySpent,
    byCategory,
    filter,
    setFilter,
    expanded,
    setExpanded,
    showAddExpense,
    setShowAddExpense,
    showBudget,
    setShowBudget,
    maxCategory,
    filtered,
    visible,
  };
}
