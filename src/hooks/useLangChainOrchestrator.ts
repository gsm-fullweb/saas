import { useState, useCallback } from 'react';
import { langChainOrchestrator } from '../services/langchainOrchestrator';

interface UseLangChainOrchestratorReturn {
  isLoading: boolean;
  error: string | null;
  lastAction: string | null;
  leadScore: any | null;
  autoReply: string | null;
  routing: any | null;
  enrichment: any | null;
  
  // Métodos principais
  processEvent: (event: any) => Promise<void>;
  performLeadScoring: (conversation: any) => Promise<void>;
  generateAutoReply: (conversation: any, context?: any) => Promise<void>;
  determineRouting: (conversation: any, agents: any[]) => Promise<void>;
  enrichContact: (contact: any, conversation: any) => Promise<void>;
  
  // Utilitários
  clearResults: () => void;
  clearError: () => void;
}

export const useLangChainOrchestrator = (): UseLangChainOrchestratorReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [leadScore, setLeadScore] = useState<any | null>(null);
  const [autoReply, setAutoReply] = useState<string | null>(null);
  const [routing, setRouting] = useState<any | null>(null);
  const [enrichment, setEnrichment] = useState<any | null>(null);

  const processEvent = useCallback(async (event: any) => {
    setIsLoading(true);
    setError(null);
    setLastAction(`Processando evento: ${event.type}`);

    try {
      const actions = await langChainOrchestrator.processEvent(event);
      
      // Executa as ações automaticamente
      await langChainOrchestrator.executeActions(actions);
      
      setLastAction(`Evento processado com ${actions.length} ações executadas`);
      
      // Atualiza resultados baseado no tipo de evento
      if (event.type === 'conversation_created') {
        // Para novas conversas, faz lead scoring automaticamente
        const score = await langChainOrchestrator.performLeadScoring(event.data.conversation);
        setLeadScore(score);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao processar evento');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const performLeadScoring = useCallback(async (conversation: any) => {
    setIsLoading(true);
    setError(null);
    setLastAction('Realizando lead scoring...');

    try {
      const score = await langChainOrchestrator.performLeadScoring(conversation);
      setLeadScore(score);
      setLastAction('Lead scoring concluído');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao realizar lead scoring');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateAutoReply = useCallback(async (conversation: any, context?: any) => {
    setIsLoading(true);
    setError(null);
    setLastAction('Gerando resposta automática...');

    try {
      const reply = await langChainOrchestrator.generateAutoReply(conversation, context);
      setAutoReply(reply);
      setLastAction(reply ? 'Resposta automática gerada' : 'Resposta automática não apropriada');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar resposta automática');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const determineRouting = useCallback(async (conversation: any, agents: any[]) => {
    setIsLoading(true);
    setError(null);
    setLastAction('Determinando roteamento...');

    try {
      const route = await langChainOrchestrator.determineRouting(conversation, agents);
      setRouting(route);
      setLastAction('Roteamento determinado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao determinar roteamento');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enrichContact = useCallback(async (contact: any, conversation: any) => {
    setIsLoading(true);
    setError(null);
    setLastAction('Enriquecendo dados do contato...');

    try {
      const enriched = await langChainOrchestrator.enrichContact(contact, conversation);
      setEnrichment(enriched);
      setLastAction('Contato enriquecido');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enriquecer contato');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setLastAction(null);
    setLeadScore(null);
    setAutoReply(null);
    setRouting(null);
    setEnrichment(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
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
  };
}; 