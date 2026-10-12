export type TransactionType = 'INCOME' | 'EXPENSE';

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
  color: string;
  bgColor: string;
}

export const EXPENSE_CATEGORIES: CategoryItem[] = [
  { id: 'food', name: 'Food', icon: 'Utensils', type: 'EXPENSE', color: '#EF4444', bgColor: '#FEE2E2' },
  { id: 'transport', name: 'Transport', icon: 'Bus', type: 'EXPENSE', color: '#3B82F6', bgColor: '#DBEAFE' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', type: 'EXPENSE', color: '#F59E0B', bgColor: '#FEF3C7' },
  { id: 'bills', name: 'Bills', icon: 'Receipt', type: 'EXPENSE', color: '#8B5CF6', bgColor: '#EDE9FE' },
  { id: 'health', name: 'Health', icon: 'HeartPulse', type: 'EXPENSE', color: '#EC4899', bgColor: '#FCE7F3' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', type: 'EXPENSE', color: '#10B981', bgColor: '#D1FAE5' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Film', type: 'EXPENSE', color: '#6366F1', bgColor: '#E0E7FF' },
  { id: 'other_expense', name: 'Other', icon: 'MoreHorizontal', type: 'EXPENSE', color: '#6B7280', bgColor: '#F3F4F6' },
];

export const INCOME_CATEGORIES: CategoryItem[] = [
  { id: 'salary', name: 'Salary', icon: 'Briefcase', type: 'INCOME', color: '#059669', bgColor: '#D1FAE5' },
  { id: 'freelance', name: 'Freelance', icon: 'Laptop', type: 'INCOME', color: '#0284C7', bgColor: '#E0F2FE' },
  { id: 'business', name: 'Business', icon: 'Building2', type: 'INCOME', color: '#7C3AED', bgColor: '#EDE9FE' },
  { id: 'allowance', name: 'Allowance', icon: 'Gift', type: 'INCOME', color: '#D97706', bgColor: '#FEF3C7' },
  { id: 'other_income', name: 'Other', icon: 'MoreHorizontal', type: 'INCOME', color: '#4B5563', bgColor: '#F3F4F6' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export interface Transaction {
  id: number;
  type: TransactionType;
  /**
   * Amount stored in minor units (paisas) to completely prevent floating point rounding errors.
   * e.g., 1000.50 PKR = 100050 paisas.
   */
  amountMinor: number;
  category: string;
  note: string;
  transactionDate: number; // epoch timestamp in milliseconds
  createdAt: number;
}

export interface TransactionFilter {
  type: 'ALL' | TransactionType;
  category: string | 'ALL';
  startDate?: number;
  endDate?: number;
  searchQuery?: string;
}

export interface MonthlyAggregate {
  year: number;
  month: number; // 0-indexed (0 = Jan, 11 = Dec)
  totalIncomeMinor: number;
  totalExpenseMinor: number;
  netMinor: number;
  categoryBreakdown: {
    category: string;
    totalMinor: number;
    count: number;
    percentage: number;
  }[];
}
