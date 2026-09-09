import React from 'react';
import { PlusCircle, Sparkles, Sun, Moon, LogOut, User as UserIcon, LogIn, AlertCircle } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export const Header = () => {
  const { 
    activeView, 
    setActiveView, 
    isDemo, 
    loadDemoData, 
    removeDemoData, 
    settings, 
    toggleTheme,
    user,
    profile,
    signOut
  } = useExpenses();

  // Dynamic Greeting based on local time and profile
  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    if (hour >= 17) timeOfDay = 'evening';

    const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0];
    return name ? `Good ${timeOfDay}, ${name} 👋` : `Good ${timeOfDay} 👋`;
  };

  const titles = {
    dashboard: { title: getGreeting(), subtitle: "Here's your spending overview." },
    'add-expense': { title: 'Add New Expense', subtitle: 'Log your everyday spending with payment details.' },
    expenses: { title: 'Expense History', subtitle: 'Search, filter, edit, and sort your transactions.' },
    budget: { title: 'Budget Management', subtitle: 'Set monthly limits and keep your category spending in check.' },
    insights: { title: 'Spending Insights', subtitle: 'Automated analytics derived strictly from your stored data.' },
    'ai-assistant': { title: 'SpendWise AI', subtitle: 'Ask questions about your spending in natural language.' },
    settings: { title: 'Settings & Storage', subtitle: 'Manage preferences, currency, and local data.' }
  };

  const currentMeta = titles[activeView] || { title: 'SpendWise', subtitle: 'Student Expense Manager' };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-4 sticky top-0 z-20 space-y-2">
      {!isSupabaseConfigured && (
        <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 rounded-xl px-3.5 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2 max-w-7xl mx-auto">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span><strong>Supabase Setup Required:</strong> Please set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env.local</code> to enable live authentication and cloud persistence.</span>
          </span>
          <button 
            onClick={() => setActiveView('settings')} 
            className="underline font-bold text-amber-700 dark:text-amber-200 hover:text-amber-900 whitespace-nowrap"
          >
            Instructions
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Title & Subtitle */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {currentMeta.title}
            </h1>
            {isDemo && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-md border border-amber-200 dark:border-amber-800">
                Demo Data Mode
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {currentMeta.subtitle}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Quick Demo Data Toggle */}
          {isDemo ? (
            <button
              onClick={removeDemoData}
              className="px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 rounded-xl transition-all"
            >
              Exit Demo
            </button>
          ) : !user ? (
            <button
              onClick={loadDemoData}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Try Demo</span>
            </button>
          ) : null}

          {/* Quick Add Expense CTA button if not already on add-expense tab */}
          {activeView !== 'add-expense' && (
            <button
              onClick={() => setActiveView('add-expense')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Add Expense</span>
            </button>
          )}

          {/* User Sign In / Sign Out */}
          {user ? (
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-3">
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300">
                <UserIcon className="w-3.5 h-3.5 text-brand-500" />
                <span className="max-w-[120px] truncate">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
              </div>

              <button
                onClick={signOut}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200/60 dark:border-rose-900/40 transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveView('auth')}
              className="px-3.5 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-800 rounded-xl transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Sign Up</span>
            </button>
          )}

          {/* Dark Mode Icon Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 transition-colors"
            title="Toggle Light/Dark Theme"
            aria-label="Toggle Theme"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
