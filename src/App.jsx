import React, { useEffect } from 'react';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import { Navigation } from './components/layout/Navigation';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/ui/Toast';

import { LandingPage } from './views/LandingPage';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { AddExpenseView } from './views/AddExpenseView';
import { ExpensesView } from './views/ExpensesView';
import { BudgetView } from './views/BudgetView';
import { InsightsView } from './views/InsightsView';
import { AIAssistantView } from './views/AIAssistantView';
import { SettingsView } from './views/SettingsView';

const PROTECTED_VIEWS = ['dashboard', 'add-expense', 'expenses', 'budget', 'insights', 'ai-assistant', 'settings'];

const MainLayout = () => {
  const { activeView, setActiveView, user, isDemo, authLoading } = useExpenses();

  // Protected Route Guard Effect
  useEffect(() => {
    if (authLoading) return;

    const isProtected = PROTECTED_VIEWS.includes(activeView);
    if (isProtected && !user && !isDemo) {
      setActiveView('auth');
    }
  }, [activeView, user, isDemo, authLoading, setActiveView]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-semibold text-slate-500">Loading SpendWise...</span>
      </div>
    );
  }

  if (activeView === 'landing') {
    return (
      <>
        <LandingPage />
        <Toast />
      </>
    );
  }

  if (activeView === 'auth') {
    return (
      <>
        <AuthView />
        <Toast />
      </>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'add-expense':
        return <AddExpenseView />;
      case 'expenses':
        return <ExpensesView />;
      case 'budget':
        return <BudgetView />;
      case 'insights':
        return <InsightsView />;
      case 'ai-assistant':
        return <AIAssistantView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navigation />
      
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <Header />
        
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderView()}
        </main>

        <Footer />
      </div>

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ExpenseProvider>
      <MainLayout />
    </ExpenseProvider>
  );
}
