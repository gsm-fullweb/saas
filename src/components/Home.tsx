import React from 'react';
import { Star, Clock, TrendingUp, Users, MessageSquare, AlertCircle } from 'lucide-react';
import { useChatwootData } from '../hooks/useChatwootData';
import { useAIStatus } from '../hooks/useAIStatus';

interface HomeProps {
  onContactClick?: (contact: any) => void;
  onConversationClick?: (conversation: any) => void;
}

const Home: React.FC<HomeProps> = ({ onContactClick, onConversationClick }) => {
  const {
    loading,
    error,
    conversations,
    agents,
    contacts,
    metrics,
    refreshData,
  } = useChatwootData(1);

  const { isAIAvailable } = useAIStatus();

  // Processar dados do Chatwoot
  const openConversations = conversations.filter(c => c.status === 'open');
  const urgentConversations = conversations.filter(c => c.unread_count > 0);
  const recentConversations = conversations
    .sort((a, b) => b.last_activity_at - a.last_activity_at)
    .slice(0, 5);

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(timestamp * 1000));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'resolved': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Carregando dados...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Erro ao carregar dados
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
          Bem-vindo ao Chathook
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {isAIAvailable ? '🤖 IA ativa - Sistema inteligente funcionando' : '⚠️ IA não configurada - Funcionalidades básicas'}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-600/20 dark:to-green-700/20 border border-green-200 dark:border-green-600/30 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{openConversations.length}</p>
              <p className="text-green-700 dark:text-green-300 text-sm">Conversas abertas</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-600/20 dark:to-red-700/20 border border-red-200 dark:border-red-600/30 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{urgentConversations.length}</p>
              <p className="text-red-700 dark:text-red-300 text-sm">Sem resposta</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-600/20 dark:to-blue-700/20 border border-blue-200 dark:border-blue-600/30 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{agents.length}</p>
              <p className="text-blue-700 dark:text-blue-300 text-sm">Agentes</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-600/20 dark:to-purple-700/20 border border-purple-200 dark:border-purple-600/30 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics?.resolution_rate || 0}%</p>
              <p className="text-purple-700 dark:text-purple-300 text-sm">Taxa resolução</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Urgent Conversations */}
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Conversas Urgentes</h3>
          </div>
          
          <div className="space-y-4">
            {urgentConversations.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                Nenhuma conversa urgente no momento.
              </p>
            ) : (
              urgentConversations.slice(0, 5).map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => onConversationClick?.(conversation)}
                  className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                >
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-medium">
                      {conversation.meta?.sender?.name || 'Cliente'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {conversation.unread_count} mensagens não lidas
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                      {formatDate(conversation.last_activity_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Conversas Recentes</h3>
          </div>
          
          <div className="space-y-3">
            {recentConversations.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                Nenhuma conversa recente.
              </p>
            ) : (
              recentConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => onConversationClick?.(conversation)}
                  className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {(conversation.meta?.sender?.name || 'C').split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {conversation.meta?.sender?.name || 'Cliente'}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(conversation.status)}`}>
                        {conversation.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-500 dark:text-gray-500 text-sm">
                    {formatDate(conversation.last_activity_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Status */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className={`w-5 h-5 rounded-full ${isAIAvailable ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Status da Inteligência Artificial
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Lead Scoring</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAIAvailable ? '✅ Ativo' : '⚠️ Desabilitado'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Auto Reply</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAIAvailable ? '✅ Ativo' : '⚠️ Desabilitado'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Roteamento</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAIAvailable ? '✅ Ativo' : '⚠️ Desabilitado'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;