import React, { useState } from 'react';
import { useLangChain } from '../../hooks/useLangChain';
import { Bot, Sparkles, MessageSquare, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface AIAssistantProps {
  conversation?: any;
  onSuggestionSelect?: (suggestion: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  conversation, 
  onSuggestionSelect 
}) => {
  const [selectedModel, setSelectedModel] = useState<"openai" | "anthropic" | "google" | "cohere">("openai");
  const [customPrompt, setCustomPrompt] = useState("");
  
  const {
    isLoading,
    error,
    response,
    suggestions,
    generateResponse,
    analyzeConversation,
    generateSuggestions,
    clearResponse,
    clearError,
  } = useLangChain();

  const handleAnalyzeConversation = async () => {
    if (!conversation) {
      alert("Nenhuma conversa selecionada para análise");
      return;
    }
    await analyzeConversation(conversation, selectedModel);
  };

  const handleGenerateSuggestions = async () => {
    if (!conversation) {
      alert("Nenhuma conversa selecionada para gerar sugestões");
      return;
    }
    await generateSuggestions(conversation, selectedModel);
  };

  const handleCustomPrompt = async () => {
    if (!customPrompt.trim()) {
      alert("Digite um prompt personalizado");
      return;
    }
    await generateResponse(customPrompt, undefined, selectedModel);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Bot className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Assistente de IA
        </h2>
        <Sparkles className="w-5 h-5 text-yellow-500" />
      </div>

      {/* Seleção de Modelo */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Modelo de IA
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="openai">OpenAI GPT</option>
          <option value="anthropic">Anthropic Claude</option>
          <option value="google">Google Gemini</option>
          <option value="cohere">Cohere Command</option>
        </select>
      </div>

      {/* Ações Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleAnalyzeConversation}
          disabled={isLoading || !conversation}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MessageSquare className="w-4 h-4" />
          )}
          Analisar Conversa
        </button>

        <button
          onClick={handleGenerateSuggestions}
          disabled={isLoading || !conversation}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Gerar Sugestões
        </button>
      </div>

      {/* Prompt Personalizado */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Prompt Personalizado
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Digite seu prompt personalizado..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleCustomPrompt}
            disabled={isLoading || !customPrompt.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Enviar"
            )}
          </button>
        </div>
      </div>

      {/* Status e Erros */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-800 dark:text-red-200 text-sm">{error}</span>
            <button
              onClick={clearError}
              className="ml-auto text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Resposta da IA */}
      {response && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Análise da IA
            </h3>
            <button
              onClick={clearResponse}
              className="ml-auto text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {response}
            </p>
          </div>
        </div>
      )}

      {/* Sugestões */}
      {suggestions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sugestões de Resposta
          </h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status de Carregamento */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Processando...</span>
        </div>
      )}

      {/* Aviso sobre API Keys */}
      {!conversation && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Selecione uma conversa para usar o assistente de IA. Certifique-se de que as chaves de API estão configuradas no arquivo .env
          </p>
        </div>
      )}
    </div>
  );
}; 