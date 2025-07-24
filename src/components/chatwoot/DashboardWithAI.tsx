import React, { useState } from 'react';
import { TrendingUp, Users, Clock, MessageSquare, Bot } from 'lucide-react';
import { DashboardMetrics, Conversation } from '../../types/chatwoot';
import MetricsCards from './MetricsCards';
import { AIAssistant } from './AIAssistant';

interface DashboardWithAIProps {
  metrics: DashboardMetrics;
  recentConversations: Conversation[];
  loading?: boolean;
}

const DashboardWithAI: React.FC<DashboardWithAIProps> = ({ 
  metrics, 
  recentConversations, 
  loading = false 
}) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'agora';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'snoozed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberta';
      case 'pending': return 'Pendente';
      case 'snoozed': return 'Pausada';
      case 'resolved': return 'Resolvida';
      default: return status;
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowAIAssistant(true);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    // Aqui você pode implementar a lógica para usar a sugestão
    // Por exemplo, preencher um campo de resposta ou enviar a mensagem
    console.log('Sugestão selecionada:', suggestion);
    alert(`Sugestão selecionada: ${suggestion}`);
  };

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <MetricsCards metrics={metrics} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Atividade Recente
              </h3>
            </div>
            {selectedConversation && (
              <button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <Bot className="w-4 h-4" />
                {showAIAssistant ? 'Ocultar IA' : 'Mostrar IA'}
              </button>
            )}
          </div>

          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))
            ) : recentConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">
                  Nenhuma atividade recente
                </p>
              </div>
            ) : (
              recentConversations.slice(0, 5).map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : ''
                  }`}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                    {conversation.contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {conversation.contact.name}
                      </p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(conversation.status)}`}>
                        {getStatusLabel(conversation.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>#{conversation.id}</span>
                      <span>{formatTimeAgo(conversation.last_activity_at)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div className="lg:col-span-1">
          {showAIAssistant && selectedConversation ? (
            <AIAssistant 
              conversation={selectedConversation}
              onSuggestionSelect={handleSuggestionSelect}
            />
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Assistente de IA
                </h3>
              </div>
              
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Selecione uma conversa para usar o assistente de IA
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-500">
                  <p>• Analisar sentimento do cliente</p>
                  <p>• Gerar sugestões de resposta</p>
                  <p>• Classificar urgência</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tempo de Resposta
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Média Hoje</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {metrics.avg_response_time} min
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Meta SLA</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              15 min
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((15 / metrics.avg_response_time) * 100, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {metrics.resolution_rate}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Taxa de Resolução
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {metrics.agents_online}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Agentes Online
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWithAI; 