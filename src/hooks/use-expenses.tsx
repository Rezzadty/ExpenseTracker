import {
  type Category,
  type CategoryItem,
  type ColorTheme,
  DarkColors,
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY_COLORS,
  LightColors,
} from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import {
  convertAmount,
  FALLBACK_RATES,
  fetchLiveExchangeRates,
} from "@/services/exchange-rate";
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
    if (!user) {
      setExpenses([]);
      setCategories(DEFAULT_CATEGORIES);
      return;
    }

    (async () => {
      const { data: catData } = await supabase
        .from("categories")
        .select("id, name, color")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (mounted) {
        if (catData && catData.length > 0) {
          setCategories(catData);
        } else {
          const seeds = DEFAULT_CATEGORIES.map((c) => ({
            user_id: user.id,
            name: c.name,
            color: c.color,
            is_default: true,
          }));
          const { data: insertedCats } = await supabase
            .from("categories")
            .insert(seeds)
            .select("id, name, color");
          if (mounted && insertedCats) {
            setCategories(insertedCats);
          }
        }
      }

      const { data: expData } = await supabase
        .from("expenses")
        .select("id, amount, category, date, note")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (mounted && expData) {
        setExpenses(
          expData.map((e) => ({
            id: e.id,
            amount: e.amount,
            category: e.category,
            note: e.note ?? "",
            date: e.date,
          })),
        );
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user]);

  const addCategory = useCallback(
    async (cat: Omit<CategoryItem, "id">) => {
      if (!user) return;
      const { data: inserted, error } = await supabase
        .from("categories")
        .insert({
          user_id: user.id,
          name: cat.name,
          color: cat.color,
          is_default: false,
        })
        .select("id, name, color")
        .single();

      if (!error && inserted) {
        setCategories((prev) => [...prev, inserted]);
      }
    },
    [user],
  );

  const updateCategory = useCallback(
    async (id: string, cat: Partial<Omit<CategoryItem, "id">>) => {
      if (!user) return;
      const target = categories.find((c) => c.id === id);
      if (!target) return;
      const oldName = target.name;
      const newName = cat.name ?? target.name;
      const newColor = cat.color ?? target.color;

      const { error } = await supabase
        .from("categories")
        .update({ name: newName, color: newColor })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) return;

      if (oldName !== newName) {
        await supabase
          .from("expenses")
          .update({ category: newName })
          .eq("user_id", user.id)
          .eq("category", oldName);

        setExpenses((currExp) =>
          currExp.map((e) =>
            e.category === oldName ? { ...e, category: newName } : e,
          ),
        );
      }

      setCategories((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, name: newName, color: newColor } : c,
        ),
      );
    },
    [user, categories],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      if (!user) return;
      const target = categories.find((c) => c.id === id);
      if (!target) return;

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) return;

      await supabase
        .from("expenses")
        .update({ category: "Other" })
        .eq("user_id", user.id)
        .eq("category", target.name);

      setExpenses((currExp) =>
        currExp.map((e) =>
          e.category === target.name ? { ...e, category: "Other" } : e,
        ),
      );
      setCategories((prev) => prev.filter((c) => c.id !== id));
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
      const { data: inserted, error } = await supabase
        .from("expenses")
        .insert({
          user_id: user.id,
          amount: Math.round(data.amount),
          category: data.category,
          date: data.date,
          note: data.note || null,
        })
        .select("id, amount, category, date, note")
        .single();

      if (error || !inserted) return;

      const item: Expense = {
        id: inserted.id,
        amount: inserted.amount,
        category: inserted.category,
        note: inserted.note ?? "",
        date: inserted.date,
      };
      setExpenses((prev) => [item, ...prev]);
    },
    [user],
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      if (!user) return;
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (!error) {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
      }
    },
    [user],
  );

  const clearAllExpenses = useCallback(async () => {
    if (!user) return;
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("user_id", user.id);
    if (!error) {
      setExpenses([]);
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
