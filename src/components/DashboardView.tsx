import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  ArrowRight,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Transaction, MonthlyAggregate } from '../types/pennywise';
import { formatPKR, formatRelativeDate, formatMonthYear } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface DashboardViewProps {
  balanceMinor: number;
  totalIncomeMinor: number;
  totalExpenseMinor: number;
  recentTransactions: Transaction[];
  monthlyAggregate: MonthlyAggregate;
  selectedYear: number;
  selectedMonth: number;
  onNavigateMonth: (delta: number) => void;
  onOpenAddModal: () => void;
  onNavigateToHistory: () => void;
  onSelectTransactionForEdit: (transaction: Transaction) => void;
  onLoadSampleData: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  balanceMinor,
  totalIncomeMinor,
  totalExpenseMinor,
  recentTransactions,
  monthlyAggregate,
  selectedYear,
  selectedMonth,
  onNavigateMonth,
  onOpenAddModal,
  onNavigateToHistory,
  onSelectTransactionForEdit,
  onLoadSampleData,
}) => {
  const hasExpenseData = monthlyAggregate.totalExpenseMinor > 0;
  const topCategories = monthlyAggregate.categoryBreakdown.slice(0, 3);

  return (
    <div className="space-y-3 pb-16">
      {/* Month Navigator Header (Material Bar with physical bevel) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-teal-700" />
          <span>{formatMonthYear(selectedYear, selectedMonth)}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigateMonth(-1)}
            className="px-2 py-0.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 active:translate-y-0.5 active:shadow-inner transition-all cursor-pointer"
            title="Previous Month"
          >
            ‹ Prev
          </button>
          <button
            onClick={() => onNavigateMonth(1)}
            className="px-2 py-0.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 active:translate-y-0.5 active:shadow-inner transition-all cursor-pointer"
            title="Next Month"
          >
            Next ›
          </button>
        </div>
      </div>

      {/* SKEUOMORPHIC LEATHER WALLET BALANCE CARD (Material Design Elevation + Stitched Leather) */}
      <div className="skeuo-leather rounded-2xl p-4 text-white shadow-xl relative overflow-hidden">
        {/* Decorative realistic leather stitching perimeter */}
        <div className="absolute inset-1.5 rounded-xl skeuo-leather-stitch pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#2dd4bf]" />
                <span className="text-[9px] font-bold tracking-widest text-slate-300 uppercase font-mono">
                  CURRENT BALANCE (PKR)
                </span>
              </div>
              <div className="text-2xl font-black tracking-tight text-white mt-1 drop-shadow-md">
                {formatPKR(balanceMinor)}
              </div>
              <span className="text-[9px] text-slate-400 font-medium">
                Lifetime net recorded funds
              </span>
            </div>

            {/* Brass emblem rivet */}
            <div className="w-8 h-8 rounded-full skeuo-coin-badge flex items-center justify-center text-amber-950 shadow-md">
              <Wallet className="w-4 h-4 text-amber-950" />
            </div>
          </div>

          {/* Physical Inset Compartments for Income & Expense */}
          <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-slate-700/60">
            <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-700/50 shadow-inner">
              <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold mb-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>Total Income</span>
              </div>
              <div className="text-xs font-bold text-emerald-300">
                {formatPKR(totalIncomeMinor)}
              </div>
            </div>

            <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-700/50 shadow-inner">
              <div className="flex items-center gap-1 text-rose-400 text-[10px] font-bold mb-0.5">
                <TrendingDown className="w-3 h-3" />
                <span>Total Expense</span>
              </div>
              <div className="text-xs font-bold text-rose-300">
                {formatPKR(totalExpenseMinor)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SKEUOMORPHIC NOTEPAD LEDGER CARD: Monthly Spending Breakdown */}
      <div className="skeuo-card-paper rounded-2xl p-3.5 relative overflow-hidden">
        {/* Top subtle ruled line accent */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">
              Monthly Spending
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Spent: {formatPKR(monthlyAggregate.totalExpenseMinor)}
            </p>
          </div>
          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 shadow-2xs">
            Net: {formatPKR(monthlyAggregate.netMinor, true)}
          </span>
        </div>

        {hasExpenseData ? (
          <div className="space-y-2.5 pt-0.5">
            {/* Skeuomorphic tactile meter bar with grooved track */}
            <div className="w-full h-3 skeuo-groove rounded-full overflow-hidden flex p-[1.5px]">
              {monthlyAggregate.categoryBreakdown.map((cat, idx) => {
                const colors = [
                  'bg-rose-500',
                  'bg-blue-500',
                  'bg-amber-500',
                  'bg-purple-500',
                  'bg-pink-500',
                  'bg-emerald-500',
                  'bg-slate-500',
                ];
                const color = colors[idx % colors.length];
                return (
                  <div
                    key={cat.category}
                    className={`h-full ${color} rounded-sm transition-all duration-300 shadow-xs`}
                    style={{ width: `${cat.percentage}%` }}
                    title={`${cat.category}: ${cat.percentage}%`}
                  />
                );
              })}
            </div>

            {/* Top Categories Grid */}
            <div className="space-y-1.5 pt-0.5">
              {topCategories.map((cat) => (
                <div
                  key={cat.category}
                  className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50/90 border border-slate-200/80 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <CategoryIcon category={cat.category} size={13} className="p-1 rounded-md" />
                    <span className="font-bold text-slate-800 text-[11px] truncate">
                      {cat.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({cat.percentage}%)
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-[11px] shrink-0">
                    {formatPKR(cat.totalMinor)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 text-center skeuo-groove rounded-xl p-3">
            <p className="text-[11px] font-bold text-slate-600">No expenses this month</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Add transactions to see your spending ledger.
            </p>
          </div>
        )}
      </div>

      {/* SKEUOMORPHIC PHYSICAL PAPER RECEIPT: Recent Transactions */}
      <div className="skeuo-card-paper rounded-2xl p-3.5 relative">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">
              Recent Transactions
            </h3>
            <p className="text-[10px] text-slate-500">Activity stream</p>
          </div>
          <button
            onClick={onNavigateToHistory}
            className="inline-flex items-center gap-0.5 text-[11px] font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
          >
            <span>See all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-dashed divide-slate-200">
            {recentTransactions.map((t) => {
              const isIncome = t.type === 'INCOME';
              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTransactionForEdit(t)}
                  className="py-2 flex items-center justify-between hover:bg-slate-50 -mx-1.5 px-1.5 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CategoryIcon category={t.category} size={15} className="p-1.5 rounded-lg shadow-xs" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate group-hover:text-teal-800">
                        {t.note || t.category}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <span>{t.category}</span>
                        <span>·</span>
                        <span>{formatRelativeDate(t.transactionDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <div
                      className={`text-xs font-black ${
                        isIncome ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatPKR(t.amountMinor)}
                    </div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">
                      {isIncome ? 'Income' : 'Expense'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center skeuo-groove rounded-xl p-3">
            <p className="text-xs font-bold text-slate-700">Ledger is currently empty</p>
            <p className="text-[10px] text-slate-400 max-w-xs mx-auto mt-0.5 mb-2.5">
              Record your first transaction in PKR.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={onOpenAddModal}
                className="px-3 py-1.5 text-[11px] font-bold text-white skeuo-btn-teal rounded-lg shadow-xs cursor-pointer"
              >
                + Add Record
              </button>
              <button
                onClick={onLoadSampleData}
                className="px-2.5 py-1.5 text-[10px] font-bold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 active:translate-y-0.5 cursor-pointer flex items-center gap-1"
                title="Load internship sample dataset"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Demo Data</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
