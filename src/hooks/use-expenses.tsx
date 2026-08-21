import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Category } from '@/constants/theme';
import type { Expense } from '@/types/expense';

const SEED: Expense[] = [
  { id: '1', amount: 45000, category: 'Food', note: 'Grocery run', date: '2026-08-19' },
  { id: '2', amount: 25000, category: 'Transport', note: 'Grab ride', date: '2026-08-19' },
  { id: '3', amount: 150000, category: 'Shopping', note: 'New shirt', date: '2026-08-18' },
  { id: '4', amount: 35000, category: 'Health', note: 'Pharmacy', date: '2026-08-18' },
  { id: '5', amount: 500000, category: 'Bills', note: 'Electricity', date: '2026-08-17' },
  { id: '6', amount: 75000, category: 'Fun', note: 'Movie night', date: '2026-08-17' },
  { id: '7', amount: 60000, category: 'Food', note: 'Dinner out', date: '2026-08-16' },
  { id: '8', amount: 30000, category: 'Transport', note: 'Fuel', date: '2026-08-16' },
  { id: '9', amount: 200000, category: 'Shopping', note: 'Headphones', date: '2026-08-15' },
  { id: '10', amount: 15000, category: 'Other', note: 'Parking fee', date: '2026-08-15' },
];

let nextId = 11;

function useExpensesStore() {
  const [expenses, setExpenses] = useState<Expense[]>(SEED);

  const addExpense = useCallback((data: Omit<Expense, 'id'>) => {
    setExpenses((prev) => [{ ...data, id: String(nextId++) }, ...prev]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const totalSpent = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  const today = new Date().toISOString().slice(0, 10);
  const todaySpent = useMemo(
    () => expenses.filter((e) => e.date === today).reduce((s, e) => s + e.amount, 0),
    [expenses, today],
  );

  const byCategory = useMemo(() => {
    const map: Partial<Record<Category, number>> = {};
    for (const e of expenses) {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    }
    return map;
  }, [expenses]);

  return { expenses, addExpense, deleteExpense, totalSpent, todaySpent, byCategory } as const;
}

type ExpensesContextType = ReturnType<typeof useExpensesStore>;

const ExpensesContext = createContext<ExpensesContextType | null>(null);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const store = useExpensesStore();
  return <ExpensesContext.Provider value={store}>{children}</ExpensesContext.Provider>;
}

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error('useExpenses must be used within ExpensesProvider');
  return ctx;
}
