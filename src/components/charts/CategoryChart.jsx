import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from 'recharts';
import { calculateCategoryTotals } from '../../utils/calculations';
import { CATEGORY_META, formatCurrency } from '../../utils/formatters';

export const CategoryChart = ({ expenses, currency = '₹' }) => {
  const totals = calculateCategoryTotals(expenses);

  const data = Object.entries(totals)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_META[name]?.hex || '#64748b'
    }));

  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs text-center">
        <span>No category data to visualize</span>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl border border-slate-800">
          <p className="font-semibold">{name}</p>
          <p className="text-emerald-400 font-bold mt-0.5">
            {formatCurrency(value, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="w-full sm:w-1/2 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Legend List */}
      <div className="w-full sm:w-1/2 space-y-2 overflow-y-auto max-h-56 pr-1">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(item.value, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
