import { useState, useCallback } from 'react';
import { langChainService } from '../services/langchain';

interface UseLangChainReturn {
  isLoading: boolean;
  error: string | null;
  response: string | null;
  suggestions: string[];
  generateResponse: (prompt: string, systemPrompt?: string, modelType?: "openai" | "anthropic" | "google" | "cohere") => Promise<void>;
  analyzeConversation: (conversation: any, modelType?: "openai" | "anthropic" | "google" | "cohere") => Promise<void>;
  generateSuggestions: (conversation: any, modelType?: "openai" | "anthropic" | "google" | "cohere") => Promise<void>;
  clearResponse: () => void;
  clearError: () => void;
}

export const useLangChain = (): UseLangChainReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generateResponse = useCallback(async (
    prompt: string, 
    systemPrompt?: string, 
    modelType: "openai" | "anthropic" | "google" | "cohere" = "openai"
  ) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      let result: string;
      
      switch (modelType) {
        case "openai":
          result = await langChainService.generateOpenAIResponse(prompt, systemPrompt);
          break;
        case "anthropic":
          result = await langChainService.generateAnthropicResponse(prompt, systemPrompt);
          break;
        default:
          result = await langChainService.generateOpenAIResponse(prompt, systemPrompt);
      }

      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao gerar resposta');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeConversation = useCallback(async (
    conversation: any, 
    modelType: "openai" | "anthropic" | "google" | "cohere" = "openai"
  ) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await langChainService.processChatwootConversation(conversation, modelType);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar conversa');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateSuggestions = useCallback(async (
    conversation: any, 
    modelType: "openai" | "anthropic" | "google" | "cohere" = "openai"
  ) => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const result = await langChainService.generateResponseSuggestions(conversation, modelType);
      setSuggestions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar sugestões');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResponse = useCallback(() => {
    setResponse(null);
    setSuggestions([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    response,
    suggestions,
    generateResponse,
    analyzeConversation,
    generateSuggestions,
    clearResponse,
    clearError,
  };
}; 