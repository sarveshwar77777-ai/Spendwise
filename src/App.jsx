import React from 'react';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import { Navigation } from './components/layout/Navigation';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/ui/Toast';

import { LandingPage } from './views/LandingPage';
import { DashboardView } from './views/DashboardView';
import { AddExpenseView } from './views/AddExpenseView';
import { ExpensesView } from './views/ExpensesView';
import { BudgetView } from './views/BudgetView';
import { InsightsView } from './views/InsightsView';
import { AIAssistantView } from './views/AIAssistantView';
import { SettingsView } from './views/SettingsView';

const MainLayout = () => {
  const { activeView } = useExpenses();

  if (activeView === 'landing') {
    return (
      <>
        <LandingPage />
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
