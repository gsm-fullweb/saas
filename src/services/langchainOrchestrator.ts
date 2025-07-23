import { langChainService } from './langchain';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Tipos para os eventos do Chatwoot
interface ChatwootEvent {
  type: 'conversation_created' | 'message_created' | 'conversation_status_changed' | 'agent_assigned';
  data: any;
  timestamp: string;
}

interface LeadScore {
  score: number; // 0-100
  category: 'quente' | 'morno' | 'frio';
  confidence: number;
  reasoning: string;
}

interface AutomationAction {
  type: 'auto_reply' | 'assign_agent' | 'add_tag' | 'update_status' | 'trigger_webhook' | 'enrich_contact';
  data: any;
  priority: 'high' | 'medium' | 'low';
}

export class LangChainOrchestrator {
  private openaiModel: ChatOpenAI | null = null;

  constructor() {
    this.initializeModel();
  }

  private initializeModel() {
    // Verificar se estamos no ambiente do navegador
    const apiKey = typeof window !== 'undefined' 
      ? import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.REACT_APP_OPENAI_API_KEY
      : process.env.REACT_APP_OPENAI_API_KEY;
    
    if (apiKey && apiKey !== 'your_openai_api_key_here') {
      this.openaiModel = new ChatOpenAI({
        openAIApiKey: apiKey,
        modelName: "gpt-4",
        temperature: 0.3,
      });
      console.log('✅ OpenAI model initialized successfully');
    } else {
      console.warn('⚠️ OpenAI API key não encontrada. LangChain funcionará em modo limitado.');
      console.log('💡 Para habilitar funcionalidades de IA, configure VITE_OPENAI_API_KEY no arquivo .env');
    }
  }

  // Método principal que orquestra todos os eventos
  async processEvent(event: ChatwootEvent): Promise<AutomationAction[]> {
    console.log(`🤖 LangChain processando evento: ${event.type}`);

    // Verificar se o modelo está disponível
    if (!this.openaiModel) {
      console.warn('⚠️ OpenAI model não disponível. Executando lógica básica sem IA.');
      return this.handleEventWithoutAI(event);
    }

    try {
      switch (event.type) {
        case 'conversation_created':
          return await this.handleNewConversation(event.data);
        
        case 'message_created':
          return await this.handleNewMessage(event.data);
        
        case 'conversation_status_changed':
          return await this.handleStatusChange(event.data);
        
        case 'agent_assigned':
          return await this.handleAgentAssignment(event.data);
        
        default:
          console.warn(`⚠️ Tipo de evento não reconhecido: ${event.type}`);
          return [];
      }
    } catch (error) {
      console.error('❌ Erro no processamento do LangChain:', error);
      console.log('🔄 Executando fallback sem IA...');
      return this.handleEventWithoutAI(event);
    }
  }

  // Fallback para quando a IA não está disponível
  private handleEventWithoutAI(event: ChatwootEvent): AutomationAction[] {
    console.log('🔄 Executando lógica básica sem IA para evento:', event.type);
    
    const actions: AutomationAction[] = [];

    switch (event.type) {
      case 'conversation_created':
        // Lógica básica para novas conversas
        actions.push({
          type: 'add_tag',
          data: { tags: ['nova-conversa', 'sem-ia'] },
          priority: 'medium'
        });
        break;
      
      case 'message_created':
        // Lógica básica para novas mensagens
        if (event.data.message?.content?.toLowerCase().includes('urgente')) {
          actions.push({
            type: 'trigger_webhook',
            data: { 
              url: 'https://n8n-n8n.n1n956.easypanel.host/webhook-test/urgent-message',
              payload: { conversation: event.data.conversation, message: event.data.message }
            },
            priority: 'high'
          });
        }
        break;
      
      case 'conversation_status_changed':
        // Lógica básica para mudança de status
        if (event.data.newStatus === 'resolved') {
          actions.push({
            type: 'trigger_webhook',
            data: {
              url: 'https://n8n-n8n.n1n956.easypanel.host/webhook-test/conversation-resolved',
              payload: { conversation: event.data.conversation }
            },
            priority: 'medium'
          });
        }
        break;
      
      case 'agent_assigned':
        // Lógica básica para atribuição de agente
        actions.push({
          type: 'trigger_webhook',
          data: {
            url: 'https://n8n-n8n.n1n956.easypanel.host/webhook-test/agent-notification',
            payload: { 
              agentId: event.data.agentId, 
              conversation: event.data.conversation
            }
          },
          priority: 'high'
        });
        break;
    }

    return actions;
  }

  // 1. LEAD SCORING AUTOMÁTICO
  async performLeadScoring(conversation: any): Promise<LeadScore> {
    // Verificar se o modelo está disponível
    if (!this.openaiModel) {
      console.warn('⚠️ OpenAI model não disponível. Usando lead scoring básico.');
      return this.performBasicLeadScoring(conversation);
    }

    const systemPrompt = `Você é um especialista em análise de leads e qualificação de prospects.
    
    Analise a conversa fornecida e classifique o lead com base nos seguintes critérios:
    - Urgência da necessidade
    - Intenção de compra
    - Valor potencial do cliente
    - Qualidade do contato
    
    Retorne um JSON com:
    - score: número de 0 a 100
    - category: "quente", "morno" ou "frio"
    - confidence: confiança da análise (0-1)
    - reasoning: explicação da classificação`;

    const conversationText = this.formatConversationForAnalysis(conversation);
    const prompt = `Analise esta conversa para lead scoring:\n\n${conversationText}`;

    try {
      const response = await this.openaiModel.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(prompt)
      ]);

      // Validar se a resposta existe e tem conteúdo
      if (!response?.content) {
        console.warn('⚠️ OpenAI response is empty or undefined for lead scoring');
        return this.performBasicLeadScoring(conversation);
      }

      // Tentar fazer o parse do JSON
      let result;
      try {
        result = JSON.parse(response.content as string);
      } catch (parseError) {
        console.warn('⚠️ Failed to parse OpenAI response as JSON for lead scoring:', response.content);
        return this.performBasicLeadScoring(conversation);
      }

      return result as LeadScore;
    } catch (error) {
      console.error('Erro no lead scoring com IA:', error);
      console.log('🔄 Usando lead scoring básico...');
      return this.performBasicLeadScoring(conversation);
    }
  }

  // Lead scoring básico sem IA
  private performBasicLeadScoring(conversation: any): LeadScore {
    const messages = conversation.messages || [];
    const content = messages.map((m: any) => m.content || '').join(' ').toLowerCase();
    
    let score = 50;
    let category: 'quente' | 'morno' | 'frio' = 'morno';
    let reasoning = 'Análise básica baseada em palavras-chave';

    // Análise básica baseada em palavras-chave
    if (content.includes('urgente') || content.includes('emergência') || content.includes('problema')) {
      score = 80;
      category = 'quente';
      reasoning = 'Cliente expressou urgência ou problema';
    } else if (content.includes('preço') || content.includes('valor') || content.includes('quanto')) {
      score = 70;
      category = 'quente';
      reasoning = 'Cliente interessado em preços/valores';
    } else if (content.includes('informação') || content.includes('dúvida') || content.includes('pergunta')) {
      score = 60;
      category = 'morno';
      reasoning = 'Cliente buscando informações';
    } else if (content.includes('obrigado') || content.includes('valeu')) {
      score = 30;
      category = 'frio';
      reasoning = 'Cliente apenas agradecendo';
    }

    return {
      score,
      category,
      confidence: 0.6,
      reasoning
    };
  }

  // 2. RESPOSTA AUTOMÁTICA INTELIGENTE
  async generateAutoReply(conversation: any, context?: any): Promise<string | null> {
    // Verificar se o modelo está disponível
    if (!this.openaiModel) {
      console.warn('⚠️ OpenAI model não disponível para auto reply');
      return null;
    }

    const systemPrompt = `Você é um assistente de suporte ao cliente especializado em respostas automáticas.
    
    Gere uma resposta automática baseada no contexto da conversa. Considere:
    - Histórico do cliente
    - Tipo de problema/pergunta
    - Tom apropriado (formal/informal)
    - Se deve ser uma resposta completa ou apenas um reconhecimento
    
    Se a situação requer intervenção humana, retorne null.
    
    Seja profissional, cordial e útil.`;

    const conversationText = this.formatConversationForAnalysis(conversation);
    const contextInfo = context ? `\nContexto adicional: ${JSON.stringify(context)}` : '';
    const prompt = `Analise esta conversa e gere uma resposta automática se apropriado:\n\n${conversationText}${contextInfo}`;

    try {
      const response = await this.openaiModel.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(prompt)
      ]);

      // Validar se a resposta existe e tem conteúdo
      if (!response?.content) {
        console.warn('⚠️ OpenAI response is empty or undefined for auto reply');
        return null;
      }

      const reply = response.content as string;
      
      // Verifica se a resposta indica necessidade de intervenção humana
      if (reply.toLowerCase().includes('intervenção humana') || 
          reply.toLowerCase().includes('agente humano') ||
          reply.toLowerCase().includes('null')) {
        return null;
      }

      return reply;
    } catch (error) {
      console.error('Erro ao gerar resposta automática:', error);
      return null;
    }
  }

  // 3. ROTEAMENTO MULTICANAL
  async determineRouting(conversation: any, availableAgents: any[]): Promise<{
    agentId?: number;
    channel: string;
    priority: 'high' | 'medium' | 'low';
    tags: string[];
  }> {
    // Verificar se o modelo está disponível
    if (!this.openaiModel) {
      console.warn('⚠️ OpenAI model não disponível para routing');
      return {
        channel: 'web',
        priority: 'medium',
        tags: ['roteamento-automático']
      };
    }

    const systemPrompt = `Você é um especialista em roteamento de atendimento ao cliente.
    
    Analise a conversa e determine:
    1. Qual agente deve atender (baseado em especialidade, disponibilidade, histórico)
    2. Canal preferencial para resposta
    3. Prioridade da conversa
    4. Tags relevantes para categorização
    
    Considere:
    - Tipo de problema/pergunta
    - Histórico do cliente
    - Especialidades dos agentes
    - Urgência da situação`;

    const conversationText = this.formatConversationForAnalysis(conversation);
    const agentsInfo = availableAgents.map(agent => 
      `ID: ${agent.id}, Nome: ${agent.name}, Especialidades: ${agent.specialties?.join(', ') || 'N/A'}`
    ).join('\n');

    const prompt = `Analise esta conversa para roteamento:\n\n${conversationText}\n\nAgentes disponíveis:\n${agentsInfo}`;

    try {
      const response = await this.openaiModel.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(prompt)
      ]);

      // Validar se a resposta existe e tem conteúdo
      if (!response?.content) {
        console.warn('⚠️ OpenAI response is empty or undefined for routing');
        return {
          channel: 'web',
          priority: 'medium',
          tags: ['roteamento-automático']
        };
      }

      // Tentar fazer o parse do JSON
      let result;
      try {
        result = JSON.parse(response.content as string);
      } catch (parseError) {
        console.warn('⚠️ Failed to parse OpenAI response as JSON for routing:', response.content);
        return {
          channel: 'web',
          priority: 'medium',
          tags: ['roteamento-automático']
        };
      }

      return result;
    } catch (error) {
      console.error('Erro no roteamento:', error);
      return {
        channel: 'web',
        priority: 'medium',
        tags: ['roteamento-automático']
      };
    }
  }

  // 4. ENRICHMENT AUTOMÁTICO DE CONTATO
  async enrichContact(contact: any, conversation: any): Promise<{
    enrichedData: any;
    suggestedTags: string[];
    vipStatus: boolean;
  }> {
    // Verificar se o modelo está disponível
    if (!this.openaiModel) {
      console.warn('⚠️ OpenAI model não disponível para enrichment');
      return {
        enrichedData: {},
        suggestedTags: ['enrichment-disabled'],
        vipStatus: false
      };
    }

    const systemPrompt = `Você é um especialista em enriquecimento de dados de contatos.
    
    Analise o contato e a conversa para:
    1. Identificar informações adicionais sobre o cliente
    2. Sugerir tags relevantes
    3. Determinar se é um cliente VIP
    4. Identificar oportunidades de negócio
    
    Seja preciso e baseado apenas nas informações disponíveis.`;

    const contactInfo = `Contato: ${JSON.stringify(contact)}`;
    const conversationText = this.formatConversationForAnalysis(conversation);
    const prompt = `Enriqueça os dados deste contato:\n\n${contactInfo}\n\nConversa:\n${conversationText}`;

    try {
      const response = await this.openaiModel.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(prompt)
      ]);

      // Validar se a resposta existe e tem conteúdo
      if (!response?.content) {
        console.warn('⚠️ OpenAI response is empty or undefined');
        return {
          enrichedData: {},
          suggestedTags: ['enrichment-error'],
          vipStatus: false
        };
      }

      // Tentar fazer o parse do JSON
      let result;
      try {
        result = JSON.parse(response.content as string);
      } catch (parseError) {
        console.warn('⚠️ Failed to parse OpenAI response as JSON:', response.content);
        // Se não conseguir fazer parse, retornar dados padrão
        return {
          enrichedData: {},
          suggestedTags: ['enrichment-error'],
          vipStatus: false
        };
      }

      return result;
    } catch (error) {
      console.error('Erro no enrichment:', error);
      return {
        enrichedData: {},
        suggestedTags: ['enrichment-error'],
        vipStatus: false
      };
    }
  }

  // Handlers específicos para cada tipo de evento
  private async handleNewConversation(data: any): Promise<AutomationAction[]> {
    const actions: AutomationAction[] = [];

    // 1. Lead Scoring
    const leadScore = await this.performLeadScoring(data.conversation);
    actions.push({
      type: 'add_tag',
      data: { tags: [`lead-${leadScore.category}`, `score-${leadScore.score}`] },
      priority: 'high'
    });

    // 2. Enrichment do contato
    const enrichment = await this.enrichContact(data.contact, data.conversation);
    actions.push({
      type: 'enrich_contact',
      data: enrichment,
      priority: 'medium'
    });

    // 3. Roteamento
    const routing = await this.determineRouting(data.conversation, data.availableAgents || []);
    if (routing.agentId) {
      actions.push({
        type: 'assign_agent',
        data: { agentId: routing.agentId },
        priority: 'high'
      });
    }

    // 4. Resposta automática se apropriado
    const autoReply = await this.generateAutoReply(data.conversation);
    if (autoReply) {
      actions.push({
        type: 'auto_reply',
        data: { message: autoReply },
        priority: 'medium'
      });
    }

    return actions;
  }

  private async handleNewMessage(data: any): Promise<AutomationAction[]> {
    const actions: AutomationAction[] = [];

    // 1. Atualizar lead scoring se necessário
    if (data.conversation.messages.length > 3) {
      const leadScore = await this.performLeadScoring(data.conversation);
      actions.push({
        type: 'add_tag',
        data: { tags: [`lead-${leadScore.category}`, `score-${leadScore.score}`] },
        priority: 'medium'
      });
    }

    // 2. Verificar se precisa de resposta automática
    const autoReply = await this.generateAutoReply(data.conversation);
    if (autoReply) {
      actions.push({
        type: 'auto_reply',
        data: { message: autoReply },
        priority: 'medium'
      });
    }

    // 3. Trigger webhook para n8n se necessário
    if (data.message.content.toLowerCase().includes('urgente') || 
        data.message.content.toLowerCase().includes('emergência')) {
      actions.push({
        type: 'trigger_webhook',
        data: { 
          url: 'https://n8n-n8n.n1n956.easypanel.host/webhook-test/urgent-message',
          payload: { conversation: data.conversation, message: data.message }
        },
        priority: 'high'
      });
    }

    return actions;
  }

  private async handleStatusChange(data: any): Promise<AutomationAction[]> {
    const actions: AutomationAction[] = [];

    // Lógica baseada na mudança de status
    if (data.newStatus === 'resolved') {
      actions.push({
        type: 'trigger_webhook',
        data: {
          url: 'https://n8n-n8n.n1n956.easypanel.host/webhook-test/conversation-resolved',
          payload: { conversation: data.conversation }
        },
        priority: 'medium'
      });
    }

    return actions;
  }

  private async handleAgentAssignment(data: any): Promise<AutomationAction[]> {
    const actions: AutomationAction[] = [];

    // Notificar o agente sobre o novo lead
    actions.push({
      type: 'trigger_webhook',
      data: {
        url: 'https://n8n-n8n.n1n956.easypanel.host/webhook-test/agent-notification',
        payload: { 
          agentId: data.agentId, 
          conversation: data.conversation,
          leadScore: await this.performLeadScoring(data.conversation)
        }
      },
      priority: 'high'
    });

    return actions;
  }

  // Utilitário para formatar conversas para análise
  private formatConversationForAnalysis(conversation: any): string {
    if (!conversation.messages || !Array.isArray(conversation.messages)) {
      return "Conversa vazia ou formato inválido";
    }

    return conversation.messages
      .map((message: any) => {
        const sender = message.sender?.name || message.sender?.email || "Desconhecido";
        const content = message.content || "";
        const timestamp = message.created_at ? new Date(message.created_at).toLocaleString() : "";
        return `[${timestamp}] ${sender}: ${content}`;
      })
      .join("\n");
  }

  // Método para executar as ações
  async executeActions(actions: AutomationAction[]): Promise<void> {
    console.log(`🚀 Executando ${actions.length} ações automáticas...`);

    for (const action of actions) {
      try {
        await this.executeAction(action);
      } catch (error) {
        console.error(`❌ Erro ao executar ação ${action.type}:`, error);
      }
    }
  }

  private async executeAction(action: AutomationAction): Promise<void> {
    console.log(`⚡ Executando ação: ${action.type}`);

    switch (action.type) {
      case 'auto_reply':
        await this.sendAutoReply(action.data);
        break;
      
      case 'assign_agent':
        await this.assignAgent(action.data);
        break;
      
      case 'add_tag':
        await this.addTags(action.data);
        break;
      
      case 'update_status':
        await this.updateStatus(action.data);
        break;
      
      case 'trigger_webhook':
        await this.triggerWebhook(action.data);
        break;
      
      case 'enrich_contact':
        await this.enrichContactData(action.data);
        break;
      
      default:
        console.warn(`⚠️ Tipo de ação não implementado: ${action.type}`);
    }
  }

  // Implementações das ações (simulação para desenvolvimento)
  private async sendAutoReply(data: any): Promise<void> {
    console.log('🤖 [SIMULAÇÃO] Enviando resposta automática:', {
      conversationId: data.conversationId,
      message: data.message
    });
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('✅ [SIMULAÇÃO] Resposta automática enviada com sucesso');
  }

  private async assignAgent(data: any): Promise<void> {
    console.log('🤖 [SIMULAÇÃO] Atribuindo agente:', {
      conversationId: data.conversationId,
      agentId: data.agentId
    });
    
    // Simular delay de atribuição
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('✅ [SIMULAÇÃO] Agente atribuído com sucesso');
  }

  private async addTags(data: any): Promise<void> {
    console.log('🤖 [SIMULAÇÃO] Adicionando tags:', {
      conversationId: data.conversationId,
      tags: data.tags
    });
    
    // Simular delay de adição de tags
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('✅ [SIMULAÇÃO] Tags adicionadas com sucesso');
  }

  private async updateStatus(data: any): Promise<void> {
    console.log('🤖 [SIMULAÇÃO] Atualizando status:', {
      conversationId: data.conversationId,
      status: data.status
    });
    
    // Simular delay de atualização
    await new Promise(resolve => setTimeout(resolve, 250));
    
    console.log('✅ [SIMULAÇÃO] Status atualizado com sucesso');
  }

  private async triggerWebhook(data: any): Promise<void> {
    console.log('🤖 [SIMULAÇÃO] Triggering webhook:', {
      url: data.url,
      payload: data.payload
    });
    
    try {
      // Tentar fazer a requisição real para webhooks (geralmente não tem CORS)
      const response = await fetch(data.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.payload)
      });

      if (response.ok) {
        console.log('✅ Webhook enviado com sucesso para:', data.url);
      } else {
        console.warn('⚠️ Webhook falhou, mas continuando simulação:', response.status);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao enviar webhook, mas continuando simulação:', error);
    }
    
    // Simular delay de webhook
    await new Promise(resolve => setTimeout(resolve, 400));
    
    console.log('✅ [SIMULAÇÃO] Webhook processado');
  }

  private async enrichContactData(data: any): Promise<void> {
    console.log('🤖 [SIMULAÇÃO] Enriquecendo dados do contato:', {
      contactId: data.contactId,
      enrichedData: data.enrichedData
    });
    
    // Simular delay de enriquecimento
    await new Promise(resolve => setTimeout(resolve, 350));
    
    console.log('✅ [SIMULAÇÃO] Contato enriquecido com sucesso');
  }
}

// Instância singleton do orquestrador
export const langChainOrchestrator = new LangChainOrchestrator(); 