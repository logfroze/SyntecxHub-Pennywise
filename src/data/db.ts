import { Transaction, TransactionFilter, MonthlyAggregate, TransactionType } from '../types/pennywise';

const STORAGE_KEY = 'pennywise_transactions_v1';

/**
 * In-memory / LocalStorage persistence mirroring Android Room Database & DAO.
 * Operates asynchronously (returning Promises) to mirror Kotlin Coroutines.
 */
class PennywiseDatabase {
  private getRawTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as Transaction[];
    } catch (e) {
      console.error('Failed to parse transactions from local storage', e);
      return [];
    }
  }

  private saveRawTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions to local storage', e);
    }
  }

  /**
   * Insert new transaction (generates unique ID)
   */
  async insertTransaction(
    type: TransactionType,
    amountMinor: number,
    category: string,
    note: string,
    transactionDate: number
  ): Promise<Transaction> {
    await new Promise((resolve) => setTimeout(resolve, 60)); // Simulate async coroutine Room operation
    const transactions = this.getRawTransactions();
    const newId = transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1;
    
    const newRecord: Transaction = {
      id: newId,
      type,
      amountMinor,
      category,
      note: note.trim(),
      transactionDate,
      createdAt: Date.now(),
    };

    transactions.push(newRecord);
    this.saveRawTransactions(transactions);
    return newRecord;
  }

  /**
   * Update existing transaction
   */
  async updateTransaction(
    id: number,
    type: TransactionType,
    amountMinor: number,
    category: string,
    note: string,
    transactionDate: number
  ): Promise<Transaction | null> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const transactions = this.getRawTransactions();
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updated: Transaction = {
      ...transactions[index],
      type,
      amountMinor,
      category,
      note: note.trim(),
      transactionDate,
    };

    transactions[index] = updated;
    this.saveRawTransactions(transactions);
    return updated;
  }

  /**
   * Delete transaction by ID
   */
  async deleteTransaction(id: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const transactions = this.getRawTransactions();
    const filtered = transactions.filter((t) => t.id !== id);
    if (filtered.length === transactions.length) return false;
    this.saveRawTransactions(filtered);
    return true;
  }

  /**
   * Retrieve all transactions sorted by date descending (newest first)
   */
  async getAllTransactions(): Promise<Transaction[]> {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const transactions = this.getRawTransactions();
    return transactions.sort((a, b) => b.transactionDate - a.transactionDate);
  }

  /**
   * Retrieve recent N transactions
   */
  async getRecentTransactions(limit: number = 5): Promise<Transaction[]> {
    const all = await this.getAllTransactions();
    return all.slice(0, limit);
  }

  /**
   * Filter transactions by type, category, date range, or search keyword
   */
  async getFilteredTransactions(filter: TransactionFilter): Promise<Transaction[]> {
    const all = await this.getAllTransactions();
    return all.filter((t) => {
      // Type filter
      if (filter.type !== 'ALL' && t.type !== filter.type) return false;

      // Category filter
      if (filter.category !== 'ALL' && t.category !== filter.category) return false;

      // Date range filter
      if (filter.startDate && t.transactionDate < filter.startDate) return false;
      if (filter.endDate && t.transactionDate > filter.endDate) return false;

      // Search query (matches title or note or category)
      if (filter.searchQuery && filter.searchQuery.trim().length > 0) {
        const query = filter.searchQuery.toLowerCase().trim();
        const matchesCategory = t.category.toLowerCase().includes(query);
        const matchesNote = t.note.toLowerCase().includes(query);
        if (!matchesCategory && !matchesNote) return false;
      }

      return true;
    });
  }

  /**
   * Calculate overall financial summary (All-Time)
   */
  async getOverallSummary(): Promise<{ totalIncomeMinor: number; totalExpenseMinor: number; balanceMinor: number }> {
    const all = await this.getAllTransactions();
    let totalIncomeMinor = 0;
    let totalExpenseMinor = 0;

    for (const t of all) {
      if (t.type === 'INCOME') {
        totalIncomeMinor += t.amountMinor;
      } else {
        totalExpenseMinor += t.amountMinor;
      }
    }

    return {
      totalIncomeMinor,
      totalExpenseMinor,
      balanceMinor: totalIncomeMinor - totalExpenseMinor,
    };
  }

  /**
   * Calculate monthly aggregate metrics and category breakdown
   */
  async getMonthlyAggregate(year: number, month: number): Promise<MonthlyAggregate> {
    const all = await this.getAllTransactions();
    const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0).getTime();
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();

    const monthTransactions = all.filter(
      (t) => t.transactionDate >= startOfMonth && t.transactionDate <= endOfMonth
    );

    let totalIncomeMinor = 0;
    let totalExpenseMinor = 0;
    const expenseByCategory: Record<string, { totalMinor: number; count: number }> = {};

    for (const t of monthTransactions) {
      if (t.type === 'INCOME') {
        totalIncomeMinor += t.amountMinor;
      } else {
        totalExpenseMinor += t.amountMinor;
        if (!expenseByCategory[t.category]) {
          expenseByCategory[t.category] = { totalMinor: 0, count: 0 };
        }
        expenseByCategory[t.category].totalMinor += t.amountMinor;
        expenseByCategory[t.category].count += 1;
      }
    }

    const categoryBreakdown = Object.entries(expenseByCategory).map(([category, data]) => {
      const percentage = totalExpenseMinor > 0 ? (data.totalMinor / totalExpenseMinor) * 100 : 0;
      return {
        category,
        totalMinor: data.totalMinor,
        count: data.count,
        percentage: Math.round(percentage * 10) / 10,
      };
    }).sort((a, b) => b.totalMinor - a.totalMinor);

    return {
      year,
      month,
      totalIncomeMinor,
      totalExpenseMinor,
      netMinor: totalIncomeMinor - totalExpenseMinor,
      categoryBreakdown,
    };
  }

  /**
   * Preload demo records for inspection / testing (optional button for evaluator)
   */
  async loadSampleDemoData(): Promise<void> {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    const sampleData: Omit<Transaction, 'id' | 'createdAt'>[] = [
      { type: 'INCOME', amountMinor: 12000000, category: 'Salary', note: 'Monthly Software Engineer Stipend', transactionDate: now - 12 * oneDay },
      { type: 'INCOME', amountMinor: 3500000, category: 'Freelance', note: 'Android UI Consulting Project', transactionDate: now - 5 * oneDay },
      { type: 'EXPENSE', amountMinor: 1850000, category: 'Food', note: 'Groceries and weekly pantry', transactionDate: now - 1 * oneDay },
      { type: 'EXPENSE', amountMinor: 850000, category: 'Transport', note: 'Fuel & Metro card refill', transactionDate: now - 2 * oneDay },
      { type: 'EXPENSE', amountMinor: 1450000, category: 'Bills', note: 'High speed fiber internet', transactionDate: now - 4 * oneDay },
      { type: 'EXPENSE', amountMinor: 420000, category: 'Entertainment', note: 'Cinema tickets and coffee', transactionDate: now - 6 * oneDay },
      { type: 'EXPENSE', amountMinor: 650000, category: 'Health', note: 'Multivitamins & pharmacy', transactionDate: now - 8 * oneDay },
      { type: 'EXPENSE', amountMinor: 1200000, category: 'Shopping', note: 'Desk accessories & ergonomic pad', transactionDate: now - 10 * oneDay },
      { type: 'EXPENSE', amountMinor: 250000, category: 'Food', note: 'Team lunch with colleagues', transactionDate: now },
    ];

    const records: Transaction[] = sampleData.map((s, idx) => ({
      ...s,
      id: idx + 1,
      createdAt: now - idx * 1000,
    }));

    this.saveRawTransactions(records);
  }

  /**
   * Clear all records
   */
  async clearAllData(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const pennywiseDb = new PennywiseDatabase();
