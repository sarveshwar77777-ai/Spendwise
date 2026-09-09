import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const PrivacyBadge = ({ variant = 'inline' }) => {
  if (variant === 'banner') {
    return (
      <div className="bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Data Security:</span> Your expense entries and budget settings are secured for your authenticated account.
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 rounded-full text-xs font-medium">
      <ShieldCheck className="w-3.5 h-3.5" />
      <span>Secure Student Expense Tracking</span>
    </div>
  );
};

export const ProjectContextNotice = () => {
  return (
    <div className="bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900/90 border border-brand-100 dark:border-slate-800 rounded-2xl p-4 sm:p-5 text-sm text-slate-700 dark:text-slate-300">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-brand-100 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 rounded-xl flex-shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">About SpendWise</h4>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            SpendWise helps students track everyday expenses, manage budgets, and understand their spending habits in one simple place.
          </p>
        </div>
      </div>
    </div>
  );
};
