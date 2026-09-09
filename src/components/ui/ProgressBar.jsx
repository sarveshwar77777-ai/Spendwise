import React from 'react';

export const ProgressBar = ({ percentage, colorClass, showLabel = true }) => {
  const clamped = Math.min(100, Math.max(0, percentage || 0));

  // Determine standard encouragement colors if not explicitly passed
  let barColor = colorClass || 'bg-brand-500';
  if (!colorClass) {
    if (clamped >= 100) {
      barColor = 'bg-rose-500';
    } else if (clamped >= 80) {
      barColor = 'bg-amber-500';
    } else {
      barColor = 'bg-emerald-500';
    }
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
          <span>Progress</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`} 
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
