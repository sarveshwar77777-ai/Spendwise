import React from 'react';
import { Receipt, Sparkles, PlusCircle } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

export const EmptyState = ({ 
  title = "No expenses recorded yet", 
  description = "Start by adding your everyday college spending or load sample demo data to see how SpendWise works.",
  actionText = "Add Expense",
  onAction,
  showDemoButton = true
}) => {
  const { loadDemoData, setActiveView } = useExpenses();

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
      <div className="p-4 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl mb-4 shadow-sm">
        <Receipt className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-md">{description}</p>
      
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onAction ? (
          <button
            onClick={onAction}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            {actionText}
          </button>
        ) : (
          <button
            onClick={() => setActiveView('add-expense')}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            {actionText}
          </button>
        )}

        {showDemoButton && (
          <button
            onClick={loadDemoData}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm rounded-xl transition-all flex items-center gap-2 border border-slate-200/60 dark:border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Load Demo Data
          </button>
        )}
      </div>
    </div>
  );
};
