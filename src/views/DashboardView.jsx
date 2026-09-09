import React from 'react';
import { 
  Wallet, 
  CreditCard, 
  PieChart, 
  ArrowUpRight, 
  Sparkles,
  PlusCircle,
  Receipt
} from 'lucide-react';
import { SummaryCard } from '../components/ui/SummaryCard';
import { SpendingChart } from '../components/charts/SpendingChart';
import { CategoryChart } from '../components/charts/CategoryChart';
import { ExpenseItem } from '../components/expenses/ExpenseItem';
import { ProgressBar } from '../components/ui/ProgressBar';
import { calculateTotalSpent, calculateCategoryTotals } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import { useExpenses } from '../context/ExpenseContext';
import { EmptyState } from '../components/ui/EmptyState';

export const DashboardView = () => {
  const { expenses, budget, settings, setActiveView, deleteExpense } = useExpenses();
  const { monthlyBudget = 10000 } = budget;

  const totalSpent = calculateTotalSpent(expenses);
  const remaining = Math.max(0, monthlyBudget - totalSpent);
  const percentUsed = Math.round((totalSpent / monthlyBudget) * 100) || 0;

  // Recent 5 transactions
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* SUMMARY CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Available Balance"
          value={formatCurrency(remaining, settings.currency)}
          subtitle="Remaining budget allowance"
          icon={Wallet}
          colorScheme="emerald"
        />
        <SummaryCard
          title="Total Spent"
          value={formatCurrency(totalSpent, settings.currency)}
          subtitle={`${expenses.length} transactions logged`}
          icon={CreditCard}
          colorScheme="brand"
        />
        <SummaryCard
          title="Monthly Budget"
          value={formatCurrency(monthlyBudget, settings.currency)}
          subtitle="Overall target limit"
          icon={PieChart}
          colorScheme="purple"
        />
        <SummaryCard
          title="Budget Used"
          value={`${percentUsed}%`}
          subtitle={remaining > 0 ? `${formatCurrency(remaining, settings.currency)} safe limit` : 'Limit reached'}
          icon={ArrowUpRight}
          colorScheme={percentUsed >= 100 ? 'amber' : 'brand'}
        />
      </div>

      {/* BUDGET PROGRESS BANNER */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-sm font-semibold">
          <span className="text-slate-800 dark:text-slate-200">Overall Budget Progress</span>
          <span className="text-slate-500">
            {formatCurrency(totalSpent, settings.currency)} / {formatCurrency(monthlyBudget, settings.currency)}
          </span>
        </div>
        <ProgressBar percentage={percentUsed} showLabel={false} />
      </div>

      {/* CHARTS GRID SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Overview Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Spending Overview</h3>
              <p className="text-xs text-slate-500">7-day spending trends</p>
            </div>
            <button 
              onClick={() => setActiveView('insights')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View Insights →
            </button>
          </div>
          {expenses.length > 0 ? (
            <SpendingChart expenses={expenses} currency={settings.currency} />
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
              No spending logged yet
            </div>
          )}
        </div>

        {/* Spending by Category Chart (1 col) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Category Split</h3>
              <p className="text-xs text-slate-500">Breakdown by area</p>
            </div>
          </div>
          <CategoryChart expenses={expenses} currency={settings.currency} />
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-brand-500" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Recent Transactions</h3>
          </div>
          {expenses.length > 0 && (
            <button
              onClick={() => setActiveView('expenses')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View All ({expenses.length}) →
            </button>
          )}
        </div>

        {recentExpenses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2.5">
            {recentExpenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                currency={settings.currency}
                onDelete={(id) => deleteExpense(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
