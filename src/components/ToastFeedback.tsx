import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastFeedbackProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const ToastFeedback: React.FC<ToastFeedbackProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="absolute bottom-16 left-3 right-3 z-50 pointer-events-auto transition-all animate-fade-in">
      <div className="bg-[#1E293B] text-white px-3 py-2.5 rounded-xl shadow-xl border border-slate-700/80 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 truncate">
          {toast.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
          <span className="font-semibold text-slate-100 truncate text-[11px]">{toast.message}</span>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
