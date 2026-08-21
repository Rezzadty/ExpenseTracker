import type { Category } from '@/constants/theme';

export type Expense = {
  id: string;
  amount: number;
  category: Category;
  note: string;
  date: string;
};
