// Formatting utilities for Currency, Dates, and Badges

export const formatCurrency = (amount, currency = '₹') => {
  const num = Number(amount) || 0;
  return `${currency}${num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  })}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
};

export const formatPercent = (value) => {
  const num = Number(value) || 0;
  return `${Math.round(num)}%`;
};

// Category Colors & Icons Helper mapping
export const CATEGORY_META = {
  Food: {
    color: 'bg-emerald-500',
    lightBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    hex: '#10b981'
  },
  Transport: {
    color: 'bg-blue-500',
    lightBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/40',
    border: 'border-blue-200 dark:border-blue-800',
    hex: '#3b82f6'
  },
  Education: {
    color: 'bg-purple-500',
    lightBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/40',
    border: 'border-purple-200 dark:border-purple-800',
    hex: '#a855f7'
  },
  Shopping: {
    color: 'bg-pink-500',
    lightBg: 'bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-800/40',
    border: 'border-pink-200 dark:border-pink-800',
    hex: '#ec4899'
  },
  Entertainment: {
    color: 'bg-amber-500',
    lightBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/40',
    border: 'border-amber-200 dark:border-amber-800',
    hex: '#f59e0b'
  },
  Recharge: {
    color: 'bg-cyan-500',
    lightBg: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800/40',
    border: 'border-cyan-200 dark:border-cyan-800',
    hex: '#06b6d4'
  },
  Other: {
    color: 'bg-slate-500',
    lightBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    border: 'border-slate-200 dark:border-slate-700',
    hex: '#64748b'
  }
};
