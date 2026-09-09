import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

export const Footer = () => {
  const { setActiveView } = useExpenses();

  return (
    <footer className="mt-12 border-t border-slate-200/80 dark:border-slate-800/80 py-8 px-4 sm:px-8 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div>
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            SpendWise — Student Expense Manager
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
            Track expenses, manage budgets, and understand spending habits in one simple place.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveView('landing')} 
            className="hover:underline hover:text-slate-800 dark:hover:text-slate-200"
          >
            About
          </button>
          <button 
            onClick={() => setActiveView('settings')} 
            className="hover:underline hover:text-slate-800 dark:hover:text-slate-200"
          >
            Settings
          </button>
          <span>© 2026 SpendWise. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
