import { supabase } from "@/lib/supabase";
import type { Expense } from "@/types/expense";
import type { CategoryItem } from "@/constants/theme";

export const expenseService = {
  async fetchExpenses(userId: string) {
    const { data, error } = await supabase
      .from("expenses")
      .select("id, amount, category, date, note")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;
    return (data || []).map((e) => ({
      id: e.id,
      amount: e.amount,
      category: e.category,
      note: e.note ?? "",
      date: e.date,
    }));
  },

  async addExpense(userId: string, data: Omit<Expense, "id">) {
    const { data: inserted, error } = await supabase
      .from("expenses")
      .insert({
        user_id: userId,
        amount: Math.round(data.amount),
        category: data.category,
        date: data.date,
        note: data.note || null,
      })
      .select("id, amount, category, date, note")
      .single();

    if (error) throw error;
    return {
      id: inserted.id,
      amount: inserted.amount,
      category: inserted.category,
      note: inserted.note ?? "",
      date: inserted.date,
    };
  },

  async updateExpense(userId: string, id: string, data: Partial<Omit<Expense, "id">>) {
    const payload: Record<string, unknown> = {};
    if (data.amount !== undefined) payload.amount = Math.round(data.amount);
    if (data.category !== undefined) payload.category = data.category;
    if (data.date !== undefined) payload.date = data.date;
    if (data.note !== undefined) payload.note = data.note || null;

    const { data: updated, error } = await supabase
      .from("expenses")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId)
      .select("id, amount, category, date, note")
      .single();

    if (error) throw error;
    return {
      id: updated.id,
      amount: updated.amount,
      category: updated.category,
      note: updated.note ?? "",
      date: updated.date,
    };
  },

  async deleteExpense(userId: string, id: string) {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
  },

  async clearAllExpenses(userId: string) {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
  },

  async fetchCategories(userId: string) {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, color")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async seedCategories(userId: string, defaultCategories: any[]) {
    const seeds = defaultCategories.map((c) => ({
      user_id: userId,
      name: c.name,
      color: c.color,
      is_default: true,
    }));
    const { data, error } = await supabase
      .from("categories")
      .insert(seeds)
      .select("id, name, color");

    if (error) throw error;
    return data || [];
  },

  async addCategory(userId: string, cat: Omit<CategoryItem, "id">) {
    const { data, error } = await supabase
      .from("categories")
      .insert({
        user_id: userId,
        name: cat.name,
        color: cat.color,
        is_default: false,
      })
      .select("id, name, color")
      .single();

    if (error) throw error;
    return data;
  },

  async updateCategory(userId: string, id: string, cat: Partial<Omit<CategoryItem, "id">>, oldName: string) {
    const newName = cat.name ?? ""; 
    const newColor = cat.color ?? "";

    const { error: updateErr } = await supabase
      .from("categories")
      .update({ name: newName, color: newColor })
      .eq("id", id)
      .eq("user_id", userId);

    if (updateErr) throw updateErr;

    if (oldName !== newName) {
      const { error: expErr } = await supabase
        .from("expenses")
        .update({ category: newName })
        .eq("user_id", userId)
        .eq("category", oldName);
      if (expErr) throw expErr;
    }
  },

  async deleteCategory(userId: string, id: string, categoryName: string) {
    const { error: catErr } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (catErr) throw catErr;

    const { error: expErr } = await supabase
      .from("expenses")
      .update({ category: "Other" })
      .eq("user_id", userId)
      .eq("category", categoryName);

    if (expErr) throw expErr;
  },
};
