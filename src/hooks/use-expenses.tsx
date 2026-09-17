import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import {
  type Category,
  type CategoryItem,
  type ColorTheme,
  DarkColors,
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY_COLORS,
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
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore';

export type ThemeMode = 'system' | 'dark' | 'light';

function useExpensesStore() {
  const systemColorScheme = useColorScheme();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dailyBudget, setDailyBudget] = useState<number>(200000);
  const [currency, setCurrencyState] = useState<CurrencyCode>('IDR');
  const [separatorStyle, setSeparatorStyle] = useState<SeparatorStyle>('dot');
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(FALLBACK_RATES);
  const [isRatesLive, setIsRatesLive] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>('20:00');
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);

  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = { ...DEFAULT_CATEGORY_COLORS };
    for (const c of categories) {
      map[c.name] = c.color;
    }
    return map;
  }, [categories]);

  const addCategory = useCallback((cat: Omit<CategoryItem, 'id'>) => {
    const id = `cat-${Date.now()}`;
    setCategories((prev) => [...prev, { ...cat, id }]);
  }, []);

  const updateCategory = useCallback((id: string, cat: Partial<Omit<CategoryItem, 'id'>>) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const oldName = c.name;
        const newName = cat.name ?? c.name;
        if (oldName !== newName) {
          setExpenses((currExp) =>
            currExp.map((e) => (e.category === oldName ? { ...e, category: newName } : e)),
          );
        }
        return { ...c, ...cat };
      }),
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => {
      const target = prev.find((c) => c.id === id);
      if (!target) return prev;
      setExpenses((currExp) =>
        currExp.map((e) => (e.category === target.name ? { ...e, category: 'Other' } : e)),
      );
      return prev.filter((c) => c.id !== id);
    });
  }, []);

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

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, 'expenses'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const exps: Expense[] = snapshot.docs.map((d) => ({
        id: d.id,
        amount: d.data().amount,
        category: d.data().category,
        note: d.data().note,
        date: d.data().date,
      }));
      setExpenses(exps);
    });
    return unsub;
  }, []);

  const setCurrency = useCallback(
    (newCurrency: CurrencyCode) => {
      if (newCurrency === currency) return;
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

  const addExpense = useCallback(async (data: Omit<Expense, 'id'>) => {
    const user = auth.currentUser;
    if (!user) return;
    await addDoc(collection(db, 'expenses'), {
      ...data,
      userId: user.uid,
    });
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'expenses', id));
  }, []);

  const clearAllExpenses = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;
    for (const e of expenses) {
      await deleteDoc(doc(db, 'expenses', e.id));
    }
  }, [expenses]);

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
    categories,
    categoryColorMap,
    addCategory,
    updateCategory,
    deleteCategory,
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

