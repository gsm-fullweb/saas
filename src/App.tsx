import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/chatwoot/Header';
import Navigation from './components/chatwoot/Navigation';
import Dashboard from './components/chatwoot/Dashboard';
import ConversationsList from './components/chatwoot/ConversationsList';
import KanbanBoard from './components/chatwoot/KanbanBoard';
import { WorkingDemo } from './components/chatwoot/WorkingDemo';
import { useChatwootData } from './hooks/useChatwootData';
import { User } from './types/chatwoot';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Current user - in real app, this would come from authentication
  const [currentUser] = useState<User>({
    id: 1,
    name: 'RICHARD WAGNER PORTELA',
    email: 'richard.fullweb@gmail.com',
    role: 'administrator',
    availability_status: 'online'
  });

  // Usar o hook centralizado que substitui todos os mocks por dados reais do proxy + LangChain
  const {
    loading,
    error,
    lastUpdate,
    conversations,
    agents,
    contacts,
    teams,
    metrics,
    refreshData,
    processNewMessage,
    processStatusChange,
    processAgentAssignment,
  } = useChatwootData(1); // account_id = 1

  // Transformar dados para compatibilidade com componentes existentes
  const transformedConversations = conversations.map((conv: any) => ({
    ...conv,
    contact: conv.meta?.sender || conv.contact || { name: 'Cliente', phone_number: '' },
    assignee: conv.meta?.assignee,
    team: conv.meta?.team,
    messages_count: conv.messages?.length || 0,
    last_activity_at: conv.last_activity_at ? new Date(conv.last_activity_at * 1000).toISOString() : new Date().toISOString(),
    created_at: conv.created_at ? new Date(conv.created_at * 1000).toISOString() : new Date().toISOString(),
    updated_at: conv.updated_at ? new Date(conv.updated_at * 1000).toISOString() : new Date().toISOString(),
    labels: conv.labels?.map((label: string) => ({
      id: Math.random(),
      title: label,
      color: '#3b82f6',
      show_on_sidebar: true
    })) || []
  }));

  const handleUpdateConversation = async (conversationId: number, updates: any) => {
    try {
      console.log('🔄 Updating conversation with LangChain processing:', conversationId, updates);
      
      // Process update with LangChain
      if (updates.status) {
        await processStatusChange(conversationId, updates.status);
      }
      
      if (updates.assignee_id) {
        await processAgentAssignment(conversationId, updates.assignee_id);
      }
      
      // Refresh data to get updated state from proxy
      await refreshData();
      
      console.log('✅ Conversation updated successfully with LangChain processing');
    } catch (error) {
      console.error('❌ Error updating conversation:', error);
      if (!updates.team_id) {
        alert('Erro ao atualizar conversa. Tente novamente.');
      }
    }
  };

  const handleConversationClick = (conversation: any) => {
    console.log('🔄 Conversation clicked:', conversation.id);
    // Switch to conversations tab and potentially open the conversation
    setActiveTab('conversations');
  };

  const handleMarkAsRead = (conversationId: number) => {
    console.log('🔄 Marking conversation as read:', conversationId);
    // In a real app, this would make an API call to mark as read
    // For now, just refresh data to get updated state
    refreshData();
  };

  const handleMarkAllAsRead = () => {
    console.log('🔄 Marking all conversations as read');
    // In a real app, this would make an API call to mark all as read
    // For now, just refresh data to get updated state
    refreshData();
  };

  const handleAddNote = (conversationId: number) => {
    console.log('🔄 Add note to conversation:', conversationId);
    // In a real app, this would open a note modal
  };

  const handleAddLabel = (conversationId: number) => {
    console.log('🔄 Add label to conversation:', conversationId);
    // In a real app, this would open a label selector
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            metrics={metrics}
            recentConversations={transformedConversations}
            loading={loading}
          />
        );
      case 'conversations':
        return (
          <ConversationsList
            conversations={transformedConversations}
            agents={agents}
            onConversationClick={handleConversationClick}
            onUpdateConversation={handleUpdateConversation}
            onAddNote={handleAddNote}
            onAddLabel={handleAddLabel}
          />
        );
      case 'kanban':
        return (
          <KanbanBoard
            conversations={transformedConversations}
            agents={agents}
            onUpdateConversation={handleUpdateConversation}
            onConversationClick={handleConversationClick}
          />
        );
      case 'demo':
        return <WorkingDemo />;
      case 'reports':
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Relatórios
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Funcionalidade em desenvolvimento
            </p>
          </div>
        );
      case 'config':
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Configurações
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Funcionalidade em desenvolvimento
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header
          user={currentUser}
          conversations={transformedConversations}
          onNotificationClick={() => console.log('Notifications clicked')}
          onConversationClick={handleConversationClick}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onSettingsClick={() => console.log('Settings clicked')}
          onLogout={() => console.log('Logout clicked')}
        />
        
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={currentUser.role}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderActiveTab()}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;