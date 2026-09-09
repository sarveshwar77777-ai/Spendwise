// LocalStorage engine for SpendWise
import { DEFAULT_MONTHLY_BUDGET, INITIAL_CATEGORY_BUDGETS } from './demoData';

const STORAGE_KEYS = {
  EXPENSES: 'spendwise_expenses_v1',
  BUDGET: 'spendwise_budget_v1',
  SETTINGS: 'spendwise_settings_v1',
  IS_DEMO: 'spendwise_is_demo_v1',
  USERS: 'spendwise_users_v1',
  CURRENT_USER: 'spendwise_current_user_v1',
  LEGACY_USER: 'spendwise_user_v1'
};

// Default Settings
export const DEFAULT_SETTINGS = {
  currency: '₹',
  theme: 'light',
  notifications: true
};

// Safe JSON parser helper
const getStoredData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading key ${key} from localStorage:`, error);
    return fallback;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving key ${key} to localStorage:`, error);
  }
};

// Expense Operations
export const loadExpenses = () => getStoredData(STORAGE_KEYS.EXPENSES, []);
export const saveExpenses = (expenses) => setStoredData(STORAGE_KEYS.EXPENSES, expenses);

// Budget Operations
export const loadBudget = () => getStoredData(STORAGE_KEYS.BUDGET, {
  monthlyBudget: DEFAULT_MONTHLY_BUDGET,
  categoryBudgets: { ...INITIAL_CATEGORY_BUDGETS }
});
export const saveBudget = (budget) => setStoredData(STORAGE_KEYS.BUDGET, budget);

// Settings Operations
export const loadSettings = () => getStoredData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
export const saveSettings = (settings) => setStoredData(STORAGE_KEYS.SETTINGS, settings);

// Demo State
export const loadIsDemo = () => getStoredData(STORAGE_KEYS.IS_DEMO, false);
export const saveIsDemo = (isDemo) => setStoredData(STORAGE_KEYS.IS_DEMO, isDemo);

// Users List (Unique Usernames)
export const loadUsers = () => {
  const users = getStoredData(STORAGE_KEYS.USERS, []);
  // Legacy migration if spendwise_user_v1 exists
  const legacy = getStoredData(STORAGE_KEYS.LEGACY_USER, null);
  if (legacy && legacy.name && !users.some(u => u.username.toLowerCase() === legacy.name.toLowerCase())) {
    users.push({
      username: legacy.name,
      password: legacy.password,
      createdAt: new Date().toISOString()
    });
    setStoredData(STORAGE_KEYS.USERS, users);
  }
  return users;
};
export const saveUsers = (users) => setStoredData(STORAGE_KEYS.USERS, users);

// Current User Session
export const loadCurrentUser = () => {
  const current = getStoredData(STORAGE_KEYS.CURRENT_USER, null);
  if (current?.loggedIn) return current;
  // Legacy check
  const legacy = getStoredData(STORAGE_KEYS.LEGACY_USER, null);
  if (legacy?.loggedIn) {
    return { username: legacy.name, loggedIn: true };
  }
  return null;
};
export const saveCurrentUser = (user) => setStoredData(STORAGE_KEYS.CURRENT_USER, user);
export const removeCurrentUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.LEGACY_USER);
  } catch (e) {}
};

// Clear All App Data
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing localStorage data:', error);
  }
};
