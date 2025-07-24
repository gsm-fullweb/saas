import React from 'react';
import { MessageSquare, CheckCircle, Clock, Pause, Users, Timer, AlertCircle, TrendingUp } from 'lucide-react';
import { DashboardMetrics } from '../../types/chatwoot';

interface MetricsCardsProps {
  metrics: DashboardMetrics;
  loading?: boolean;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics, loading = false }) => {
  // Log para debug
  console.log('📊 MetricsCards render:', { metrics, loading });

  const cards = [
    {
      title: 'Abertas',
      value: metrics?.open_conversations || 0,
      icon: MessageSquare,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Resolvidas',
      value: metrics?.resolved_conversations || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Pendentes',
      value: metrics?.pending_conversations || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      title: 'Pausadas',
      value: metrics?.snoozed_conversations || 0,
      icon: Pause,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Atendentes Online',
      value: metrics?.agents_online || 0,
      icon: Users,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'SLA Médio',
      value: `${metrics?.avg_response_time || 0}min`,
      icon: Timer,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      title: 'Sem Resposta',
      value: metrics?.conversations_without_reply || 0,
      icon: AlertCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400'
    },
    {
      title: 'Taxa Resolução',
      value: `${metrics?.resolution_rate || 0}%`,
      icon: TrendingUp,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      textColor: 'text-teal-600 dark:text-teal-400'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <div
            key={index}
            className={`${card.bgColor} border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsCards;