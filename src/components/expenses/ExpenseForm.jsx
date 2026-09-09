import React, { useState } from 'react';
import { PlusCircle, Check, AlertCircle } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

const CATEGORIES = ['Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Recharge', 'Other'];
const PAYMENT_METHODS = ['UPI', 'Cash', 'Card', 'Other'];

export const ExpenseForm = ({ initialData = null, onSuccess }) => {
  const { addExpense, updateExpense, settings, setActiveView } = useExpenses();

  const [formData, setFormData] = useState({
    amount: initialData ? initialData.amount : '',
    description: initialData ? initialData.description : '',
    category: initialData ? initialData.category : 'Food',
    date: initialData ? initialData.date : new Date().toISOString().split('T')[0],
    paymentMethod: initialData ? initialData.paymentMethod : 'UPI'
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    const numAmount = Number(formData.amount);
    
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      errs.amount = 'Amount must be greater than 0';
    }
    if (!formData.description.trim()) {
      errs.description = 'Description is required';
    }
    if (!formData.category) {
      errs.category = 'Category is required';
    }
    if (!formData.date) {
      errs.date = 'Date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      amount: Number(formData.amount),
      description: formData.description.trim(),
      category: formData.category,
      date: formData.date,
      paymentMethod: formData.paymentMethod
    };

    if (initialData) {
      updateExpense(initialData.id, payload);
    } else {
      addExpense(payload);
      // Reset form on addition
      setFormData({
        amount: '',
        description: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI'
      });
      setErrors({});
    }

    if (onSuccess) {
      onSuccess();
    } else if (!initialData) {
      setActiveView('expenses');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Amount Input */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
          Amount ({settings.currency}) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
            {settings.currency}
          </span>
          <input
            type="number"
            step="any"
            min="1"
            placeholder="e.g. 150"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border ${
              errors.amount ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-brand-500'
            } rounded-xl text-slate-900 dark:text-slate-100 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
          />
        </div>
        {errors.amount && (
          <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.amount}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
          Description <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Lunch at campus cafeteria"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border ${
            errors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
          } rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.description}
          </p>
        )}
      </div>

      {/* Category & Date Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
        </div>
      </div>

      {/* Payment Method Selector Pills */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
          Payment Method
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = formData.paymentMethod === method;
            return (
              <button
                type="button"
                key={method}
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border text-center flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{method}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 px-6 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 mt-2"
      >
        <PlusCircle className="w-5 h-5" />
        <span>{initialData ? 'Update Expense' : 'Add Expense'}</span>
      </button>
    </form>
  );
};
