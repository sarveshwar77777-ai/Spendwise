import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Trash2, 
  Sparkles,
  Calendar,
  X
} from 'lucide-react';
import { ExpenseItem } from './ExpenseItem';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';
import { ExpenseForm } from './ExpenseForm';
import { useExpenses } from '../../context/ExpenseContext';

const CATEGORIES = ['All', 'Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Recharge', 'Other'];

export const ExpenseList = ({ expenses }) => {
  const { deleteExpense, settings, loadDemoData } = useExpenses();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, amount-desc, amount-asc

  // Modal Editing State
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Filter & Sort Logic
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) => {
        // Category Filter
        if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;

        // Date Filter
        if (dateFilter && item.date !== dateFilter) return false;

        // Search Query
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesCat = item.category.toLowerCase().includes(q);
          const matchesPay = item.paymentMethod.toLowerCase().includes(q);
          const matchesAmt = String(item.amount).includes(q);
          if (!matchesDesc && !matchesCat && !matchesPay && !matchesAmt) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
        if (sortBy === 'oldest') return new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt);
        if (sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount);
        if (sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount);
        return 0;
      });
  }, [expenses, search, categoryFilter, dateFilter, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setCategoryFilter('All');
    setDateFilter('');
    setSortBy('newest');
  };

  const hasActiveFilters = search !== '' || categoryFilter !== 'All' || dateFilter !== '';

  if (expenses.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {/* Search, Filter, Sort Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills & Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap justify-between sm:justify-end">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Filter Reset Status Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/60 pt-2">
            <span>Showing {filteredExpenses.length} of {expenses.length} expenses</span>
            <button
              onClick={resetFilters}
              className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Expenses List View */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">No expenses found matching your criteria.</p>
          <button
            onClick={resetFilters}
            className="mt-3 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Reset search & filters
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              currency={settings.currency}
              onEdit={(item) => setEditingExpense(item)}
              onDelete={(id) => setDeletingId(id)}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
      >
        {editingExpense && (
          <ExpenseForm
            initialData={editingExpense}
            onSuccess={() => setEditingExpense(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to delete this expense? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeletingId(null)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteExpense(deletingId);
                setDeletingId(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
            >
              Delete Expense
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
