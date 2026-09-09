import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

export const Footer = () => {
  const { setActiveView } = useExpenses();

  return (
    <footer className="mt-12 border-t border-slate-200/80 dark:border-slate-800/80 py-8 px-4 sm:px-8 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div>
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            SpendWise — Student Expense Manager Prototype
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
            Project Better Tomorrow – Pathway B: Fresh Discovery Track
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Local Storage Engine (No external backend required)</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveView('landing')} 
            className="hover:underline hover:text-slate-800 dark:hover:text-slate-200"
          >
            About Prototype
          </button>
          <button 
            onClick={() => setActiveView('settings')} 
            className="hover:underline hover:text-slate-800 dark:hover:text-slate-200"
          >
            Privacy & Settings
          </button>
        </div>
      </div>
    </footer>
  );
};
