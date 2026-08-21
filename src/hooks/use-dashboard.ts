import { useMemo, useState } from 'react';
import type { Category } from '@/constants/theme';
import { useExpenses } from '@/hooks/use-expenses';

export function useDashboard() {
  const { expenses, addExpense, deleteExpense, todaySpent, byCategory } = useExpenses();
  const [filter, setFilter] = useState<'All' | Category>('All');
  const [expanded, setExpanded] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showBudget, setShowBudget] = useState(false);

  const maxCategory = useMemo(() => Math.max(...Object.values(byCategory), 0), [byCategory]);
  const filtered = useMemo(
    () => (filter === 'All' ? expenses : expenses.filter((e) => e.category === filter)),
    [expenses, filter],
  );
  const visible = useMemo(() => (expanded ? filtered : filtered.slice(0, 4)), [filtered, expanded]);

  return {
    expenses,
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
