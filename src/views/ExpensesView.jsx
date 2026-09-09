import React from 'react';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { useExpenses } from '../context/ExpenseContext';

export const ExpensesView = () => {
  const { expenses } = useExpenses();

  return (
    <div className="space-y-6">
      <ExpenseList expenses={expenses} />
    </div>
  );
};
