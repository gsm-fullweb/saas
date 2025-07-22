import React, { useState } from 'react';
import { useLangChain } from '../hooks/useLangChain';
import { Bot, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const LangChainExample: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('Você é um assistente útil e amigável.');
  const [selectedModel, setSelectedModel] = useState<"openai" | "anthropic" | "google" | "cohere">("openai");

  const {
    isLoading,
    error,
    response,
    generateResponse,
    clearResponse,
    clearError,
  } = useLangChain();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    await generateResponse(prompt, systemPrompt, selectedModel);
  };

  const handleClear = () => {
    clearResponse();
    clearError();
    setPrompt('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Bot className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Exemplo LangChain
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Teste a integração do LangChain com diferentes modelos de IA
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configurações */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Configurações
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seleção de Modelo */}
            <div>
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

            {/* Prompt do Sistema */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prompt do Sistema
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Defina o comportamento do assistente..."
              />
            </div>

            {/* Prompt do Usuário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seu Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite sua pergunta ou solicitação..."
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Enviar
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Limpar
              </button>
            </div>
          </form>
        </div>

        {/* Resposta */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Resposta da IA
          </h2>

          <div className="space-y-4">
            {/* Status de Carregamento */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 py-8">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processando...</span>
              </div>
            )}

            {/* Erro */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-800 dark:text-red-200 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Resposta */}
            {response && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Resposta do {selectedModel.toUpperCase()}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {response}
                  </p>
                </div>
              </div>
            )}

            {/* Estado Inicial */}
            {!isLoading && !error && !response && (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Digite um prompt e clique em "Enviar" para começar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exemplos de Prompts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Exemplos de Prompts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Análise de Sentimento",
              prompt: "Analise o sentimento da seguinte mensagem: 'Estou muito frustrado com o serviço de vocês'",
              system: "Você é um especialista em análise de sentimento."
            },
            {
              title: "Geração de Código",
              prompt: "Crie uma função em JavaScript para validar um email",
              system: "Você é um programador experiente em JavaScript."
            },
            {
              title: "Tradução",
              prompt: "Traduza para inglês: 'Olá, como você está?'",
              system: "Você é um tradutor profissional."
            },
            {
              title: "Resumo",
              prompt: "Faça um resumo do seguinte texto: [cole seu texto aqui]",
              system: "Você é um especialista em resumos concisos."
            },
            {
              title: "Criatividade",
              prompt: "Escreva uma história curta sobre um gato que aprende a programar",
              system: "Você é um escritor criativo e divertido."
            },
            {
              title: "Análise de Dados",
              prompt: "Analise os seguintes dados: [cole seus dados aqui]",
              system: "Você é um analista de dados experiente."
            }
          ].map((example, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => {
                setPrompt(example.prompt);
                setSystemPrompt(example.system);
              }}
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {example.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {example.prompt}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Informações sobre Configuração */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          ⚠️ Configuração Necessária
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300 mb-4">
          Para usar este exemplo, você precisa configurar suas chaves de API no arquivo <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">.env</code>.
        </p>
        <div className="text-sm text-yellow-700 dark:text-yellow-300">
          <p>• <strong>OpenAI:</strong> REACT_APP_OPENAI_API_KEY</p>
          <p>• <strong>Anthropic:</strong> REACT_APP_ANTHROPIC_API_KEY</p>
          <p>• <strong>Google:</strong> REACT_APP_GOOGLE_API_KEY</p>
          <p>• <strong>Cohere:</strong> REACT_APP_COHERE_API_KEY</p>
        </div>
        <p className="text-yellow-700 dark:text-yellow-300 mt-4">
          Consulte o arquivo <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">LANGCHAIN_SETUP.md</code> para instruções detalhadas.
        </p>
      </div>
    </div>
  );
};

export default LangChainExample; 