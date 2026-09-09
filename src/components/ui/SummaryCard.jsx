import React from 'react';

export const SummaryCard = ({ title, value, subtitle, icon: Icon, trend, colorScheme = 'brand' }) => {
  const schemes = {
    brand: 'border-brand-100 dark:border-brand-900/40 bg-white dark:bg-slate-900',
    emerald: 'border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-slate-900',
    amber: 'border-amber-100 dark:border-amber-900/40 bg-white dark:bg-slate-900',
    purple: 'border-purple-100 dark:border-purple-900/40 bg-white dark:bg-slate-900'
  };

  const iconBgs = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-950/80 dark:text-brand-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400'
  };

  return (
    <div className={`p-5 rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md ${schemes[colorScheme] || schemes.brand}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${iconBgs[colorScheme] || iconBgs.brand}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{value}</h3>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
