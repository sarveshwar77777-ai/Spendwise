import React from 'react';
import { 
  Utensils, 
  Bus, 
  BookOpen, 
  ShoppingBag, 
  Film, 
  Smartphone, 
  MoreHorizontal,
  Edit2,
  Trash2,
  CreditCard,
  Banknote,
  SmartphoneNfc
} from 'lucide-react';
import { CATEGORY_META, formatCurrency, formatDate } from '../../utils/formatters';

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Bus,
  Education: BookOpen,
  Shopping: ShoppingBag,
  Entertainment: Film,
  Recharge: Smartphone,
  Other: MoreHorizontal
};

const PAYMENT_ICONS = {
  UPI: SmartphoneNfc,
  Cash: Banknote,
  Card: CreditCard,
  Other: MoreHorizontal
};

export const ExpenseItem = ({ expense, currency = '₹', onEdit, onDelete }) => {
  const Icon = CATEGORY_ICONS[expense.category] || MoreHorizontal;
  const PayIcon = PAYMENT_ICONS[expense.paymentMethod] || MoreHorizontal;
  const meta = CATEGORY_META[expense.category] || CATEGORY_META.Other;

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm group">
      {/* Category Icon & Details */}
      <div className="flex items-center gap-3.5">
        <div className={`p-3 rounded-2xl ${meta.lightBg} border ${meta.border} flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-snug">
            {expense.description}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700">
              {expense.category}
            </span>
            <span>•</span>
            <span>{formatDate(expense.date)}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <PayIcon className="w-3 h-3" />
              {expense.paymentMethod}
            </span>
          </div>
        </div>
      </div>

      {/* Amount & Actions */}
      <div className="flex items-center gap-3">
        <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight">
          {formatCurrency(expense.amount, currency)}
        </span>

        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(expense)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Expense"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(expense.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              title="Delete Expense"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
