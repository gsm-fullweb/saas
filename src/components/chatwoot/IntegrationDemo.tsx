import React, { useState } from 'react';
import { useChatwootData } from '../../hooks/useChatwootData';
import { LangChainOrchestratorDemo } from './LangChainOrchestratorDemo';
import { 
  Database, 
  Brain, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Activity,
  Users,
  MessageSquare,
  Tag
} from 'lucide-react';

export const IntegrationDemo: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'orchestrator' | 'data-flow'>('overview');
  
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
  } = useChatwootData(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'resolved': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'snoozed': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp * 1000);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Integração Completa: Proxy + LangChain + Frontend
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Demonstração da substituição de mocks por dados reais com processamento inteligente
            </p>
          </div>
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="flex items-center gap-2 text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Carregando...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Conectado</span>
              </div>
            )}
            <button
              onClick={refreshData}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Atualizar
            </button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <Database className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Proxy Chatwoot</p>
              <p className="text-xs text-green-600 dark:text-green-400">Dados reais</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <Brain className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">LangChain</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Processamento IA</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Zap className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Automações</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Webhooks n8n</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <Activity className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Monitoramento</p>
              <p className="text-xs text-orange-600 dark:text-orange-400">Agente ativo</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setSelectedTab('orchestrator')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'orchestrator'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              LangChain Orchestrator
            </button>
            <button
              onClick={() => setSelectedTab('data-flow')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'data-flow'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Fluxo de Dados
            </button>
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Métricas em Tempo Real */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Métricas em Tempo Real (Proxy + LangChain)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Abertas</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {metrics.open_conversations}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">Resolvidas</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {metrics.resolved_conversations}
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Agentes Online</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                      {metrics.agents_online}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Taxa Resolução</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {metrics.resolution_rate}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Conversas Recentes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Conversas Recentes (Dados Reais do Proxy)
                </h3>
                <div className="space-y-3">
                  {conversations.slice(0, 5).map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {conversation.meta?.sender?.name?.charAt(0) || 'C'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {conversation.meta?.sender?.name || 'Cliente'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            #{conversation.id} • {formatTimeAgo(conversation.last_activity_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(conversation.status)}`}>
                          {conversation.status}
                        </span>
                        {conversation.unread_count > 0 && (
                          <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informações do Sistema */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Informações do Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Última Atualização</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {lastUpdate.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Total de Dados</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {conversations.length} conversas • {agents.length} agentes • {contacts.length} contatos
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Status da Conexão</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {loading ? 'Carregando...' : 'Conectado ao proxy'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'orchestrator' && (
            <LangChainOrchestratorDemo 
              conversation={conversations[0]}
              agents={agents}
            />
          )}

          {selectedTab === 'data-flow' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Fluxo de Dados: Mocks → Proxy → LangChain → Frontend
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Antes (Mocks) */}
                <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Antes: Dados Mockados
                  </h4>
                  <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                    <li>• Dados estáticos e fake</li>
                    <li>• Sem integração real</li>
                    <li>• Sem processamento inteligente</li>
                    <li>• Sem automações</li>
                    <li>• Dados desatualizados</li>
                  </ul>
                </div>

                {/* Depois (Proxy + LangChain) */}
                <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Depois: Dados Reais + IA
                  </h4>
                  <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                    <li>• Dados reais do Chatwoot via proxy</li>
                    <li>• Processamento inteligente com LangChain</li>
                    <li>• Lead scoring automático</li>
                    <li>• Respostas automáticas</li>
                    <li>• Integração com n8n</li>
                  </ul>
                </div>
              </div>

              {/* Diagrama do Fluxo */}
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-4">
                  Fluxo de Integração
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <span className="text-sm font-medium">Frontend faz requisição</span>
                    </div>
                    <span className="text-xs text-gray-500">→</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <span className="text-sm font-medium">Proxy retorna dados reais</span>
                    </div>
                    <span className="text-xs text-gray-500">→</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <span className="text-sm font-medium">LangChain processa com IA</span>
                    </div>
                    <span className="text-xs text-gray-500">→</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <span className="text-sm font-medium">Automações executadas</span>
                    </div>
                    <span className="text-xs text-gray-500">→</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        5
                      </div>
                      <span className="text-sm font-medium">Frontend exibe dados atualizados</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 