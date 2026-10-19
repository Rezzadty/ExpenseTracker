import {
  type Category,
  type CategoryItem,
  type ColorTheme,
  DarkColors,
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY_COLORS,
  LightColors,
} from "@/constants/theme";
import {
  convertAmount,
  FALLBACK_RATES,
  fetchLiveExchangeRates,
} from "@/services/exchange-rate";
import { expenseService } from "@/services/expenses";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Expense } from "@/types/expense";
import {
  type CurrencyCode,
  type SeparatorStyle,
  formatMoney as formatMoneyUtil,
} from "@/utils/format";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { useAuth } from "./use-auth";


export type ThemeMode = "system" | "dark" | "light";

function useExpensesStore() {
  const { user } = useAuth();
  const systemColorScheme = useColorScheme();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dailyBudget, setDailyBudget] = useState<number>(200000);
  const [currency, setCurrencyState] = useState<CurrencyCode>("IDR");
  const [separatorStyle, setSeparatorStyle] = useState<SeparatorStyle>("dot");
  const [rates, setRates] =
    useState<Record<CurrencyCode, number>>(FALLBACK_RATES);
  const [isRatesLive, setIsRatesLive] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>("20:00");
  const [categories, setCategories] =
    useState<CategoryItem[]>(DEFAULT_CATEGORIES);

  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = { ...DEFAULT_CATEGORY_COLORS };
    for (const c of categories) {
      map[c.name] = c.color;
    }
    return map;
  }, [categories]);

  // Load categories and expenses from Supabase on user session change
  // ponytail: direct supabase queries without offline sync queue; add offline sync when network-resilient storage needed
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!user) {
        if (mounted) {
          setExpenses([]);
          setCategories(DEFAULT_CATEGORIES);
          await AsyncStorage.removeItem("cached_expenses");
          await AsyncStorage.removeItem("cached_categories");
        }
        return;
      }

      try {
        const cachedExp = await AsyncStorage.getItem("cached_expenses");
        const cachedCat = await AsyncStorage.getItem("cached_categories");

        if (mounted && cachedExp) setExpenses(JSON.parse(cachedExp));
        if (mounted && cachedCat) setCategories(JSON.parse(cachedCat));

        const catData = await expenseService.fetchCategories(user.id);
        if (mounted) {
          if (catData && catData.length > 0) {
            setCategories(catData);
            await AsyncStorage.setItem("cached_categories", JSON.stringify(catData));
          } else {
            const insertedCats = await expenseService.seedCategories(user.id, DEFAULT_CATEGORIES);
            if (mounted) {
              setCategories(insertedCats);
              await AsyncStorage.setItem("cached_categories", JSON.stringify(insertedCats));
            }
          }
        }

        const expData = await expenseService.fetchExpenses(user.id);
        if (mounted) {
          setExpenses(expData);
          await AsyncStorage.setItem("cached_expenses", JSON.stringify(expData));
        }
      } catch (e) {
        console.error("Failed to sync expenses:", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user]);

  const addCategory = useCallback(
    async (cat: Omit<CategoryItem, "id">) => {
      if (!user) return;
      try {
        const inserted = await expenseService.addCategory(user.id, cat);
        setCategories((prev) => {
          const updated = [...prev, inserted];
          AsyncStorage.setItem("cached_categories", JSON.stringify(updated));
          return updated;
        });
      } catch (e) {
        console.error(e);
      }
    },
    [user],
  );

  const updateCategory = useCallback(
    async (id: string, cat: Partial<Omit<CategoryItem, "id">>) => {
      if (!user) return;
      const target = categories.find((c) => c.id === id);
      if (!target) return;
      
      try {
        await expenseService.updateCategory(user.id, id, cat, target.name);
        setCategories((prev) => {
          const updated = prev.map((c) => (c.id === id ? { ...c, ...cat } : c));
          AsyncStorage.setItem("cached_categories", JSON.stringify(updated));
          return updated;
        });
      } catch (e) {
        console.error(e);
      }
    },
    [user, categories],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      if (!user) return;
      const target = categories.find((c) => c.id === id);
      if (!target) return;

      try {
        await expenseService.deleteCategory(user.id, id, target.name);
        setCategories((prev) => {
          const updated = prev.filter((c) => c.id !== id);
          AsyncStorage.setItem("cached_categories", JSON.stringify(updated));
          return updated;
        });
      } catch (e) {
        console.error(e);
      }
    },
    [user, categories],
  );

  const isDark = useMemo(() => {
    if (themeMode === "system") return systemColorScheme !== "light";
    return themeMode === "dark";
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
      setExpenses((prev) =>
        prev.map((e) => ({
          ...e,
          amount: convertAmount(e.amount, currency, newCurrency, rates),
        })),
      );
      setDailyBudget((prev) =>
        convertAmount(prev, currency, newCurrency, rates),
      );
      setCurrencyState(newCurrency);
    },
    [currency, rates],
  );

  const addExpense = useCallback(
    async (data: Omit<Expense, "id">) => {
      if (!user) return;
      try {
        const item = await expenseService.addExpense(user.id, data);
        setExpenses((prev) => {
          const updated = [item, ...prev];
          AsyncStorage.setItem("cached_expenses", JSON.stringify(updated));
          return updated;
        });
      } catch (e) {
        console.error(e);
      }
    },
    [user],
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      if (!user) return;
      try {
        await expenseService.deleteExpense(user.id, id);
        setExpenses((prev) => {
          const updated = prev.filter((e) => e.id !== id);
          AsyncStorage.setItem("cached_expenses", JSON.stringify(updated));
          return updated;
        });
      } catch (e) {
        console.error(e);
      }
    },
    [user],
  );

  const updateExpense = useCallback(
    async (id: string, data: Partial<Omit<Expense, "id">>) => {
      if (!user) return;
      try {
        const item = await expenseService.updateExpense(user.id, id, data);
        setExpenses((prev) => {
          const updated = prev.map((e) => (e.id === id ? item : e));
          AsyncStorage.setItem("cached_expenses", JSON.stringify(updated));
          return updated;
        });
      } catch (e) {
        console.error(e);
      }
    },
    [user],
  );

  const clearAllExpenses = useCallback(async () => {
    if (!user) return;
    try {
      await expenseService.clearAllExpenses(user.id);
      setExpenses([]);
      await AsyncStorage.removeItem("cached_expenses");
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const totalSpent = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses],
  );

  const today = new Date().toISOString().slice(0, 10);
  const todaySpent = useMemo(
    () =>
      expenses
        .filter((e) => e.date === today)
        .reduce((s, e) => s + e.amount, 0),
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
    updateExpense,
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
  return (
    <ExpensesContext.Provider value={store}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error("useExpenses must be used within ExpensesProvider");
  return ctx;
}
