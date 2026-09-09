import React from 'react';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { PrivacyBadge } from '../components/ui/PrivacyBadge';

export const AddExpenseView = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PrivacyBadge variant="banner" />
      <ExpenseForm />
    </div>
  );
};
