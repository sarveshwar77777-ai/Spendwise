import React, { useState } from 'react';
import { 
  PieChart, 
  Edit3, 
  Check, 
  AlertTriangle, 
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { calculateTotalSpent, calculateCategoryTotals } from '../../utils/calculations';
import { CATEGORY_META, formatCurrency } from '../../utils/formatters';
import { useExpenses } from '../../context/ExpenseContext';

const CATEGORIES = ['Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Recharge', 'Other'];

export const BudgetCard = () => {
  const { expenses, budget, updateBudgetConfig, settings } = useExpenses();
  const { monthlyBudget = 10000, categoryBudgets = {} } = budget;

  const [isEditingGlobal, setIsEditingGlobal] = useState(false);
  const [globalInput, setGlobalInput] = useState(monthlyBudget);

  const [editingCategory, setEditingCategory] = useState(null);
  const [catInput, setCatInput] = useState('');

  const totalSpent = calculateTotalSpent(expenses);
  const remaining = Math.max(0, monthlyBudget - totalSpent);
  const percentUsed = Math.round((totalSpent / monthlyBudget) * 100) || 0;

  const categoryTotals = calculateCategoryTotals(expenses);

  const handleSaveGlobalBudget = () => {
    const num = Number(globalInput);
    if (num > 0) {
      updateBudgetConfig({ monthlyBudget: num });
      setIsEditingGlobal(false);
    }
  };

  const handleSaveCatBudget = (cat) => {
    const num = Number(catInput);
    if (num >= 0) {
      updateBudgetConfig({
        categoryBudgets: {
          ...categoryBudgets,
          [cat]: num
        }
      });
      setEditingCategory(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* OVERALL MONTHLY BUDGET CARD */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-xl">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Overall Monthly Budget</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total spending cap for the current calendar month</p>
            </div>
          </div>

          {!isEditingGlobal ? (
            <button
              onClick={() => { setGlobalInput(monthlyBudget); setIsEditingGlobal(true); }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Monthly Budget"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={globalInput}
                onChange={(e) => setGlobalInput(e.target.value)}
                className="w-28 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={handleSaveGlobalBudget}
                className="p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly Budget</span>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {formatCurrency(monthlyBudget, settings.currency)}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Spent</span>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatCurrency(totalSpent, settings.currency)}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Remaining</span>
            <p className={`text-xl font-bold mt-0.5 ${totalSpent > monthlyBudget ? 'text-rose-500' : 'text-slate-900 dark:text-slate-100'}`}>
              {formatCurrency(remaining, settings.currency)}
            </p>
          </div>
        </div>

        {/* Progress Bar & Status Warning */}
        <div className="space-y-2">
          <ProgressBar percentage={percentUsed} />

          {/* Encouraging non-fear status messaging */}
          {percentUsed >= 100 ? (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>You have reached your monthly spending limit. Consider adjusting your category budgets or pausing non-essential spending.</span>
            </div>
          ) : percentUsed >= 80 ? (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>You've used {percentUsed}% of your monthly budget. You have {formatCurrency(remaining, settings.currency)} left for the rest of the month.</span>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Great job! Your monthly spending is well within your budget target.</span>
            </div>
          )}
        </div>
      </div>

      {/* CATEGORY BUDGETS BREAKDOWN */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Category Budgets</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Set individual limits for each student spending category.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => {
            const spent = categoryTotals[cat] || 0;
            const catBudget = categoryBudgets[cat] || 0;
            const catPercent = catBudget > 0 ? Math.round((spent / catBudget) * 100) : 0;
            const meta = CATEGORY_META[cat] || CATEGORY_META.Other;
            const isEditing = editingCategory === cat;

            return (
              <div 
                key={cat}
                className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${meta.color}`} />
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{cat}</span>
                  </div>

                  {!isEditing ? (
                    <button
                      onClick={() => { setEditingCategory(cat); setCatInput(catBudget); }}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={catInput}
                        onChange={(e) => setCatInput(e.target.value)}
                        className="w-20 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                      />
                      <button
                        onClick={() => handleSaveCatBudget(cat)}
                        className="p-1 bg-brand-600 text-white rounded-lg"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-500">
                    Spent: <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(spent, settings.currency)}</strong>
                  </span>
                  <span className="text-slate-500">
                    Target: <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(catBudget, settings.currency)}</strong>
                  </span>
                </div>

                <ProgressBar percentage={catPercent} showLabel={false} />

                {catPercent > 100 && (
                  <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Exceeded category budget by {formatCurrency(spent - catBudget, settings.currency)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
