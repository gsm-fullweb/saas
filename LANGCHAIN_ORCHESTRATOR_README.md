# 🧠 LangChain Orchestrator - O Cérebro das Automações

Este é o **orquestrador principal** do LangChain que funciona como o "cérebro" das automações do seu SaaS de atendimento multi-canal com Chatwoot.

## 🎯 **Como Funciona na Prática**

### **1. Arquitetura Implementada**

```
[Frontend (React/Appsmith)]
            ⇅
    [Proxy Chatwoot (PHP)]
            ⇅
[LangChain Orchestrator] ←→ [n8n, IA, Supabase, APIs externas]
            ⇅
       [Automações Inteligentes]
```

### **2. Fluxo de Eventos**

1. **Evento chega** (nova conversa, mensagem, mudança de status)
2. **LangChain analisa** o contexto usando IA
3. **Decide ações** baseado na inteligência artificial
4. **Executa automaticamente** via proxy do Chatwoot
5. **Integra com n8n** para automações complexas

## 🚀 **Funcionalidades Implementadas**

### **✅ 1. Lead Scoring Automático**
- Analisa conversas e classifica leads como "quente/morno/frio"
- Score de 0-100 com confiança da análise
- Tags automáticas baseadas na classificação

### **✅ 2. Resposta Automática Inteligente**
- Gera respostas contextuais usando IA
- Decide se deve responder ou escalar para humano
- Considera histórico do cliente e tom apropriado

### **✅ 3. Roteamento Multicanal**
- Escolhe o melhor agente baseado em especialidade
- Define prioridade e canal de resposta
- Sugere tags para categorização

### **✅ 4. Enriquecimento de Contatos**
- Identifica clientes VIP automaticamente
- Sugere tags e informações adicionais
- Detecta oportunidades de negócio

### **✅ 5. Integração com n8n**
- Webhooks automáticos para automações complexas
- Triggers baseados em eventos específicos
- Payload estruturado para processamento

## 📁 **Arquivos Criados**

### **Core do Sistema**
- `src/services/langchainOrchestrator.ts` - Orquestrador principal
- `src/hooks/useLangChainOrchestrator.ts` - Hook React para uso
- `src/components/chatwoot/LangChainOrchestratorDemo.tsx` - Demo interativo

### **Monitoramento**
- `agent-proxy.js` - Agente de monitoramento dos endpoints
- `agent-proxy.config.js` - Configuração do agente
- `scripts/start-agent.js` - Script de inicialização

### **Documentação**
- `LANGCHAIN_ORCHESTRATOR_README.md` - Esta documentação
- `AGENT_PROXY_README.md` - Documentação do agente
- `LANGCHAIN_SETUP.md` - Configuração do LangChain

## 🔧 **Como Usar**

### **1. Configuração Inicial**

```bash
# Instalar dependências
npm install

# Configurar chaves de API no .env
REACT_APP_OPENAI_API_KEY=your_key_here

# Iniciar agente de monitoramento
npm run proxy-monitor:dev
```

### **2. Usar o Orquestrador**

```typescript
import { useLangChainOrchestrator } from '../hooks/useLangChainOrchestrator';

const { processEvent, performLeadScoring, generateAutoReply } = useLangChainOrchestrator();

// Processar evento completo
await processEvent({
  type: 'conversation_created',
  data: { conversation, contact, availableAgents },
  timestamp: new Date().toISOString()
});

// Lead scoring específico
await performLeadScoring(conversation);

// Resposta automática
await generateAutoReply(conversation, context);
```

### **3. Componente de Demo**

```typescript
import { LangChainOrchestratorDemo } from '../components/chatwoot/LangChainOrchestratorDemo';

<LangChainOrchestratorDemo 
  conversation={selectedConversation}
  agents={availableAgents}
/>
```

## 🎮 **Exemplos de Uso**

### **Exemplo 1: Nova Conversa**
```typescript
const event = {
  type: 'conversation_created',
  data: {
    conversation: {
      id: 123,
      messages: [
        {
          content: "Preciso de ajuda urgente com meu pedido",
          sender: { name: "João Silva" }
        }
      ]
    },
    contact: { id: 1, name: "João Silva" },
    availableAgents: [
      { id: 1, name: "Maria", specialties: ["Suporte"] },
      { id: 2, name: "Pedro", specialties: ["Urgências"] }
    ]
  }
};

const actions = await langChainOrchestrator.processEvent(event);
// Resultado: Lead scoring, roteamento, resposta automática
```

### **Exemplo 2: Mensagem Urgente**
```typescript
const event = {
  type: 'message_created',
  data: {
    conversation: conversationData,
    message: {
      content: "URGENTE: Pedido atrasado há 3 dias!"
    }
  }
};

const actions = await langChainOrchestrator.processEvent(event);
// Resultado: Webhook para n8n, prioridade alta, agente técnico
```

## 🔄 **Tipos de Eventos Suportados**

| Evento | Descrição | Ações Automáticas |
|--------|-----------|-------------------|
| `conversation_created` | Nova conversa criada | Lead scoring, roteamento, resposta automática |
| `message_created` | Nova mensagem recebida | Atualização de scoring, resposta se apropriado |
| `conversation_status_changed` | Status da conversa alterado | Webhooks para n8n, notificações |
| `agent_assigned` | Agente atribuído | Notificação ao agente, contexto do lead |

## 🤖 **Ações Automáticas**

### **Auto Reply**
- Resposta automática contextual
- Decisão inteligente sobre escalação
- Tom apropriado baseado no cliente

### **Agent Assignment**
- Escolha do melhor agente
- Baseado em especialidade e disponibilidade
- Considera histórico e urgência

### **Tag Management**
- Tags automáticas baseadas em IA
- Categorização inteligente
- Priorização automática

### **Webhook Triggers**
- Integração com n8n
- Payload estruturado
- Triggers contextuais

### **Contact Enrichment**
- Identificação de VIPs
- Sugestões de tags
- Oportunidades de negócio

## 📊 **Métricas e Monitoramento**

### **Agente de Monitoramento**
- Verifica endpoints do proxy a cada 5 minutos
- Logs detalhados com rotação automática
- Métricas de performance e uptime
- Alertas via webhook para n8n

### **Métricas Coletadas**
- Tempo de resposta dos endpoints
- Taxa de sucesso vs falhas
- Distribuição de códigos HTTP
- Uptime do sistema

## 🔒 **Segurança**

- **Rate Limiting**: Proteção contra sobrecarga
- **Headers Seguros**: User-Agent personalizado
- **Timeout**: Proteção contra requisições pendentes
- **Logs Seguros**: Sem exposição de dados sensíveis

## 🚀 **Deploy e Produção**

### **Scripts Disponíveis**
```bash
# Desenvolvimento
npm run proxy-monitor:dev

# Produção
npm run proxy-monitor:prod

# Execução direta
npm run proxy-monitor
```

### **PM2 (Recomendado)**
```bash
# Instalar PM2
npm install -g pm2

# Iniciar com PM2
pm2 start agent-proxy.js --name "langchain-orchestrator"

# Monitorar
pm2 monit

# Logs
pm2 logs langchain-orchestrator
```

## 🎯 **Casos de Uso Reais**

### **1. Lead Scoring Automático**
```
Cliente: "Preciso de uma solução para minha empresa"
→ LangChain analisa: Intenção de compra alta
→ Score: 85/100, Categoria: "Quente"
→ Tags: ["lead-quente", "score-85", "empresa"]
→ Atribui agente de vendas
```

### **2. Resposta Automática Inteligente**
```
Cliente: "Qual o status do meu pedido #12345?"
→ LangChain gera: "Olá! Vou verificar o status do seu pedido #12345. Um momento..."
→ Envia resposta automática
→ Consulta banco de dados via n8n
→ Resposta final com status real
```

### **3. Roteamento Multicanal**
```
Cliente: "Problema técnico urgente no sistema"
→ LangChain analisa: Urgência alta, problema técnico
→ Escolhe agente técnico especializado
→ Prioridade: "high"
→ Canal: "whatsapp" (mais rápido)
→ Tags: ["urgente", "técnico", "sistema"]
```

### **4. Enriquecimento de Contato**
```
Cliente: "Sou CEO da empresa XYZ"
→ LangChain identifica: Cliente VIP potencial
→ Marca como VIP
→ Sugere tags: ["ceo", "empresa-xyz", "vip"]
→ Oportunidade: "Alta prioridade para vendas"
```

## 🔧 **Configuração Avançada**

### **Personalização de Prompts**
```typescript
// No langchainOrchestrator.ts
const systemPrompt = `Você é um especialista em [sua área específica]...`;
```

### **Integração com n8n**
```typescript
// Webhooks configuráveis
const webhookUrl = 'https://n8n-n8n.n1n956.easypanel.host/webhook-test/your-workflow';
```

### **Múltiplos Modelos de IA**
```typescript
// Suporte a OpenAI, Anthropic, Google, Cohere
const model = new ChatOpenAI({ modelName: "gpt-4" });
```

## 📈 **Próximos Passos**

1. **Configure suas chaves de API** no `.env`
2. **Teste o orquestrador** com o componente demo
3. **Integre no seu fluxo** de trabalho do Chatwoot
4. **Personalize os prompts** para seu negócio
5. **Configure webhooks** no n8n
6. **Monitore métricas** e performance

## 🎉 **Resultado Final**

Com esta implementação, você tem:

- ✅ **Automação inteligente** de todo o fluxo de atendimento
- ✅ **Lead scoring automático** com IA
- ✅ **Roteamento multicanal** inteligente
- ✅ **Respostas automáticas** contextuais
- ✅ **Integração completa** com Chatwoot via proxy
- ✅ **Monitoramento robusto** dos endpoints
- ✅ **Escalabilidade** para crescimento do negócio

**O LangChain Orchestrator é agora o cérebro das suas automações! 🧠✨** 