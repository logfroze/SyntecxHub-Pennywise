import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { Transaction, TransactionType, ALL_CATEGORIES } from '../types/pennywise';
import { formatPKR, formatDate } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface TransactionsViewProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDeleteRequest: (transaction: Transaction) => void;
  onOpenAddModal: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onEdit,
  onDeleteRequest,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | TransactionType>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (typeFilter !== 'ALL') count++;
    if (categoryFilter !== 'ALL') count++;
    if (startDate) count++;
    if (endDate) count++;
    return count;
  }, [typeFilter, categoryFilter, startDate, endDate]);

  const clearAllFilters = () => {
    setTypeFilter('ALL');
    setCategoryFilter('ALL');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
      if (categoryFilter !== 'ALL' && t.category.toLowerCase() !== categoryFilter.toLowerCase())
        return false;

      if (startDate) {
        const startTs = new Date(startDate + 'T00:00:00').getTime();
        if (t.transactionDate < startTs) return false;
      }
      if (endDate) {
        const endTs = new Date(endDate + 'T23:59:59').getTime();
        if (t.transactionDate > endTs) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inNote = t.note.toLowerCase().includes(q);
        const inCat = t.category.toLowerCase().includes(q);
        if (!inNote && !inCat) return false;
      }

      return true;
    });
  }, [transactions, typeFilter, categoryFilter, startDate, endDate, searchQuery]);

  return (
    <div className="space-y-3 pb-16">
      {/* Search & Filter Header (Skeuomorphic Card) */}
      <div className="skeuo-card-paper rounded-2xl p-3 space-y-2 relative">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search memo or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 shadow-inner focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1 cursor-pointer shrink-0 transition-all ${
              activeFiltersCount > 0 || showFilters
                ? 'bg-teal-50 border-teal-300 text-teal-800 shadow-inner'
                : 'bg-white border-slate-300 text-slate-700 shadow-xs hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3 h-3 text-teal-700" />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="w-3.5 h-3.5 rounded-full bg-teal-700 text-white text-[9px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Physical Segmented Switcher */}
        <div className="grid grid-cols-3 p-1 skeuo-groove rounded-xl gap-1">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              typeFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('EXPENSE')}
            className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              typeFilter === 'EXPENSE'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setTypeFilter('INCOME')}
            className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              typeFilter === 'INCOME'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Income
          </button>
        </div>

        {/* Extended Filters Drawer */}
        {showFilters && (
          <div className="pt-2 border-t border-slate-200/90 space-y-2 animate-fade-in text-xs">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 shadow-inner"
                >
                  <option value="ALL">All Categories</option>
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Date Range
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-1/2 px-1.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-[10px] text-slate-900 shadow-inner"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-1/2 px-1.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-[10px] text-slate-900 shadow-inner"
                  />
                </div>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="flex justify-end pt-0.5">
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transactions List (Material Paper Ledger) */}
      <div className="skeuo-card-paper rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight font-mono">
            {filteredTransactions.length} RECORD{filteredTransactions.length !== 1 ? 'S' : ''}
          </span>
          {activeFiltersCount > 0 && (
            <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
              FILTERED
            </span>
          )}
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-dashed divide-slate-200">
            {filteredTransactions.map((t) => {
              const isIncome = t.type === 'INCOME';
              return (
                <div
                  key={t.id}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 -mx-1.5 px-1.5 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CategoryIcon category={t.category} size={16} className="p-1.5 rounded-lg shadow-xs" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {t.note || t.category}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <span className="font-semibold text-slate-600">{t.category}</span>
                        <span>·</span>
                        <span>{formatDate(t.transactionDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-1.5">
                    <div className="text-right">
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

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => onEdit(t)}
                        className="p-1 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors cursor-pointer"
                        title="Edit entry"
                        aria-label="Edit"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteRequest(t)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        title="Delete entry"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center skeuo-groove rounded-xl p-3">
            <AlertCircle className="w-5 h-5 text-slate-400 mx-auto mb-1" />
            <h4 className="text-xs font-bold text-slate-700">No matching entries</h4>
            <p className="text-[10px] text-slate-400 max-w-xs mx-auto mt-0.5">
              {activeFiltersCount > 0 || searchQuery
                ? 'Try broadening your filter criteria.'
                : 'No transactions recorded yet.'}
            </p>
            {activeFiltersCount > 0 ? (
              <button
                onClick={clearAllFilters}
                className="mt-2 px-2.5 py-1 text-[10px] font-bold text-teal-800 bg-white border border-teal-200 rounded-lg shadow-xs cursor-pointer inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            ) : (
              <button
                onClick={onOpenAddModal}
                className="mt-2 px-3 py-1 text-[10px] font-bold text-white skeuo-btn-teal rounded-lg shadow-xs cursor-pointer"
              >
                + Add Entry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
