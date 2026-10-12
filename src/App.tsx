/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { pennywiseDb } from './data/db';
import { Transaction, MonthlyAggregate, TransactionType } from './types/pennywise';
import { generateTransactionsCsv, downloadCsvFile } from './utils/formatters';
import { AndroidDeviceFrame, ActiveTab } from './components/AndroidDeviceFrame';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { ReportsView } from './components/ReportsView';
import { ProfileView } from './components/ProfileView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';
import { ToastFeedback, ToastMessage } from './components/ToastFeedback';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Overall Financial State
  const [balanceMinor, setBalanceMinor] = useState<number>(0);
  const [totalIncomeMinor, setTotalIncomeMinor] = useState<number>(0);
  const [totalExpenseMinor, setTotalExpenseMinor] = useState<number>(0);

  // Transaction Lists
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  // Month & Reports State
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [monthlyAggregate, setMonthlyAggregate] = useState<MonthlyAggregate>({
    year: now.getFullYear(),
    month: now.getMonth(),
    totalIncomeMinor: 0,
    totalExpenseMinor: 0,
    netMinor: 0,
    categoryBreakdown: [],
  });

  // Modal & Feedback States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({
      id: Math.random().toString(),
      type,
      message,
    });
  }, []);

  // Reload all states from database
  const refreshData = useCallback(async () => {
    try {
      const summary = await pennywiseDb.getOverallSummary();
      setBalanceMinor(summary.balanceMinor);
      setTotalIncomeMinor(summary.totalIncomeMinor);
      setTotalExpenseMinor(summary.totalExpenseMinor);

      const all = await pennywiseDb.getAllTransactions();
      setAllTransactions(all);

      const recent = await pennywiseDb.getRecentTransactions(5);
      setRecentTransactions(recent);

      const agg = await pennywiseDb.getMonthlyAggregate(selectedYear, selectedMonth);
      setMonthlyAggregate(agg);
    } catch (err) {
      console.error('Error refreshing database data:', err);
      showToast('Error syncing with database', 'error');
    }
  }, [selectedYear, selectedMonth, showToast]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Month Navigation
  const handleNavigateMonth = (delta: number) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  // Add or Edit Transaction
  const handleSaveTransaction = async (data: {
    id?: number;
    type: TransactionType;
    amountMinor: number;
    category: string;
    note: string;
    transactionDate: number;
  }) => {
    try {
      if (data.id) {
        await pennywiseDb.updateTransaction(
          data.id,
          data.type,
          data.amountMinor,
          data.category,
          data.note,
          data.transactionDate
        );
        showToast('Ledger entry updated', 'success');
      } else {
        await pennywiseDb.insertTransaction(
          data.type,
          data.amountMinor,
          data.category,
          data.note,
          data.transactionDate
        );
        showToast('Saved to Room DB', 'success');
      }

      setIsAddModalOpen(false);
      setEditingTransaction(null);
      await refreshData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save transaction', 'error');
    }
  };

  // Delete Transaction
  const handleConfirmDelete = async (id: number) => {
    try {
      await pennywiseDb.deleteTransaction(id);
      setTransactionToDelete(null);
      showToast('Entry removed & balances recalculated', 'info');
      await refreshData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete transaction', 'error');
    }
  };

  // Export CSV via Storage Access Framework
  const handleExportCsv = async () => {
    try {
      const records = await pennywiseDb.getAllTransactions();
      if (records.length === 0) {
        showToast('No transactions to export', 'info');
        return;
      }
      const csvString = generateTransactionsCsv(records);
      downloadCsvFile(csvString, 'pennywise_transactions.csv');
      showToast('Exported pennywise_transactions.csv', 'success');
    } catch (err) {
      console.error(err);
      showToast('CSV export failed', 'error');
    }
  };

  // Load sample demo data
  const handleLoadSampleData = async () => {
    try {
      await pennywiseDb.loadSampleDemoData();
      showToast('Loaded demo dataset', 'success');
      await refreshData();
    } catch (err) {
      console.error(err);
      showToast('Failed to load demo data', 'error');
    }
  };

  // Purge all records from database
  const handleClearAllData = async () => {
    try {
      await pennywiseDb.clearAllData();
      showToast('All transaction records purged', 'info');
      await refreshData();
    } catch (err) {
      console.error(err);
      showToast('Failed to clear database', 'error');
    }
  };

  return (
    <AndroidDeviceFrame
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onOpenAddModal={() => {
        setEditingTransaction(null);
        setIsAddModalOpen(true);
      }}
    >
      {activeTab === 'dashboard' && (
        <DashboardView
          balanceMinor={balanceMinor}
          totalIncomeMinor={totalIncomeMinor}
          totalExpenseMinor={totalExpenseMinor}
          recentTransactions={recentTransactions}
          monthlyAggregate={monthlyAggregate}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onNavigateMonth={handleNavigateMonth}
          onOpenAddModal={() => {
            setEditingTransaction(null);
            setIsAddModalOpen(true);
          }}
          onNavigateToHistory={() => setActiveTab('transactions')}
          onSelectTransactionForEdit={(txn) => {
            setEditingTransaction(txn);
            setIsAddModalOpen(true);
          }}
          onLoadSampleData={handleLoadSampleData}
        />
      )}

      {activeTab === 'transactions' && (
        <TransactionsView
          transactions={allTransactions}
          onEdit={(txn) => {
            setEditingTransaction(txn);
            setIsAddModalOpen(true);
          }}
          onDeleteRequest={(txn) => setTransactionToDelete(txn)}
          onOpenAddModal={() => {
            setEditingTransaction(null);
            setIsAddModalOpen(true);
          }}
        />
      )}

      {activeTab === 'reports' && (
        <ReportsView
          monthlyAggregate={monthlyAggregate}
          allTimeBalanceMinor={balanceMinor}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onNavigateMonth={handleNavigateMonth}
          onExportCsv={handleExportCsv}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileView
          onExportCsv={handleExportCsv}
          onLoadSampleData={handleLoadSampleData}
          onClearAllData={handleClearAllData}
          onNotify={showToast}
        />
      )}

      {/* Add / Edit Transaction Modal (strictly inside mobile screen) */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        initialTransaction={editingTransaction}
      />

      {/* Delete Confirmation Dialog (strictly inside mobile screen) */}
      <DeleteConfirmDialog
        isOpen={!!transactionToDelete}
        transaction={transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notification (strictly inside mobile screen) */}
      <ToastFeedback toast={toast} onDismiss={() => setToast(null)} />
    </AndroidDeviceFrame>
  );
}
