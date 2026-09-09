import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loadExpenses, saveExpenses, 
  loadBudget, saveBudget, 
  loadSettings, saveSettings, 
  loadIsDemo, saveIsDemo, 
  clearAllData 
} from '../utils/storage';
import { getDemoExpenses, DEFAULT_MONTHLY_BUDGET, INITIAL_CATEGORY_BUDGETS } from '../utils/demoData';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(() => loadExpenses());
  const [budget, setBudget] = useState(() => loadBudget());
  const [settings, setSettings] = useState(() => loadSettings());
  const [isDemo, setIsDemo] = useState(() => loadIsDemo());
  const [activeView, setActiveView] = useState('landing');
  const [toast, setToast] = useState(null);

  // Apply dark mode class to document element on theme state change
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveSettings(settings);
  }, [settings.theme]);

  // Persist state updates to localStorage
  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveBudget(budget);
  }, [budget]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveIsDemo(isDemo);
  }, [isDemo]);

  // Toast Notification Helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4000);
  };

  // Add Expense
  const addExpense = (newExpenseData) => {
    const newExpense = {
      ...newExpenseData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };

    setExpenses(prev => [newExpense, ...prev]);
    showToast(`Added "${newExpense.description}" (${settings.currency}${newExpense.amount})`);
    return newExpense;
  };

  // Update Expense
  const updateExpense = (id, updatedData) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, ...updatedData } : exp));
    showToast('Expense updated successfully');
  };

  // Delete Expense
  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    showToast('Expense deleted', 'info');
  };

  // Update Monthly & Category Budgets
  const updateBudgetConfig = (newBudget) => {
    setBudget(prev => ({
      ...prev,
      ...newBudget
    }));
    showToast('Budget preferences saved');
  };

  // Load Demo Data
  const handleLoadDemoData = () => {
    const demoExps = getDemoExpenses();
    setExpenses(demoExps);
    setBudget({
      monthlyBudget: DEFAULT_MONTHLY_BUDGET,
      categoryBudgets: { ...INITIAL_CATEGORY_BUDGETS }
    });
    setIsDemo(true);
    showToast('Loaded demo student expenses', 'info');
  };

  // Remove Demo Data
  const handleRemoveDemoData = () => {
    setExpenses([]);
    setIsDemo(false);
    showToast('Demo data cleared', 'info');
  };

  // Clear All Data
  const handleClearAllData = () => {
    clearAllData();
    setExpenses([]);
    setBudget({
      monthlyBudget: DEFAULT_MONTHLY_BUDGET,
      categoryBudgets: { ...INITIAL_CATEGORY_BUDGETS }
    });
    setIsDemo(false);
    showToast('All local data wiped cleanly', 'info');
  };

  // Toggle Dark/Light Theme
  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  // Toggle Currency
  const setCurrency = (currency) => {
    setSettings(prev => ({ ...prev, currency }));
    showToast(`Currency changed to ${currency}`);
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      budget,
      settings,
      isDemo,
      activeView,
      setActiveView,
      toast,
      showToast,
      addExpense,
      updateExpense,
      deleteExpense,
      updateBudgetConfig,
      loadDemoData: handleLoadDemoData,
      removeDemoData: handleRemoveDemoData,
      clearAllData: handleClearAllData,
      toggleTheme,
      setCurrency
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
