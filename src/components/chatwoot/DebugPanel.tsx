import React from 'react';
import { useChatwootData } from '../../hooks/useChatwootData';
import { useAIStatus } from '../../hooks/useAIStatus';
import { AIStatusIndicator } from './AIStatusIndicator';
import { RefreshCw, AlertCircle, CheckCircle, Clock, Database } from 'lucide-react';

export const DebugPanel: React.FC = () => {
  const {
    loading,
    error,
    lastUpdate,
    conversations,
    agents,
    contacts,
    teams,
    inboxes,
    metrics,
    refreshData,
  } = useChatwootData(1);

  const { isAIAvailable, isChecking, checkStatus } = useAIStatus();

  const getStatusIcon = () => {
    if (loading) return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
    if (error) return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (loading) return 'Carregando...';
    if (error) return 'Erro no carregamento';
    return 'Dados carregados';
  };

  const getStatusColor = () => {
    if (loading) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    if (error) return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    return 'text-green-600 bg-green-100 dark:bg-green-900/20';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5" />
          Debug Panel
        </h3>
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={checkStatus}
            disabled={isChecking}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            <CheckCircle className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            Check AI
          </button>
        </div>
      </div>

      {/* Status Geral */}
      <div className="mb-4">
        <div className={`flex items-center gap-2 p-3 rounded-lg ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
        </div>
        {lastUpdate && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Última atualização: {lastUpdate.toLocaleString('pt-BR')}
          </p>
        )}
      </div>

      {/* Status da IA */}
      <div className="mb-4">
        <AIStatusIndicator 
          isAIAvailable={isAIAvailable}
          onConfigureClick={() => {
            alert('Para configurar a IA:\n\n1. Crie um arquivo .env na raiz do projeto\n2. Adicione: VITE_OPENAI_API_KEY=sua_chave_aqui\n3. Reinicie o servidor\n\nVeja o arquivo OPENAI_SETUP.md para mais detalhes.');
          }}
        />
      </div>

      {/* Contadores de Dados */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {conversations.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Conversas</div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {agents.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Agentes</div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {contacts.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Contatos</div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {teams.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Equipes</div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {inboxes.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Inboxes</div>
        </div>
      </div>

      {/* Métricas */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Métricas</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Abertas:</span>
            <span className="font-medium">{metrics.open_conversations}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Resolvidas:</span>
            <span className="font-medium">{metrics.resolved_conversations}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Pendentes:</span>
            <span className="font-medium">{metrics.pending_conversations}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Agentes Online:</span>
            <span className="font-medium">{metrics.agents_online}</span>
          </div>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Erro</h4>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Dados de Exemplo */}
      {conversations.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Primeira Conversa</h4>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(conversations[0], null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Debug Info</h4>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm space-y-2">
          <div><strong>Loading:</strong> {loading ? 'Sim' : 'Não'}</div>
          <div><strong>Error:</strong> {error || 'Nenhum'}</div>
          <div><strong>Last Update:</strong> {lastUpdate?.toLocaleString('pt-BR') || 'Nunca'}</div>
          <div><strong>Conversations:</strong> {conversations.length}</div>
          <div><strong>Agents:</strong> {agents.length}</div>
          <div><strong>Contacts:</strong> {contacts.length}</div>
          <div><strong>Teams:</strong> {teams.length}</div>
          <div><strong>Inboxes:</strong> {inboxes.length}</div>
          <div><strong>Metrics:</strong> {JSON.stringify(metrics, null, 2)}</div>
        </div>
      </div>
    </div>
  );
}; 