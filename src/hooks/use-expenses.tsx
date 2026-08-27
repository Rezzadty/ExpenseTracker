import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import {
  type Category,
  type ColorTheme,
  DarkColors,
  LightColors,
} from '@/constants/theme';
import type { Expense } from '@/types/expense';
import {
  convertAmount,
  FALLBACK_RATES,
  fetchLiveExchangeRates,
} from '@/services/exchange-rate';
import {
  type CurrencyCode,
  type SeparatorStyle,
  formatMoney as formatMoneyUtil,
} from '@/utils/format';

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

export type ThemeMode = 'system' | 'dark' | 'light';

function useExpensesStore() {
  const systemColorScheme = useColorScheme();
  const [expenses, setExpenses] = useState<Expense[]>(SEED);
  const [dailyBudget, setDailyBudget] = useState<number>(200000);
  const [currency, setCurrencyState] = useState<CurrencyCode>('IDR');
  const [separatorStyle, setSeparatorStyle] = useState<SeparatorStyle>('dot');
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(FALLBACK_RATES);
  const [isRatesLive, setIsRatesLive] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>('20:00');

  const isDark = useMemo(() => {
    if (themeMode === 'system') return systemColorScheme !== 'light';
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const colors: ColorTheme = useMemo(() => {
    return isDark ? DarkColors : LightColors;
  }, [isDark]);

  useEffect(() => {
    let mounted = true;
    fetchLiveExchangeRates().then((liveRates) => {
      if (mounted) {
        setRates(liveRates);
        setIsRatesLive(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setCurrency = useCallback(
    (newCurrency: CurrencyCode) => {
      if (newCurrency === currency) return;
      // Convert all expenses and daily budget using current rates
      setExpenses((prev) =>
        prev.map((e) => ({
          ...e,
          amount: convertAmount(e.amount, currency, newCurrency, rates),
        })),
      );
      setDailyBudget((prev) => convertAmount(prev, currency, newCurrency, rates));
      setCurrencyState(newCurrency);
    },
    [currency, rates],
  );

  const addExpense = useCallback((data: Omit<Expense, 'id'>) => {
    setExpenses((prev) => [{ ...data, id: String(nextId++) }, ...prev]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearAllExpenses = useCallback(() => {
    setExpenses([]);
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

  const formatAmount = useCallback(
    (amount: number) => formatMoneyUtil(amount, currency, separatorStyle),
    [currency, separatorStyle],
  );

  return {
    expenses,
    dailyBudget,
    setDailyBudget,
    currency,
    setCurrency,
    separatorStyle,
    setSeparatorStyle,
    formatAmount,
    rates,
    isRatesLive,
    themeMode,
    setThemeMode,
    isDark,
    colors,
    reminderEnabled,
    setReminderEnabled,
    reminderTime,
    setReminderTime,
    addExpense,
    deleteExpense,
    clearAllExpenses,
    totalSpent,
    todaySpent,
    byCategory,
  } as const;
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

