import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { prepareSpendingTrendData } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

export const SpendingChart = ({ expenses, currency = '₹' }) => {
  const data = prepareSpendingTrendData(expenses);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl border border-slate-800">
          <p className="font-semibold text-slate-300">{label}</p>
          <p className="text-brand-400 font-bold mt-0.5">
            {formatCurrency(payload[0].value, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={(val) => `${currency}${val}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(12, 141, 233, 0.06)' }} />
          <Bar 
            dataKey="amount" 
            fill="#0c8de9" 
            radius={[6, 6, 0, 0]} 
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
