import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  PieChart, 
  Smartphone, 
  Lock,
  Layers,
  Heart
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { Footer } from '../components/layout/Footer';

export const LandingPage = () => {
  const { setActiveView, loadDemoData, isDemo } = useExpenses();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      {/* NAVBAR */}
      <header className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-500/20">
              S
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight block">SpendWise</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block -mt-1">Student Manager</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!isDemo) loadDemoData();
                setActiveView('dashboard');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>View Demo</span>
            </button>

            <button
              onClick={() => setActiveView('dashboard')}
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1">
        <section className="px-6 py-16 sm:py-24 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span>Project Better Tomorrow – Pathway B: Fresh Discovery Track</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight">
            Take Control of Your <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">Student Spending</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Track your everyday expenses, understand your spending habits, and stay within your budget.
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-6 py-3.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-2xl shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                loadDemoData();
                setActiveView('dashboard');
              }}
              className="px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Explore Interactive Demo</span>
            </button>
          </div>

          {/* PROJECT DISCLAIMER BADGE */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 max-w-xl mx-auto text-xs text-slate-500 dark:text-slate-400">
            <p>
              💡 <strong>Prototype Note:</strong> SpendWise is a design-thinking prototype created for student financial discovery. Data is kept private and stored strictly in your browser.
            </p>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section className="px-6 py-16 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Why SpendWise?</h2>
              <p className="text-slate-500 text-sm max-w-xl mx-auto">
                Designed explicitly for college students balancing canteen expenses, textbook costs, transit passes, and monthly allowances.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Track Expenses</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Log transactions with UPI, Cash, or Card details. Categorize canteen lunches, rickshaws, and mobile recharges instantly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <PieChart className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Manage Budgets</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Set overall monthly caps and category targets. Get friendly warnings before you hit your limits.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Understand Spending</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  View daily averages, top 3 categories, and period-over-period trends calculated directly from your entries.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Student Privacy</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  No bank logins, no passwords, no ads. All data remains saved locally in your browser's private storage.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
