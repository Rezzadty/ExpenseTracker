import {
  type Category,
  type CategoryItem,
  type ColorTheme,
  DarkColors,
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY_COLORS,
  LIGHT_CATEGORY_COLORS,
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
  useRef,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { useAuth } from "./use-auth";
import { useToday } from "./use-today";


export type ThemeMode = "system" | "dark" | "light";

// Base currency is always IDR — amounts stored in DB and state in IDR
const BASE_CURRENCY: CurrencyCode = "IDR";

function useExpensesStore() {
  const { user } = useAuth();
  const systemColorScheme = useColorScheme();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dailyBudget, setDailyBudget] = useState<number>(200000);
  const [displayCurrency, setDisplayCurrencyState] = useState<CurrencyCode>("IDR");
  const [separatorStyle, setSeparatorStyle] = useState<SeparatorStyle>("dot");
  const [rates, setRates] =
    useState<Record<CurrencyCode, number>>(FALLBACK_RATES);
  const [isRatesLive, setIsRatesLive] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>("20:00");
  const [categories, setCategories] =
    useState<CategoryItem[]>(DEFAULT_CATEGORIES);

  const today = useToday();

  // Track current user ID and state refs to prevent race conditions on rapid transitions
  const userIdRef = useRef<string | undefined>(user?.id);
  useEffect(() => {
    userIdRef.current = user?.id;
  }, [user?.id]);

  const expensesRef = useRef(expenses);
  useEffect(() => {
    expensesRef.current = expenses;
  }, [expenses]);

  const categoriesRef = useRef(categories);
  useEffect(() => {
    categoriesRef.current = categories;
  }, [categories]);

  // Effect 1: Categories (fetch + seed)
  useEffect(() => {
    let mounted = true;
    const currentUserId = user?.id;

    (async () => {
      if (!user) {
        if (mounted && userIdRef.current === undefined) {
          setCategories(DEFAULT_CATEGORIES);
          await AsyncStorage.removeItem("cached_categories").catch(console.error);
        }
        return;
      }

      try {
        const cachedCat = await AsyncStorage.getItem("cached_categories");

        if (mounted && userIdRef.current === currentUserId) {
          if (cachedCat) setCategories(JSON.parse(cachedCat));
        }

        const catData = await expenseService.fetchCategories(user.id);
        if (mounted && userIdRef.current === currentUserId) {
          if (catData && catData.length > 0) {
            setCategories(catData);
            await AsyncStorage.setItem("cached_categories", JSON.stringify(catData)).catch(console.error);
          } else {
            const insertedCats = await expenseService.seedCategories(user.id, DEFAULT_CATEGORIES);
            if (mounted && userIdRef.current === currentUserId) {
              setCategories(insertedCats);
              await AsyncStorage.setItem("cached_categories", JSON.stringify(insertedCats)).catch(console.error);
            }
          }
        }
      } catch (e) {
        console.error("Failed to sync categories:", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Effect 2: Expenses (fetch)
  useEffect(() => {
    let mounted = true;
    const currentUserId = user?.id;

    (async () => {
      if (!user) {
        if (mounted && userIdRef.current === undefined) {
          setExpenses([]);
          await AsyncStorage.removeItem("cached_expenses").catch(console.error);
        }
        return;
      }

      try {
        const cachedExp = await AsyncStorage.getItem("cached_expenses");
        const cachedCurrency = await AsyncStorage.getItem("cached_currency") as CurrencyCode | null;

        if (mounted && userIdRef.current === currentUserId) {
          if (cachedExp) setExpenses(JSON.parse(cachedExp));
          if (cachedCurrency) setDisplayCurrencyState(cachedCurrency);
        }

        const expData = await expenseService.fetchExpenses(user.id);
        if (mounted && userIdRef.current === currentUserId) {
          setExpenses(expData);
          await AsyncStorage.setItem("cached_expenses", JSON.stringify(expData)).catch(console.error);
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
      const currentUserId = userIdRef.current;
      try {
        const inserted = await expenseService.addCategory(user.id, cat);
        const updated = [...categoriesRef.current, inserted];
        setCategories(updated);
        if (userIdRef.current === currentUserId) {
          AsyncStorage.setItem("cached_categories", JSON.stringify(updated)).catch((e) =>
            console.error("Failed to cache categories:", e)
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
    [user],
  );

  const updateCategory = useCallback(
    async (id: string, cat: Partial<Omit<CategoryItem, "id">>) => {
      if (!user) return;
      const currentUserId = userIdRef.current;
      const target = categoriesRef.current.find((c) => c.id === id);
      if (!target) return;

      try {
        await expenseService.updateCategory(user.id, id, cat, target.name);
        const updated = categoriesRef.current.map((c) => (c.id === id ? { ...c, ...cat } : c));
        setCategories(updated);
        if (userIdRef.current === currentUserId) {
          AsyncStorage.setItem("cached_categories", JSON.stringify(updated)).catch((e) =>
            console.error("Failed to cache categories:", e)
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
    [user],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      if (!user) return;
      const currentUserId = userIdRef.current;
      const target = categoriesRef.current.find((c) => c.id === id);
      if (!target) return;

      try {
        await expenseService.deleteCategory(user.id, id, target.name);
        const updated = categoriesRef.current.filter((c) => c.id !== id);
        setCategories(updated);
        if (userIdRef.current === currentUserId) {
          AsyncStorage.setItem("cached_categories", JSON.stringify(updated)).catch((e) =>
            console.error("Failed to cache categories:", e)
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
    [user],
  );

  const isDark = useMemo(() => {
    if (themeMode === "system") return systemColorScheme !== "light";
    return themeMode === "dark";
  }, [themeMode, systemColorScheme]);

  const colors: ColorTheme = useMemo(() => {
    return isDark ? DarkColors : LightColors;
  }, [isDark]);

  const categoryColorMap = useMemo(() => {
    const defaults = isDark ? DEFAULT_CATEGORY_COLORS : LIGHT_CATEGORY_COLORS;
    const map: Record<string, string> = { ...defaults };
    for (const c of categories) {
      const isDefault = Object.values(DEFAULT_CATEGORY_COLORS).includes(c.color);
      map[c.name] = isDefault && !isDark ? (LIGHT_CATEGORY_COLORS[c.name] ?? c.color) : c.color;
    }
    return map;
  }, [categories, isDark]);

  useEffect(() => {
    let mounted = true;
    fetchLiveExchangeRates()
      .then((liveRates) => {
        if (mounted) {
          setRates(liveRates);
          setIsRatesLive(true);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch exchange rates:", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Currency is display-only — amounts stored in base currency (IDR), converted on display
  const setCurrency = useCallback((newCurrency: CurrencyCode) => {
    setDisplayCurrencyState(newCurrency);
    AsyncStorage.setItem("cached_currency", newCurrency);
  }, []);

  const addExpense = useCallback(
    async (data: Omit<Expense, "id">) => {
      if (!user) return;
      const currentUserId = userIdRef.current;
      try {
        const item = await expenseService.addExpense(user.id, data);
        const updated = [item, ...expensesRef.current];
        setExpenses(updated);
        if (userIdRef.current === currentUserId) {
          AsyncStorage.setItem("cached_expenses", JSON.stringify(updated)).catch((e) =>
            console.error("Failed to cache expenses:", e)
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
    [user],
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      if (!user) return;
      const currentUserId = userIdRef.current;
      try {
        await expenseService.deleteExpense(user.id, id);
        const updated = expensesRef.current.filter((e) => e.id !== id);
        setExpenses(updated);
        if (userIdRef.current === currentUserId) {
          AsyncStorage.setItem("cached_expenses", JSON.stringify(updated)).catch((e) =>
            console.error("Failed to cache expenses:", e)
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
    [user],
  );

  const updateExpense = useCallback(
    async (id: string, data: Partial<Omit<Expense, "id">>) => {
      if (!user) return;
      const currentUserId = userIdRef.current;
      try {
        const item = await expenseService.updateExpense(user.id, id, data);
        const updated = expensesRef.current.map((e) => (e.id === id ? item : e));
        setExpenses(updated);
        if (userIdRef.current === currentUserId) {
          AsyncStorage.setItem("cached_expenses", JSON.stringify(updated)).catch((e) =>
            console.error("Failed to cache expenses:", e)
          );
        }
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
      await AsyncStorage.removeItem("cached_expenses").catch(console.error);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const totalSpent = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses],
  );

  const todaySpent = useMemo(() => {
    return expenses
      .filter((e) => e.date === today)
      .reduce((s, e) => s + e.amount, 0);
  }, [expenses, today]);

  const byCategory = useMemo(() => {
    const map: Partial<Record<Category, number>> = {};
    for (const e of expenses) {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    }
    return map;
  }, [expenses]);

  // Convert from base currency to display currency for formatting
  const formatAmount = useCallback(
    (amountInBase: number) => {
      const converted = displayCurrency === BASE_CURRENCY
        ? amountInBase
        : convertAmount(amountInBase, BASE_CURRENCY, displayCurrency, rates);
      return formatMoneyUtil(converted, displayCurrency, separatorStyle);
    },
    [displayCurrency, separatorStyle, rates],
  );

  return useMemo(
    () => ({
      expenses,
      dailyBudget,
      setDailyBudget,
      currency: displayCurrency,
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
    }),
    [
      expenses,
      dailyBudget,
      displayCurrency,
      setCurrency,
      separatorStyle,
      formatAmount,
      rates,
      isRatesLive,
      themeMode,
      isDark,
      colors,
      reminderEnabled,
      reminderTime,
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
    ],
  );
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
