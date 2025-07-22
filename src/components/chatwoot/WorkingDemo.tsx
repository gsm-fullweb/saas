import React, { useState } from 'react';
import { useChatwootData } from '../../hooks/useChatwootData';
import { langChainOrchestrator } from '../../services/langchainOrchestrator';
import { 
  CheckCircle, 
  AlertCircle, 
  Brain, 
  Database, 
  Zap, 
  MessageSquare,
  Users,
  Tag,
  Play,
  Loader2
} from 'lucide-react';

export const WorkingDemo: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const {
    loading,
    error,
    conversations,
    agents,
    metrics,
    refreshData,
    processNewMessage,
    processStatusChange,
    processAgentAssignment,
  } = useChatwootData(1);

  const handleTestLangChain = async () => {
    setIsProcessing(true);
    setLastAction('Testando LangChain...');
    setResults([]);

    try {
      // Simular uma conversa de teste
      const testConversation = conversations[0] || {
        id: 999,
        messages: [
          {
            content: "Preciso de ajuda urgente com meu pedido #12345",
            sender: { name: "Cliente Teste" }
          }
        ]
      };

      console.log('🧪 Iniciando teste do LangChain...');

      // Testar lead scoring
      const leadScore = await langChainOrchestrator.performLeadScoring(testConversation);
      setResults(prev => [...prev, { type: 'lead_scoring', data: leadScore }]);

      // Testar resposta automática
      const autoReply = await langChainOrchestrator.generateAutoReply(testConversation);
      setResults(prev => [...prev, { type: 'auto_reply', data: autoReply }]);

      // Testar roteamento
      const routing = await langChainOrchestrator.determineRouting(testConversation, agents);
      setResults(prev => [...prev, { type: 'routing', data: routing }]);

      // Testar enrichment
      const enrichment = await langChainOrchestrator.enrichContact(
        { id: 1, name: "Cliente Teste" },
        testConversation
      );
      setResults(prev => [...prev, { type: 'enrichment', data: enrichment }]);

      setLastAction('✅ Teste do LangChain concluído com sucesso!');
    } catch (error) {
      console.error('❌ Erro no teste:', error);
      setLastAction('❌ Erro no teste do LangChain');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestEvent = async (eventType: string) => {
    setIsProcessing(true);
    setLastAction(`Processando evento: ${eventType}`);

    try {
      const testConversation = conversations[0] || {
        id: 999,
        messages: [{ content: "Mensagem de teste", sender: { name: "Cliente" } }]
      };

      const event = {
        type: eventType as any,
        data: {
          conversation: testConversation,
          contact: { id: 1, name: "Cliente Teste" },
          availableAgents: agents,
          message: { content: "Mensagem de teste" },
          newStatus: 'resolved',
          agentId: 1
        },
        timestamp: new Date().toISOString()
      };

      const actions = await langChainOrchestrator.processEvent(event);
      
      if (actions.length > 0) {
        await langChainOrchestrator.executeActions(actions);
        setLastAction(`✅ Evento ${eventType} processado com ${actions.length} ações`);
      } else {
        setLastAction(`ℹ️ Evento ${eventType} processado sem ações necessárias`);
      }
    } catch (error) {
      console.error('❌ Erro ao processar evento:', error);
      setLastAction(`❌ Erro ao processar evento ${eventType}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
    if (error) return <AlertCircle className="w-4 h-4 text-red-600" />;
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

  const getStatusText = () => {
    if (loading) return 'Carregando dados...';
    if (error) return 'Erro ao carregar dados';
    return 'Sistema funcionando';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎯 Demonstração Funcionando
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Sistema integrado sem erros de CORS - Dados reais + LangChain
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <Database className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Proxy Chatwoot</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {conversations.length} conversas carregadas
              </p>
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
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Agentes</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {agents.length} agentes disponíveis
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <Zap className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Métricas</p>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                {metrics.open_conversations} abertas
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Test Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🧪 Testes do LangChain
        </h2>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleTestLangChain}
            disabled={isProcessing || loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
            Teste Completo LangChain
          </button>

          <button
            onClick={() => handleTestEvent('conversation_created')}
            disabled={isProcessing || loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Nova Conversa
          </button>

          <button
            onClick={() => handleTestEvent('message_created')}
            disabled={isProcessing || loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Nova Mensagem
          </button>

          <button
            onClick={() => handleTestEvent('conversation_status_changed')}
            disabled={isProcessing || loading}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Tag className="w-4 h-4" />
            Mudança Status
          </button>

          <button
            onClick={() => handleTestEvent('agent_assigned')}
            disabled={isProcessing || loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Users className="w-4 h-4" />
            Atribuir Agente
          </button>

          <button
            onClick={refreshData}
            disabled={isProcessing || loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4" />
            Atualizar Dados
          </button>
        </div>

        {lastAction && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">{lastAction}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Resultados dos Testes
          </h3>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 capitalize">
                  {result.type.replace('_', ' ')}
                </h4>
                <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📈 Visão Geral dos Dados
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Conversas</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>Total: {conversations.length}</p>
              <p>Abertas: {metrics.open_conversations}</p>
              <p>Resolvidas: {metrics.resolved_conversations}</p>
              <p>Pendentes: {metrics.pending_conversations}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Agentes</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>Total: {agents.length}</p>
              <p>Online: {metrics.agents_online}</p>
              <p>Taxa Resolução: {metrics.resolution_rate}%</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Performance</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>Tempo Médio: {metrics.avg_response_time}min</p>
              <p>Sem Resposta: {metrics.conversations_without_reply}</p>
              <p>Hoje: {metrics.total_conversations_today}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 