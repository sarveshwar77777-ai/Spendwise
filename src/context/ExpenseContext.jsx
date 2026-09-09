import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loadExpenses, saveExpenses,
  loadBudget, saveBudget,
  loadSettings, saveSettings,
  loadIsDemo, saveIsDemo,
  loadUsers, saveUsers,
  loadCurrentUser, saveCurrentUser, removeCurrentUser,
  clearAllData
} from '../utils/storage';
import { getDemoExpenses, DEFAULT_MONTHLY_BUDGET, INITIAL_CATEGORY_BUDGETS } from '../utils/demoData';

const ExpenseContext = createContext(null);

// Password validation helper
export const validatePasswordRules = (pwd) => {
  return {
    minLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(pwd)
  };
};

export const ExpenseProvider = ({ children }) => {
  const [user, setUser] = useState(() => loadCurrentUser());
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

  // ── AUTH (Username + Strict Password + Unique Username) ───────────────
  const signUp = (rawUsername, password) => {
    const username = rawUsername.trim();
    if (!username) {
      return { error: 'Please enter a username.' };
    }
    if (username.length < 3) {
      return { error: 'Username must be at least 3 characters long.' };
    }

    // Check unique username
    const existingUsers = loadUsers();
    const isTaken = existingUsers.some(
      u => u.username.toLowerCase() === username.toLowerCase()
    );
    if (isTaken) {
      return { error: `Username "${username}" is already taken. Please choose another username or sign in.` };
    }

    // Validate password rules
    const rules = validatePasswordRules(password);
    if (!rules.minLength) {
      return { error: 'Password must be at least 8 characters long.' };
    }
    if (!rules.hasUpper) {
      return { error: 'Password must contain at least one uppercase letter (A-Z).' };
    }
    if (!rules.hasLower) {
      return { error: 'Password must contain at least one lowercase letter (a-z).' };
    }
    if (!rules.hasNumber) {
      return { error: 'Password must contain at least one number (0-9).' };
    }
    if (!rules.hasSpecial) {
      return { error: 'Password must contain at least one special character (!@#$%^&*).' };
    }

    const newUserRecord = {
      username,
      password,
      createdAt: new Date().toISOString()
    };

    saveUsers([...existingUsers, newUserRecord]);

    const sessionUser = { username, name: username, loggedIn: true };
    saveCurrentUser(sessionUser);
    setUser(sessionUser);
    showToast(`Welcome, ${username}! Your account is ready.`);
    return { error: null };
  };

  const signIn = (rawUsername, password) => {
    const username = rawUsername.trim();
    if (!username) {
      return { error: 'Please enter your username.' };
    }
    if (!password) {
      return { error: 'Please enter your password.' };
    }

    const existingUsers = loadUsers();
    const foundUser = existingUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!foundUser) {
      return { error: `No account found with username "${username}". Please sign up first.` };
    }

    if (foundUser.password !== password) {
      return { error: 'Incorrect password. Please verify your credentials and try again.' };
    }

    const sessionUser = { username: foundUser.username, name: foundUser.username, loggedIn: true };
    saveCurrentUser(sessionUser);
    setUser(sessionUser);
    showToast(`Welcome back, ${foundUser.username}!`);
    return { error: null };
  };

  const signOut = () => {
    removeCurrentUser();
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
