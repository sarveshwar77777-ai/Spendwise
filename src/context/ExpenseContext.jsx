import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loadExpenses, saveExpenses,
  loadBudget, saveBudget,
  loadSettings, saveSettings,
  loadIsDemo, saveIsDemo,
  loadUser, saveUser, removeUser,
  clearAllData
} from '../utils/storage';
import { getDemoExpenses, DEFAULT_MONTHLY_BUDGET, INITIAL_CATEGORY_BUDGETS } from '../utils/demoData';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const u = loadUser();
    return u?.loggedIn ? u : null;
  });
  const [expenses, setExpenses] = useState(() => loadExpenses());
  const [budget, setBudget] = useState(() => loadBudget());
  const [settings, setSettings] = useState(() => loadSettings());
  const [isDemo, setIsDemo] = useState(() => loadIsDemo());
  const [activeView, setActiveView] = useState('landing');
  const [toast, setToast] = useState(null);

  // Apply dark mode
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveSettings(settings);
  }, [settings.theme]);

  // Persist state to localStorage
  useEffect(() => { saveExpenses(expenses); }, [expenses]);
  useEffect(() => { saveBudget(budget); }, [budget]);
  useEffect(() => { saveSettings(settings); }, [settings]);
  useEffect(() => { saveIsDemo(isDemo); }, [isDemo]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => setToast(prev => prev?.id === id ? null : prev), 4000);
  };

  // ── AUTH ─────────────────────────────────────────────────────────────
  // Sign up: store name + hashed-like password in localStorage
  const signUp = (name, password) => {
    const existing = loadUser();
    if (existing && existing.name === name) {
      return { error: 'A user with this name is already registered on this device.' };
    }
    const newUser = { name: name.trim(), password, loggedIn: true };
    saveUser(newUser);
    setUser(newUser);
    showToast(`Welcome, ${name}! Your account is ready.`);
    return { error: null };
  };

  // Sign in: compare name + password
  const signIn = (name, password) => {
    const stored = loadUser();
    if (!stored) {
      return { error: 'No account found. Please sign up first.' };
    }
    if (stored.name !== name.trim() || stored.password !== password) {
      return { error: 'Invalid name or password.' };
    }
    const loggedIn = { ...stored, loggedIn: true };
    saveUser(loggedIn);
    setUser(loggedIn);
    showToast(`Welcome back, ${name}!`);
    return { error: null };
  };

  // Sign out
  const signOut = () => {
    const updated = { ...user, loggedIn: false };
    saveUser(updated);
    setUser(null);
    setActiveView('auth');
    showToast('Signed out successfully.', 'info');
  };

  // ── EXPENSE MUTATIONS ────────────────────────────────────────────────
  const addExpense = (data) => {
    const newExpense = {
      ...data,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [newExpense, ...prev]);
    showToast(`Added "${newExpense.description}" (${settings.currency}${newExpense.amount})`);
    return newExpense;
  };

  const updateExpense = (id, updatedData) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, ...updatedData } : exp));
    showToast('Expense updated successfully');
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    showToast('Expense deleted', 'info');
  };

  const updateBudgetConfig = (newBudget) => {
    setBudget(prev => ({ ...prev, ...newBudget }));
    showToast('Budget preferences saved');
  };

  // ── DEMO ─────────────────────────────────────────────────────────────
  const handleLoadDemoData = () => {
    setExpenses(getDemoExpenses());
    setBudget({ monthlyBudget: DEFAULT_MONTHLY_BUDGET, categoryBudgets: { ...INITIAL_CATEGORY_BUDGETS } });
    setIsDemo(true);
    showToast('Loaded demo student expenses', 'info');
  };

  const handleRemoveDemoData = () => {
    setExpenses([]);
    setIsDemo(false);
    showToast('Demo data cleared', 'info');
  };

  const handleClearAllData = () => {
    clearAllData();
    setExpenses([]);
    setBudget({ monthlyBudget: DEFAULT_MONTHLY_BUDGET, categoryBudgets: { ...INITIAL_CATEGORY_BUDGETS } });
    setIsDemo(false);
    showToast('All data cleared', 'info');
  };

  const toggleTheme = () => setSettings(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  const setCurrency = (currency) => { setSettings(prev => ({ ...prev, currency })); showToast(`Currency changed to ${currency}`); };

  return (
    <ExpenseContext.Provider value={{
      user,
      expenses,
      budget,
      settings,
      isDemo,
      activeView,
      setActiveView,
      toast,
      showToast,
      signUp,
      signIn,
      signOut,
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
  if (!context) throw new Error('useExpenses must be used within an ExpenseProvider');
  return context;
};
