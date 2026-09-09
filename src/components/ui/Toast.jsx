import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

export const Toast = () => {
  const { toast } = useExpenses();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 flex-shrink-0" />
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 animate-bounce-short">
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-4 py-3 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-sm">
        {icons[toast.type] || icons.success}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
};
