import React, { useState } from 'react';
import { useLangChainOrchestrator } from '../../hooks/useLangChainOrchestrator';
import { 
  Bot, 
  Brain, 
  MessageSquare, 
  Users, 
  Tag, 
  Zap, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  Play,
  RefreshCw
} from 'lucide-react';

interface LangChainOrchestratorDemoProps {
  conversation?: any;
  agents?: any[];
}

export const LangChainOrchestratorDemo: React.FC<LangChainOrchestratorDemoProps> = ({ 
  conversation, 
  agents = [] 
}) => {
  const [selectedEvent, setSelectedEvent] = useState<string>('conversation_created');
  const [customContext, setCustomContext] = useState('');

  const {
    isLoading,
    error,
    lastAction,
    leadScore,
    autoReply,
    routing,
    enrichment,
    processEvent,
    performLeadScoring,
    generateAutoReply,
    determineRouting,
    enrichContact,
    clearResults,
    clearError,
  } = useLangChainOrchestrator();

  // Dados de exemplo para demonstração
  const sampleConversation = conversation || {
    id: 123,
    messages: [
      {
        id: 1,
        content: "Olá, preciso de ajuda com meu pedido #12345",
        sender: { name: "João Silva", email: "joao@email.com" },
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        content: "O pedido está atrasado há 3 dias e preciso urgente",
        sender: { name: "João Silva", email: "joao@email.com" },
        created_at: new Date().toISOString()
      }
    ]
  };

  const sampleAgents = agents.length > 0 ? agents : [
    { id: 1, name: "Maria Santos", specialties: ["Vendas", "Suporte"] },
    { id: 2, name: "Pedro Costa", specialties: ["Técnico", "Urgências"] },
    { id: 3, name: "Ana Oliveira", specialties: ["Financeiro", "Cobrança"] }
  ];

  const handleProcessEvent = async () => {
    const event = {
      type: selectedEvent,
      data: {
        conversation: sampleConversation,
        contact: { id: 1, name: "João Silva", email: "joao@email.com" },
        availableAgents: sampleAgents,
        message: sampleConversation.messages[sampleConversation.messages.length - 1]
      },
      timestamp: new Date().toISOString()
    };

    await processEvent(event);
  };

  const handleLeadScoring = async () => {
    await performLeadScoring(sampleConversation);
  };

  const handleAutoReply = async () => {
    const context = customContext ? { customContext } : undefined;
    await generateAutoReply(sampleConversation, context);
  };

  const handleRouting = async () => {
    await determineRouting(sampleConversation, sampleAgents);
  };

  const handleEnrichment = async () => {
    const contact = { id: 1, name: "João Silva", email: "joao@email.com" };
    await enrichContact(contact, sampleConversation);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          LangChain Orchestrator
        </h2>
        <Bot className="w-5 h-5 text-blue-500" />
      </div>

      {/* Status e Controles */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isLoading ? 'Processando...' : 'Pronto'}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearResults}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Limpar
            </button>
          </div>
        </div>

        {lastAction && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">{lastAction}</p>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
              <button
                onClick={clearError}
                className="ml-auto text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controles de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Evento
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="conversation_created">Nova Conversa</option>
            <option value="message_created">Nova Mensagem</option>
            <option value="conversation_status_changed">Mudança de Status</option>
            <option value="agent_assigned">Agente Atribuído</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contexto Personalizado
          </label>
          <input
            type="text"
            value={customContext}
            onChange={(e) => setCustomContext(e.target.value)}
            placeholder="Contexto adicional..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <button
          onClick={handleProcessEvent}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="w-4 h-4" />
          Processar Evento
        </button>

        <button
          onClick={handleLeadScoring}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Tag className="w-4 h-4" />
          Lead Scoring
        </button>

        <button
          onClick={handleAutoReply}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Resposta Automática
        </button>

        <button
          onClick={handleRouting}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Users className="w-4 h-4" />
          Roteamento
        </button>

        <button
          onClick={handleEnrichment}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Zap className="w-4 h-4" />
          Enriquecimento
        </button>
      </div>

      {/* Resultados */}
      <div className="space-y-4">
        {/* Lead Scoring */}
        {leadScore && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <h3 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Lead Scoring
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-700 dark:text-green-300">Score:</span>
                <span className="ml-2 font-semibold text-green-800 dark:text-green-200">
                  {leadScore.score}/100
                </span>
              </div>
              <div>
                <span className="text-green-700 dark:text-green-300">Categoria:</span>
                <span className="ml-2 font-semibold text-green-800 dark:text-green-200 capitalize">
                  {leadScore.category}
                </span>
              </div>
              <div>
                <span className="text-green-700 dark:text-green-300">Confiança:</span>
                <span className="ml-2 font-semibold text-green-800 dark:text-green-200">
                  {(leadScore.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-2">
              {leadScore.reasoning}
            </p>
          </div>
        )}

        {/* Resposta Automática */}
        {autoReply && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Resposta Automática
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
              {autoReply}
            </p>
          </div>
        )}

        {/* Roteamento */}
        {routing && (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md">
            <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Roteamento
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-orange-700 dark:text-orange-300">Agente:</span>
                <span className="ml-2 font-semibold text-orange-800 dark:text-orange-200">
                  {routing.agentId ? `ID ${routing.agentId}` : 'Não atribuído'}
                </span>
              </div>
              <div>
                <span className="text-orange-700 dark:text-orange-300">Canal:</span>
                <span className="ml-2 font-semibold text-orange-800 dark:text-orange-200">
                  {routing.channel}
                </span>
              </div>
              <div>
                <span className="text-orange-700 dark:text-orange-300">Prioridade:</span>
                <span className="ml-2 font-semibold text-orange-800 dark:text-orange-200 capitalize">
                  {routing.priority}
                </span>
              </div>
            </div>
            {routing.tags && routing.tags.length > 0 && (
              <div className="mt-2">
                <span className="text-orange-700 dark:text-orange-300 text-sm">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {routing.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enriquecimento */}
        {enrichment && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-md">
            <h3 className="font-medium text-indigo-800 dark:text-indigo-200 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Enriquecimento de Contato
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-indigo-700 dark:text-indigo-300">VIP:</span>
                <span className="ml-2 font-semibold text-indigo-800 dark:text-indigo-200">
                  {enrichment.vipStatus ? 'Sim' : 'Não'}
                </span>
              </div>
            </div>
            {enrichment.suggestedTags && enrichment.suggestedTags.length > 0 && (
              <div className="mt-2">
                <span className="text-indigo-700 dark:text-indigo-300 text-sm">Tags Sugeridas:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {enrichment.suggestedTags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {enrichment.enrichedData && Object.keys(enrichment.enrichedData).length > 0 && (
              <div className="mt-2">
                <span className="text-indigo-700 dark:text-indigo-300 text-sm">Dados Enriquecidos:</span>
                <pre className="text-xs text-indigo-700 dark:text-indigo-300 mt-1 bg-indigo-100 dark:bg-indigo-900 p-2 rounded">
                  {JSON.stringify(enrichment.enrichedData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Informações da Conversa de Exemplo */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
          Conversa de Exemplo
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          {sampleConversation.messages.map((message: any, index: number) => (
            <div key={index} className="flex gap-2">
              <span className="font-medium">{message.sender.name}:</span>
              <span>{message.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 