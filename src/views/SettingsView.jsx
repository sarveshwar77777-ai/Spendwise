import React, { useState } from 'react';
import { 
  Settings, 
  Trash2, 
  Sparkles, 
  Sun, 
  Moon, 
  DollarSign, 
  Bell, 
  ShieldCheck, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { ProjectContextNotice } from '../components/ui/PrivacyBadge';
import { useExpenses } from '../context/ExpenseContext';

const CURRENCIES = [
  { symbol: '₹', label: 'INR (₹)' },
  { symbol: '$', label: 'USD ($)' },
  { symbol: '€', label: 'EUR (€)' },
  { symbol: '£', label: 'GBP (£)' }
];

export const SettingsView = () => {
  const { 
    settings, 
    setCurrency, 
    toggleTheme, 
    budget, 
    updateBudgetConfig, 
    clearAllData, 
    isDemo, 
    loadDemoData, 
    removeDemoData 
  } = useExpenses();

  const [confirmWipeOpen, setConfirmWipeOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget.monthlyBudget);

  const handleUpdateMonthlyBudget = (e) => {
    e.preventDefault();
    const num = Number(budgetInput);
    if (num > 0) {
      updateBudgetConfig({ monthlyBudget: num });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* CURRENCY & THEME PREFERENCES */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-xl">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">App Preferences</h3>
            <p className="text-xs text-slate-500">Configure visual themes and currency formats.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Currency Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Display Currency
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CURRENCIES.map((c) => (
                <button
                  key={c.symbol}
                  onClick={() => setCurrency(c.symbol)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    settings.currency === c.symbol
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Switcher */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Theme Mode
            </label>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <span className="flex items-center gap-2">
                {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span>Current Theme: <strong>{settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</strong></span>
              </span>
              <span className="text-brand-600 dark:text-brand-400 font-semibold underline">Toggle</span>
            </button>
          </div>
        </div>
      </div>

      {/* MONTHLY BUDGET DEFAULT */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Monthly Target Budget</h3>
        <form onSubmit={handleUpdateMonthlyBudget} className="flex gap-3">
          <input
            type="number"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-sm"
          >
            Save Target
          </button>
        </form>
      </div>

      {/* DEMO DATA CONTROLS */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Demo Data Controls</span>
        </h3>
        <p className="text-xs text-slate-500">
          Load or clear sample student spending data for presentation or preview purposes.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          {isDemo ? (
            <button
              onClick={removeDemoData}
              className="px-4 py-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-semibold hover:bg-amber-100"
            >
              Exit Demo
            </button>
          ) : (
            <button
              onClick={loadDemoData}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Load Demo Data</span>
            </button>
          )}
        </div>
      </div>

      {/* DATA WIPE & CONFIRMATION */}
      <div className="bg-rose-50/50 dark:bg-rose-950/20 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-3">
        <h3 className="font-bold text-rose-800 dark:text-rose-300 text-base flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-500" />
          <span>Reset All Expense Data</span>
        </h3>
        <p className="text-xs text-rose-600/80 dark:text-rose-400">
          Wipe all stored expenses, budget settings, and custom choices permanently.
        </p>
        <button
          onClick={() => setConfirmWipeOpen(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          Clear All Data
        </button>
      </div>

      <ProjectContextNotice />

      {/* CONFIRMATION MODAL */}
      <Modal
        isOpen={confirmWipeOpen}
        onClose={() => setConfirmWipeOpen(false)}
        title="Confirm Data Wipe"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <span>Are you sure you want to clear all stored expense records? This will reset your data to a completely blank slate.</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setConfirmWipeOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                clearAllData();
                setConfirmWipeOpen(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
            >
              Confirm Clear Data
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
