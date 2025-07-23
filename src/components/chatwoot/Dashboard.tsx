import React from 'react';
import { TrendingUp, Users, Clock, MessageSquare } from 'lucide-react';
import { DashboardMetrics, Conversation } from '../../types/chatwoot';
import MetricsCards from './MetricsCards';

interface DashboardProps {
  metrics: DashboardMetrics;
  recentConversations: Conversation[];
  loading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, recentConversations, loading = false }) => {
  // Log para debug
  console.log('📊 Dashboard render:', { 
    metrics, 
    conversationsCount: recentConversations.length,
    loading 
  });

  const formatTimeAgo = (dateInput: string | number) => {
    let date: Date;
    
    // Se for timestamp (número), converter para Date
    if (typeof dateInput === 'number') {
      date = new Date(dateInput * 1000); // Assumindo timestamp em segundos
    } else {
      date = new Date(dateInput);
    }
    
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

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <MetricsCards metrics={metrics} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Atividade Recente
            </h3>
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
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {loading ? 'Carregando...' : 'Nenhuma conversa encontrada'}
                </p>
              </div>
            ) : (
              recentConversations.slice(0, 5).map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                    {(conversation.contact?.name || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {conversation.contact?.name || 'Cliente'}
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

        {/* Performance Chart Placeholder */}
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
                {metrics?.avg_response_time || 0} min
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
                style={{ 
                  width: `${Math.min(
                    (metrics?.avg_response_time || 0) > 0 
                      ? (15 / (metrics?.avg_response_time || 1)) * 100 
                      : 100, 
                    100
                  )}%` 
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {metrics?.resolution_rate || 0}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Taxa de Resolução
                </p>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {metrics?.agents_online || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Agentes Online
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;