import React from 'react';
import { AuthForm } from '../components/auth/AuthForm';
import { useExpenses } from '../context/ExpenseContext';
import { ShieldCheck } from 'lucide-react';

export const AuthView = () => {
  const { setActiveView } = useExpenses();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col p-4 sm:p-6">
      {/* HEADER */}
      <header className="max-w-sm w-full mx-auto flex items-center justify-between pt-2 mb-8">
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-base shadow-md group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">SpendWise</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 rounded-full text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secure</span>
        </div>
      </header>

      {/* FORM */}
      <main className="flex-1 flex items-center justify-center">
        <AuthForm />
      </main>

      {/* FOOTER */}
      <footer className="text-center text-[11px] text-slate-400 dark:text-slate-500 py-4">
        © 2026 SpendWise. All rights reserved.
      </footer>
    </div>
  );
};
