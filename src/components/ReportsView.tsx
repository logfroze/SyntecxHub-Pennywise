import React from 'react';
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  PieChart,
  FileSpreadsheet,
} from 'lucide-react';
import { MonthlyAggregate } from '../types/pennywise';
import { formatPKR, formatMonthYear } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface ReportsViewProps {
  monthlyAggregate: MonthlyAggregate;
  allTimeBalanceMinor: number;
  selectedYear: number;
  selectedMonth: number;
  onNavigateMonth: (delta: number) => void;
  onExportCsv: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  monthlyAggregate,
  allTimeBalanceMinor,
  selectedYear,
  selectedMonth,
  onNavigateMonth,
  onExportCsv,
}) => {
  const { totalIncomeMinor, totalExpenseMinor, netMinor, categoryBreakdown } = monthlyAggregate;
  const isMonthEmpty = totalIncomeMinor === 0 && totalExpenseMinor === 0;

  return (
    <div className="space-y-3 pb-16">
      {/* Month Navigator Header */}
      <div className="skeuo-card-paper rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-teal-700" />
          <h2 className="text-xs font-black text-slate-900 tracking-tight font-mono">
            {formatMonthYear(selectedYear, selectedMonth)}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigateMonth(-1)}
            className="px-2 py-0.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 active:translate-y-0.5 cursor-pointer"
          >
            ‹ Prev
          </button>
          <button
            onClick={() => onNavigateMonth(1)}
            className="px-2 py-0.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 active:translate-y-0.5 cursor-pointer"
          >
            Next ›
          </button>
        </div>
      </div>

      {/* SKEUOMORPHIC LEATHER SUMMARY TILE: Monthly Net Flow */}
      <div className="skeuo-leather rounded-2xl p-3.5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-1.5 rounded-xl skeuo-leather-stitch pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest font-mono block mb-0.5">
            MONTH CASHFLOW · NET
          </span>
          <div
            className={`text-xl font-black tracking-tight drop-shadow-md ${
              netMinor >= 0 ? 'text-teal-300' : 'text-rose-300'
            }`}
          >
            {formatPKR(netMinor, true)}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-700/60">
            <div className="bg-slate-900/60 rounded-lg p-1.5 border border-slate-700/50 shadow-inner">
              <span className="text-[8px] font-bold text-emerald-400 block">INCOME</span>
              <span className="text-[11px] font-black text-white">{formatPKR(totalIncomeMinor)}</span>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-1.5 border border-slate-700/50 shadow-inner">
              <span className="text-[8px] font-bold text-rose-400 block">EXPENSES</span>
              <span className="text-[11px] font-black text-white">{formatPKR(totalExpenseMinor)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lifetime Balance Banner */}
      <div className="skeuo-groove rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px]">
        <span className="text-slate-500 font-medium">All-time lifetime balance:</span>
        <span className="font-extrabold text-slate-900 font-mono">{formatPKR(allTimeBalanceMinor)}</span>
      </div>

      {/* Category Breakdown (Paper Ledger with Progress Meters) */}
      <div className="skeuo-card-paper rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-teal-700" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">
              Category Breakdown
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {categoryBreakdown.length} Categories
          </span>
        </div>

        {!isMonthEmpty && categoryBreakdown.length > 0 ? (
          <div className="space-y-2.5">
            {categoryBreakdown.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <CategoryIcon category={item.category} size={14} className="p-1 rounded-md" />
                    <span className="font-bold text-slate-800 text-[11px]">{item.category}</span>
                    <span className="text-[10px] text-slate-400">({item.count})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 mr-1.5 text-[11px]">{formatPKR(item.totalMinor)}</span>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1 py-0.5 rounded border border-teal-200">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 skeuo-groove rounded-full overflow-hidden p-[1px]">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all duration-300 shadow-xs"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center skeuo-groove rounded-xl p-3">
            <p className="text-[11px] font-bold text-slate-600">No activity this month</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Add transactions for {formatMonthYear(selectedYear, selectedMonth)} to generate reports.
            </p>
          </div>
        )}
      </div>

      {/* CSV Export Card with Physical Button */}
      <div className="skeuo-card-paper rounded-2xl p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl skeuo-groove flex items-center justify-center text-teal-700 shrink-0">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-slate-900 leading-tight">Export Ledger (SAF)</h4>
            <p className="text-[9px] text-slate-400 font-mono">pennywise_transactions.csv</p>
          </div>
        </div>

        <button
          onClick={onExportCsv}
          className="px-3 py-1.5 skeuo-btn-teal text-white text-[11px] font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};
