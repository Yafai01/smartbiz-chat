import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ChatView } from './components/chat/ChatView';
import { KanbanView } from './components/crm/KanbanView';
import { CatalogView } from './components/catalog/CatalogView';
import { AutomationView } from './components/automation/AutomationView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AuthView } from './components/auth/AuthView';
import { Toaster } from 'react-hot-toast';

const MainContent: React.FC = () => {
  const { isAuthenticated, currentTab } = useApp();

  // If not authenticated, render AuthView
  if (!isAuthenticated) {
    return <AuthView />;
  }

  // Render Main Protected Layout
  return (
    <div className="flex h-screen overflow-hidden bg-wa-dark-bg text-wa-text font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <Header />

        {/* Dynamic View Content */}
        <main className="flex-1 overflow-hidden relative">
          {currentTab === 'chat' && <ChatView />}
          {currentTab === 'crm' && <KanbanView />}
          {currentTab === 'catalog' && <CatalogView />}
          {currentTab === 'automation' && <AutomationView />}
          {currentTab === 'analytics' && <AnalyticsView />}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#111B21',
            color: '#E9EDEF',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            fontSize: '13px',
            padding: '12px 20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: {
              primary: '#25D366',
              secondary: '#0B141A',
            },
          },
        }}
      />
    </AppProvider>
  );
};

export default App;
