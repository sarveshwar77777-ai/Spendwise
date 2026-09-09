import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Receipt, 
  PieChart, 
  Sparkles, 
  Bot, 
  Settings, 
  Home,
  Sun,
  Moon,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

export const Navigation = () => {
  const { 
    activeView, 
    setActiveView, 
    isDemo, 
    settings, 
    toggleTheme, 
    user, 
    signOut 
  } = useExpenses();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-expense', label: 'Add Expense', icon: PlusCircle },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'budget', label: 'Budget', icon: PieChart },
    { id: 'insights', label: 'Insights', icon: Sparkles },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 h-screen sticky top-0 z-30 transition-colors">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <button 
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight block">SpendWise</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500 block -mt-1">Student Manager</span>
            </div>
          </button>
        </div>

        {/* User Account / Auth Status Badge */}
        {user ? (
          <div className="mx-4 mt-4 p-3 bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/40 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-xl bg-brand-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 uppercase">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block truncate font-medium">Logged In</span>
              </div>
            </div>
          </div>
        ) : isDemo ? (
          <div className="mx-4 mt-4 px-3 py-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 rounded-xl flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Demo Mode
            </span>
            <button
              onClick={() => setActiveView('auth')}
              className="text-[10px] font-bold underline text-amber-600 dark:text-amber-300 hover:text-amber-800"
            >
              Sign In
            </button>
          </div>
        ) : (
          <div className="mx-4 mt-4">
            <button
              onClick={() => setActiveView('auth')}
              className="w-full py-2.5 px-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Sign Up</span>
            </button>
          </div>
        )}

        {/* Main Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions: Theme Toggle & Landing Link */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          {user && (
            <button
              onClick={signOut}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </span>
            <span className="text-[10px] text-slate-400 capitalize">{settings.theme}</span>
          </button>

          <button
            onClick={() => setActiveView('landing')}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Landing Page</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
        
        {/* Auth / Account Mobile Tab */}
        <button
          onClick={() => setActiveView(user ? 'settings' : 'auth')}
          className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[10px] font-medium transition-colors ${
            ['auth', 'settings'].includes(activeView)
              ? 'text-brand-600 dark:text-brand-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {user ? <UserCheck className="w-5 h-5 mb-0.5 text-brand-500" /> : <LogIn className="w-5 h-5 mb-0.5" />}
          <span>{user ? 'Account' : 'Sign In'}</span>
        </button>
      </div>
    </>
  );
};
