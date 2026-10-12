import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Transaction } from '../types/pennywise';
import { formatPKR, formatDate } from '../utils/formatters';

interface DeleteConfirmDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  transaction,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
      <div className="bg-white rounded-2xl w-full max-w-[320px] p-4 shadow-2xl border-2 border-slate-300 animate-fade-in">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Delete Transaction?</h3>
            <p className="text-[10px] text-slate-500">Cannot be undone.</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-2.5 my-2.5 border border-slate-200 text-[11px] text-slate-700 space-y-1 shadow-inner">
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Category:</span>
            <span className="font-bold text-slate-800">{transaction.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Amount:</span>
            <span className="font-black text-slate-900">{formatPKR(transaction.amountMinor)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Date:</span>
            <span>{formatDate(transaction.transactionDate)}</span>
          </div>
          {transaction.note && (
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Note:</span>
              <span className="truncate max-w-[140px] font-medium">{transaction.note}</span>
            </div>
          )}
        </div>

        <p className="text-[10px] text-slate-500 mb-3">
          This will recalculate your balance and monthly reports.
        </p>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-white border border-slate-300 rounded-lg shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(transaction.id)}
            className="px-3.5 py-1.5 text-[11px] font-black text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-md transition-all cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
