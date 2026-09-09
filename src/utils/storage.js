// LocalStorage engine for SpendWise
import { DEFAULT_MONTHLY_BUDGET, INITIAL_CATEGORY_BUDGETS } from './demoData';

const STORAGE_KEYS = {
  EXPENSES: 'spendwise_expenses_v1',
  BUDGET: 'spendwise_budget_v1',
  SETTINGS: 'spendwise_settings_v1',
  IS_DEMO: 'spendwise_is_demo_v1',
  USER: 'spendwise_user_v1'
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

// User (simple localStorage auth)
export const loadUser = () => getStoredData(STORAGE_KEYS.USER, null);
export const saveUser = (user) => setStoredData(STORAGE_KEYS.USER, user);
export const removeUser = () => {
  try { localStorage.removeItem(STORAGE_KEYS.USER); } catch (e) {}
};

// Clear All App Data
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing localStorage data:', error);
  }
};
