import React from 'react';
import { AuthForm } from '../components/auth/AuthForm';
import { PrivacyBadge } from '../components/ui/PrivacyBadge';
import { useExpenses } from '../context/ExpenseContext';

export const AuthView = () => {
  const { setActiveView } = useExpenses();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6">
      {/* BRANDING HEADER */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <button 
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-base shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">SpendWise</span>
        </button>

        <PrivacyBadge variant="inline" />
      </header>

      {/* MAIN AUTH FORM */}
      <main className="my-auto py-8">
        <AuthForm />
      </main>

      {/* FOOTER NOTE */}
      <footer className="text-center text-[11px] text-slate-400 dark:text-slate-500 pb-2">
        Project Better Tomorrow – Pathway B: Fresh Discovery Track
      </footer>
    </div>
  );
};
