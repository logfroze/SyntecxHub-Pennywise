import React, { useState, useEffect } from 'react';
import { X, Calendar, Check, AlertCircle } from 'lucide-react';
import { Transaction, TransactionType, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types/pennywise';
import { CategoryIcon } from './CategoryIcon';
import { parseToMinorUnits, CURRENCY_SYMBOL } from '../utils/formatters';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: number;
    type: TransactionType;
    amountMinor: number;
    category: string;
    note: string;
    transactionDate: number;
  }) => void;
  initialTransaction?: Transaction | null;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTransaction,
}) => {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amountStr, setAmountStr] = useState<string>('');
  const [category, setCategory] = useState<string>('Food');
  const [dateStr, setDateStr] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>({});

  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type);
      setAmountStr((initialTransaction.amountMinor / 100).toFixed(2).replace(/\.00$/, ''));
      setCategory(initialTransaction.category);
      setNote(initialTransaction.note || '');
      const d = new Date(initialTransaction.transactionDate);
      setDateStr(d.toISOString().split('T')[0]);
    } else {
      setType('EXPENSE');
      setAmountStr('');
      setCategory('Food');
      setNote('');
      const today = new Date().toISOString().split('T')[0];
      setDateStr(today);
    }
    setErrors({});
  }, [initialTransaction, isOpen]);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'EXPENSE') {
      if (!EXPENSE_CATEGORIES.some((c) => c.name === category)) {
        setCategory('Food');
      }
    } else {
      if (!INCOME_CATEGORIES.some((c) => c.name === category)) {
        setCategory('Salary');
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(val)) {
      setAmountStr(val);
      if (errors.amount) {
        setErrors((prev) => ({ ...prev, amount: undefined }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { amount?: string; category?: string } = {};
    const minorAmount = parseToMinorUnits(amountStr);

    if (!amountStr.trim() || minorAmount <= 0) {
      newErrors.amount = 'Please enter an amount > 0 PKR';
    }

    if (!category.trim()) {
      newErrors.category = 'Select a category';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let timestamp = Date.now();
    if (dateStr) {
      const parsed = new Date(dateStr + 'T12:00:00');
      if (!isNaN(parsed.getTime())) {
        timestamp = parsed.getTime();
      }
    }

    onSave({
      id: initialTransaction ? initialTransaction.id : undefined,
      type,
      amountMinor: minorAmount,
      category,
      note,
      transactionDate: timestamp,
    });
  };

  if (!isOpen) return null;

  const currentCategories = type === 'EXPENSE' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-2xs p-2">
      <div className="w-full max-h-[90%] bg-white rounded-3xl flex flex-col shadow-2xl border-2 border-slate-300 overflow-hidden animate-slide-up">
        {/* Physical Stitched Header */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-tight">
              {initialTransaction ? 'Edit Ledger Entry' : 'Record Transaction'}
            </h2>
            <p className="text-[10px] text-slate-500 font-medium">Currency: Pakistani Rupee (PKR)</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-100 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-3.5 overflow-y-auto space-y-3 flex-1 text-xs">
          {/* Skeuomorphic Inset Switcher */}
          <div className="grid grid-cols-2 p-1 skeuo-groove rounded-xl gap-1">
            <button
              type="button"
              onClick={() => handleTypeChange('EXPENSE')}
              className={`py-1.5 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                type === 'EXPENSE'
                  ? 'bg-rose-600 text-white shadow-md border-t border-rose-400'
                  : 'text-slate-600 hover:text-slate-900 font-bold'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('INCOME')}
              className={`py-1.5 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                type === 'INCOME'
                  ? 'bg-teal-700 text-white shadow-md border-t border-teal-500'
                  : 'text-slate-600 hover:text-slate-900 font-bold'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Amount Inset Input Field */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
              Amount ({CURRENCY_SYMBOL}) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 font-mono">
                {CURRENCY_SYMBOL}
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={amountStr}
                onChange={handleAmountChange}
                placeholder="0.00"
                autoFocus={!initialTransaction}
                className={`w-full pl-10 pr-3 py-2 bg-slate-50 border rounded-xl text-base font-black text-slate-900 shadow-inner focus:outline-hidden focus:ring-2 focus:bg-white transition-all ${
                  errors.amount
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:ring-teal-200 focus:border-teal-600'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-[10px] text-rose-500 flex items-center gap-1 font-bold">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Physical Category Tiles Grid */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {currentCategories.map((c) => {
                const isSelected = category.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCategory(c.name);
                      if (errors.category) {
                        setErrors((prev) => ({ ...prev, category: undefined }));
                      }
                    }}
                    className={`flex flex-col items-center p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-700 bg-teal-50 shadow-inner ring-1 ring-teal-700'
                        : 'border-slate-200 bg-white shadow-xs hover:bg-slate-50'
                    }`}
                  >
                    <CategoryIcon category={c.name} size={15} className="p-1 mb-0.5" />
                    <span
                      className={`text-[9px] font-bold leading-tight truncate w-full ${
                        isSelected ? 'text-teal-900' : 'text-slate-700'
                      }`}
                    >
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="mt-1 text-[10px] text-rose-500 flex items-center gap-1 font-bold">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 shadow-inner focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Note / Memo */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
              Memo / Note <span className="text-slate-400 normal-case">(Optional)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Lunch with team, Groceries..."
              maxLength={80}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-inner focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:bg-white"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:translate-y-0.5 cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-[11px] font-black text-white skeuo-btn-teal rounded-xl shadow-md flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              {initialTransaction ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
