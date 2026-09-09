import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Utensils, 
  PieChart,
  DollarSign,
  PlusCircle
} from 'lucide-react';
import { generateInsights } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { useExpenses } from '../../context/ExpenseContext';

export const InsightCard = () => {
  const { expenses, budget, settings, setActiveView, loadDemoData } = useExpenses();
  const insights = generateInsights(expenses, budget.monthlyBudget, budget.categoryBudgets);

  if (!insights.hasData) {
    return (
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Insufficient Data for Analytics</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {insights.message}
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => setActiveView('add-expense')}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Add Expense
          </button>
          <button
            onClick={loadDemoData}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-xl flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Load Demo Data
          </button>
        </div>
      </div>
    );
  }

  const { topCategory, top3Categories, weeklySpent, dailyAvg, weekComparison } = insights;

  return (
    <div className="space-y-6">
      {/* HIGHLIGHT HERO INSIGHT */}
      <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10">
          <Sparkles className="w-48 h-48" />
        </div>
        <div className="relative z-10 space-y-3">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
            Primary Insight
          </span>
          <h2 className="text-xl sm:text-2xl font-bold leading-tight">
            Your highest spending category is <span className="underline decoration-amber-400 font-extrabold">{topCategory.name}</span>.
          </h2>
          <p className="text-brand-100 text-sm">
            You have spent a total of <strong className="text-white font-bold">{formatCurrency(topCategory.amount, settings.currency)}</strong> on {topCategory.name.toLowerCase()} so far.
          </p>
        </div>
      </div>

      {/* DERIVED STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Weekly Spent */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">7-Day Total</span>
            <Calendar className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(weeklySpent, settings.currency)}
          </p>
          <p className="text-xs text-slate-500">Calculated over the last 7 calendar days</p>
        </div>

        {/* Daily Average */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Daily Average</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(dailyAvg, settings.currency)} / day
          </p>
          <p className="text-xs text-slate-500">Average spending per active logged day</p>
        </div>

        {/* Weekly Trend Comparison */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Weekly Change</span>
            {weekComparison?.increased ? (
              <TrendingUp className="w-4 h-4 text-amber-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-emerald-500" />
            )}
          </div>
          {weekComparison ? (
            <div>
              <p className={`text-2xl font-bold ${weekComparison.increased ? 'text-amber-600' : 'text-emerald-600'}`}>
                {weekComparison.increased ? '+' : '-'}{weekComparison.percent}%
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Spending {weekComparison.increased ? 'increased' : 'decreased'} by {formatCurrency(weekComparison.diffAmount, settings.currency)} vs prior week
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Baseline Establishing</p>
              <p className="text-xs text-slate-500">Log 14 days of expenses for full period comparison.</p>
            </div>
          )}
        </div>
      </div>

      {/* TOP 3 CATEGORIES LIST */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-brand-500" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Top Spending Categories</h3>
        </div>

        <div className="space-y-3">
          {top3Categories.map(([catName, amt], idx) => (
            <div key={catName} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center">
                  #{idx + 1}
                </span>
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{catName}</span>
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {formatCurrency(amt, settings.currency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
