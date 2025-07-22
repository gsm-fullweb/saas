import { useState, useEffect, useCallback } from 'react';
import { langChainOrchestrator } from '../services/langchainOrchestrator';
import ChatwootAPI from '../services/chatwootApi';

// Tipos para os dados do Chatwoot
interface ChatwootConversation {
  id: number;
  status: 'open' | 'resolved' | 'pending' | 'snoozed';
  meta: {
    sender: any;
    assignee?: any;
    team?: any;
    channel: string;
  };
  messages: any[];
  labels: string[];
  unread_count: number;
  messages_count: number;
  created_at: number;
  updated_at: number;
  last_activity_at: number;
  assignee_id?: number;
  account_id: number;
  inbox_id: number;
}

interface ChatwootAgent {
  id: number;
  name: string;
  email: string;
  role: string;
  availability_status: 'online' | 'offline' | 'busy';
  thumbnail?: string;
  specialties?: string[];
}

interface ChatwootContact {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
  avatar_url?: string;
  identifier?: string;
  additional_attributes?: any;
  created_at: string;
  updated_at: string;
  blocked: boolean;
  last_activity_at: number;
}

interface ChatwootTeam {
  id: number;
  name: string;
  description: string;
  allow_auto_assign: boolean;
  account_id: number;
  is_member: boolean;
}

interface DashboardMetrics {
  open_conversations: number;
  resolved_conversations: number;
  pending_conversations: number;
  snoozed_conversations: number;
  agents_online: number;
  avg_response_time: number;
  conversations_without_reply: number;
  total_conversations_today: number;
  resolution_rate: number;
}

// Hook principal para gerenciar todos os dados do Chatwoot
export const useChatwootData = (accountId: number = 1) => {
  const [api] = useState(() => new ChatwootAPI(accountId));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Estados para os dados
  const [conversations, setConversations] = useState<ChatwootConversation[]>([]);
  const [agents, setAgents] = useState<ChatwootAgent[]>([]);
  const [contacts, setContacts] = useState<ChatwootContact[]>([]);
  const [teams, setTeams] = useState<ChatwootTeam[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    open_conversations: 0,
    resolved_conversations: 0,
    pending_conversations: 0,
    snoozed_conversations: 0,
    agents_online: 0,
    avg_response_time: 0,
    conversations_without_reply: 0,
    total_conversations_today: 0,
    resolution_rate: 0,
  });

  // Função para carregar todos os dados
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Loading all Chatwoot data from proxy...');

      // Carregar dados em paralelo
      const [conversationsData, agentsData, contactsData, teamsData] = await Promise.all([
        api.getConversations(),
        api.getAgents(),
        api.getContacts(),
        api.getTeams(),
      ]);

      // Processar conversas com LangChain
      const processedConversations = await processConversationsWithLangChain(conversationsData);
      
      // Atualizar estados
      setConversations(processedConversations);
      setAgents(agentsData);
      setContacts(contactsData);
      setTeams(teamsData);

      // Calcular métricas
      const calculatedMetrics = calculateMetrics(processedConversations, agentsData);
      setMetrics(calculatedMetrics);

      setLastUpdate(new Date());
      
      console.log('✅ All data loaded successfully:', {
        conversations: processedConversations.length,
        agents: agentsData.length,
        contacts: contactsData.length,
        teams: teamsData.length,
        metrics: calculatedMetrics,
        source: 'Real proxy data + LangChain processing'
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Processar conversas com LangChain
  const processConversationsWithLangChain = async (conversationsData: any[]): Promise<ChatwootConversation[]> => {
    const processedConversations: ChatwootConversation[] = [];

    for (const conversation of conversationsData) {
      try {
        // Apenas processar a conversa, sem executar ações automaticamente
        // As ações serão executadas apenas quando solicitadas pelo usuário
        console.log(`📝 Processando conversa #${conversation.id} para análise`);
        
        processedConversations.push(conversation);
      } catch (err) {
        console.warn(`⚠️ Failed to process conversation #${conversation.id}:`, err);
        processedConversations.push(conversation);
      }
    }

    return processedConversations;
  };

  // Calcular métricas
  const calculateMetrics = (conversations: ChatwootConversation[], agents: ChatwootAgent[]): DashboardMetrics => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const openConversations = conversations.filter(c => c.status === 'open').length;
    const resolvedConversations = conversations.filter(c => c.status === 'resolved').length;
    const pendingConversations = conversations.filter(c => c.status === 'pending').length;
    const snoozedConversations = conversations.filter(c => c.status === 'snoozed').length;
    
    const agentsOnline = agents.filter(a => a.availability_status === 'online').length;
    const conversationsWithoutReply = conversations.filter(c => c.unread_count > 0).length;
    
    const totalConversationsToday = conversations.filter(c => {
      const conversationDate = new Date(c.created_at * 1000);
      return conversationDate >= today;
    }).length;

    const resolutionRate = conversations.length > 0 
      ? Math.round((resolvedConversations / conversations.length) * 100)
      : 0;

    // Calcular tempo médio de resposta (simulado por enquanto)
    const avgResponseTime = 7; // minutos

    return {
      open_conversations: openConversations,
      resolved_conversations: resolvedConversations,
      pending_conversations: pendingConversations,
      snoozed_conversations: snoozedConversations,
      agents_online: agentsOnline,
      avg_response_time: avgResponseTime,
      conversations_without_reply: conversationsWithoutReply,
      total_conversations_today: totalConversationsToday,
      resolution_rate: resolutionRate,
    };
  };

  // Carregar dados na inicialização
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Função para atualizar dados manualmente
  const refreshData = useCallback(() => {
    loadAllData();
  }, [loadAllData]);

  // Função para processar nova mensagem com LangChain
  const processNewMessage = useCallback(async (conversationId: number, message: any) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const event = {
        type: 'message_created',
        data: {
          conversation,
          message,
          availableAgents: agents,
        },
        timestamp: new Date().toISOString()
      };

      const actions = await langChainOrchestrator.processEvent(event);
      if (actions.length > 0) {
        console.log(`🤖 LangChain processed new message with ${actions.length} actions`);
        await langChainOrchestrator.executeActions(actions);
        
        // Recarregar dados após processamento
        refreshData();
      }
    } catch (err) {
      console.error('❌ Error processing new message with LangChain:', err);
    }
  }, [conversations, agents, refreshData]);

  // Função para processar mudança de status com LangChain
  const processStatusChange = useCallback(async (conversationId: number, newStatus: string) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const event = {
        type: 'conversation_status_changed',
        data: {
          conversation,
          newStatus,
          availableAgents: agents,
        },
        timestamp: new Date().toISOString()
      };

      const actions = await langChainOrchestrator.processEvent(event);
      if (actions.length > 0) {
        console.log(`🤖 LangChain processed status change with ${actions.length} actions`);
        await langChainOrchestrator.executeActions(actions);
        
        // Recarregar dados após processamento
        refreshData();
      }
    } catch (err) {
      console.error('❌ Error processing status change with LangChain:', err);
    }
  }, [conversations, agents, refreshData]);

  // Função para processar atribuição de agente com LangChain
  const processAgentAssignment = useCallback(async (conversationId: number, agentId: number) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const event = {
        type: 'agent_assigned',
        data: {
          conversation,
          agentId,
          availableAgents: agents,
        },
        timestamp: new Date().toISOString()
      };

      const actions = await langChainOrchestrator.processEvent(event);
      if (actions.length > 0) {
        console.log(`🤖 LangChain processed agent assignment with ${actions.length} actions`);
        await langChainOrchestrator.executeActions(actions);
        
        // Recarregar dados após processamento
        refreshData();
      }
    } catch (err) {
      console.error('❌ Error processing agent assignment with LangChain:', err);
    }
  }, [conversations, agents, refreshData]);

  return {
    // Estados
    loading,
    error,
    lastUpdate,
    conversations,
    agents,
    contacts,
    teams,
    metrics,

    // Funções
    refreshData,
    processNewMessage,
    processStatusChange,
    processAgentAssignment,
    loadAllData,
  };
};

// Hook específico para conversas
export const useConversations = (accountId: number = 1) => {
  const { conversations, loading, error, refreshData, processNewMessage } = useChatwootData(accountId);

  const getConversationById = useCallback((id: number) => {
    return conversations.find(c => c.id === id);
  }, [conversations]);

  const getConversationsByStatus = useCallback((status: string) => {
    return conversations.filter(c => c.status === status);
  }, [conversations]);

  const getConversationsByAssignee = useCallback((assigneeId: number) => {
    return conversations.filter(c => c.assignee_id === assigneeId);
  }, [conversations]);

  return {
    conversations,
    loading,
    error,
    refreshData,
    processNewMessage,
    getConversationById,
    getConversationsByStatus,
    getConversationsByAssignee,
  };
};

// Hook específico para agentes
export const useAgents = (accountId: number = 1) => {
  const { agents, loading, error, refreshData } = useChatwootData(accountId);

  const getAgentById = useCallback((id: number) => {
    return agents.find(a => a.id === id);
  }, [agents]);

  const getOnlineAgents = useCallback(() => {
    return agents.filter(a => a.availability_status === 'online');
  }, [agents]);

  const getAgentsByRole = useCallback((role: string) => {
    return agents.filter(a => a.role === role);
  }, [agents]);

  return {
    agents,
    loading,
    error,
    refreshData,
    getAgentById,
    getOnlineAgents,
    getAgentsByRole,
  };
};

// Hook específico para contatos
export const useContacts = (accountId: number = 1) => {
  const { contacts, loading, error, refreshData } = useChatwootData(accountId);

  const getContactById = useCallback((id: number) => {
    return contacts.find(c => c.id === id);
  }, [contacts]);

  const searchContacts = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return contacts.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.email?.toLowerCase().includes(lowerQuery) ||
      c.phone_number?.includes(lowerQuery)
    );
  }, [contacts]);

  return {
    contacts,
    loading,
    error,
    refreshData,
    getContactById,
    searchContacts,
  };
};

// Hook específico para métricas
export const useMetrics = (accountId: number = 1) => {
  const { metrics, loading, error, refreshData } = useChatwootData(accountId);

  return {
    metrics,
    loading,
    error,
    refreshData,
  };
};

// Hook específico para times
export const useTeams = (accountId: number = 1) => {
  const { teams, loading, error, refreshData } = useChatwootData(accountId);

  const getTeamById = useCallback((id: number) => {
    return teams.find(t => t.id === id);
  }, [teams]);

  const getTeamsByMember = useCallback((memberId: number) => {
    // Esta lógica pode precisar ser ajustada baseada na estrutura real dos dados
    return teams.filter(t => t.is_member);
  }, [teams]);

  return {
    teams,
    loading,
    error,
    refreshData,
    getTeamById,
    getTeamsByMember,
  };
}; 