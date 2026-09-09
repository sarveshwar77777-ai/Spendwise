import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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
  // Auth state
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App data state
  const [expenses, setExpenses] = useState(() => loadExpenses());
  const [budget, setBudget] = useState(() => loadBudget());
  const [settings, setSettings] = useState(() => loadSettings());
  const [isDemo, setIsDemo] = useState(() => loadIsDemo());
  const [activeView, setActiveView] = useState('landing');
  const [toast, setToast] = useState(null);

  // Toast Notification Helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4000);
  };

  // Dark mode effect
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveSettings(settings);
  }, [settings.theme]);

  // Persist demo/offline fallback states
  useEffect(() => {
    if (!user || isDemo) saveExpenses(expenses);
  }, [expenses, user, isDemo]);

  useEffect(() => {
    if (!user || isDemo) saveBudget(budget);
  }, [budget, user, isDemo]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveIsDemo(isDemo);
  }, [isDemo]);

  // -------------------------------------------------------------------
  // SUPABASE AUTH & DATA SYNC
  // -------------------------------------------------------------------
  const fetchUserData = async (currentUser) => {
    if (!currentUser || !isSupabaseConfigured) return;

    try {
      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // 2. Fetch User Expenses
      const { data: expenseData, error: expError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('date', { ascending: false });

      if (!expError && expenseData) {
        // Map database columns to app format
        const mappedExpenses = expenseData.map(e => ({
          id: e.id,
          amount: Number(e.amount),
          description: e.description,
          category: e.category,
          date: e.date,
          paymentMethod: e.payment_method,
          createdAt: e.created_at
        }));
        setExpenses(mappedExpenses);
      }

      // 3. Fetch User Budget
      const { data: budgetData, error: bError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (!bError && budgetData) {
        setBudget({
          monthlyBudget: Number(budgetData.monthly_budget) || DEFAULT_MONTHLY_BUDGET,
          categoryBudgets: budgetData.category_budgets || INITIAL_CATEGORY_BUDGETS
        });
      }
    } catch (err) {
      console.error('Error fetching Supabase user data:', err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return;
    }

    // Check initial auth session
    supabase.auth.getSession().then(({ data: { session: initSession } }) => {
      setSession(initSession);
      const currentUser = initSession?.user || null;
      setUser(currentUser);

      if (currentUser && !isDemo) {
        fetchUserData(currentUser);
      }
      setAuthLoading(false);
    });

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      const currentUser = currentSession?.user || null;
      setUser(currentUser);

      if (event === 'SIGNED_IN' && currentUser) {
        setIsDemo(false);
        await fetchUserData(currentUser);
        setActiveView('dashboard');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setExpenses([]);
        setBudget({
          monthlyBudget: DEFAULT_MONTHLY_BUDGET,
          categoryBudgets: { ...INITIAL_CATEGORY_BUDGETS }
        });
        setActiveView('auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // -------------------------------------------------------------------
  // MUTATION METHODS (SUPABASE / DEMO)
  // -------------------------------------------------------------------

  // Add Expense
  const addExpense = async (newExpenseData) => {
    const tempId = `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newExpense = {
      ...newExpenseData,
      id: tempId,
      createdAt: new Date().toISOString()
    };

    // Immediate UI Update
    setExpenses(prev => [newExpense, ...prev]);

    // Supabase Insert if logged in and not in demo mode
    if (user && !isDemo && isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          user_id: user.id,
          amount: newExpense.amount,
          description: newExpense.description,
          category: newExpense.category,
          date: newExpense.date,
          payment_method: newExpense.paymentMethod
        }])
        .select()
        .single();

      if (error) {
        console.error('Error inserting expense into Supabase:', error);
        showToast('Failed to save to database', 'error');
        // Revert local optimistic addition on DB error
        setExpenses(prev => prev.filter(exp => exp.id !== tempId));
        return null;
      }

      if (data) {
        // Update local item with real DB UUID
        setExpenses(prev => prev.map(exp => exp.id === tempId ? {
          ...exp,
          id: data.id,
          createdAt: data.created_at
        } : exp));
      }
    }

    showToast(`Added "${newExpense.description}" (${settings.currency}${newExpense.amount})`);
    return newExpense;
  };

  // Update Expense
  const updateExpense = async (id, updatedData) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, ...updatedData } : exp));

    if (user && !isDemo && isSupabaseConfigured) {
      const { error } = await supabase
        .from('expenses')
        .update({
          amount: updatedData.amount,
          description: updatedData.description,
          category: updatedData.category,
          date: updatedData.date,
          payment_method: updatedData.paymentMethod
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating expense in Supabase:', error);
        showToast('Failed to update database', 'error');
        return;
      }
    }

    showToast('Expense updated successfully');
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));

    if (user && !isDemo && isSupabaseConfigured) {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting expense from Supabase:', error);
        showToast('Failed to delete from database', 'error');
        return;
      }
    }

    showToast('Expense deleted', 'info');
  };

  // Update Budget
  const updateBudgetConfig = async (newBudget) => {
    const updatedBudget = {
      ...budget,
      ...newBudget
    };
    setBudget(updatedBudget);

    if (user && !isDemo && isSupabaseConfigured) {
      const { error } = await supabase
        .from('budgets')
        .upsert({
          user_id: user.id,
          monthly_budget: updatedBudget.monthlyBudget,
          category_budgets: updatedBudget.categoryBudgets
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error updating budget in Supabase:', error);
        showToast('Failed to save budget to database', 'error');
        return;
      }
    }

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
    if (user) {
      fetchUserData(user);
    }
  };

  // Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setExpenses([]);
    setIsDemo(false);
    setActiveView('auth');
    showToast('Signed out successfully', 'info');
  };

  // Clear Local Data
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

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const setCurrency = (currency) => {
    setSettings(prev => ({ ...prev, currency }));
    showToast(`Currency changed to ${currency}`);
  };

  return (
    <ExpenseContext.Provider value={{
      user,
      profile,
      session,
      authLoading,
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
      signOut,
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
