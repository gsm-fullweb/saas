# Configuração do LangChain

Este projeto foi configurado com o LangChain para integração com modelos de IA. Siga as instruções abaixo para configurar as chaves de API necessárias.

## Instalação

O LangChain já foi instalado com as seguintes dependências:

```bash
npm install langchain @langchain/core @langchain/openai @langchain/community @langchain/anthropic @langchain/google-genai @langchain/cohere
```

## Configuração das Chaves de API

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# LangChain API Keys

# OpenAI API Key (obrigatório para usar GPT)
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API Key (opcional - para usar Claude)
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google AI API Key (opcional - para usar Gemini)
REACT_APP_GOOGLE_API_KEY=your_google_api_key_here

# Cohere API Key (opcional - para usar Command)
REACT_APP_COHERE_API_KEY=your_cohere_api_key_here

# Chatwoot Proxy Configuration
REACT_APP_CHATWOOT_PROXY_URL=https://api.chathook.com.br/api/chatwoot-proxy.php

# Outras configurações
REACT_APP_ENVIRONMENT=development
```

## Como Obter as Chaves de API

### OpenAI
1. Acesse [OpenAI Platform](https://platform.openai.com/)
2. Faça login ou crie uma conta
3. Vá para "API Keys" no menu lateral
4. Clique em "Create new secret key"
5. Copie a chave gerada

### Anthropic (Claude)
1. Acesse [Anthropic Console](https://console.anthropic.com/)
2. Faça login ou crie uma conta
3. Vá para "API Keys"
4. Clique em "Create Key"
5. Copie a chave gerada

### Google AI (Gemini)
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada

### Cohere
1. Acesse [Cohere Console](https://dashboard.cohere.com/)
2. Faça login ou crie uma conta
3. Vá para "API Keys"
4. Clique em "Generate API Key"
5. Copie a chave gerada

## Estrutura do Projeto

### Serviços
- `src/services/langchain.ts` - Serviço principal do LangChain com configurações dos modelos

### Hooks
- `src/hooks/useLangChain.ts` - Hook personalizado para gerenciar estado e operações do LangChain

### Componentes
- `src/components/chatwoot/AIAssistant.tsx` - Componente de assistente de IA integrado com Chatwoot

## Funcionalidades Disponíveis

### 1. Análise de Conversas
O assistente pode analisar conversas do Chatwoot e fornecer insights sobre:
- Sentimento do cliente
- Urgência do problema
- Sugestões de resposta
- Classificação do tipo de problema

### 2. Geração de Sugestões
Gera sugestões de resposta baseadas no contexto da conversa, sendo:
- Profissionais e cordiais
- Diretas ao ponto
- Úteis para resolver o problema

### 3. Prompts Personalizados
Permite enviar prompts personalizados para qualquer modelo configurado.

## Como Usar

### 1. Importar o Hook
```typescript
import { useLangChain } from '../hooks/useLangChain';
```

### 2. Usar no Componente
```typescript
const {
  isLoading,
  error,
  response,
  suggestions,
  generateResponse,
  analyzeConversation,
  generateSuggestions,
} = useLangChain();

// Analisar uma conversa
await analyzeConversation(conversationData, 'openai');

// Gerar sugestões
await generateSuggestions(conversationData, 'anthropic');

// Prompt personalizado
await generateResponse('Seu prompt aqui', 'Prompt do sistema', 'openai');
```

### 3. Usar o Componente AIAssistant
```typescript
import { AIAssistant } from '../components/chatwoot/AIAssistant';

<AIAssistant 
  conversation={selectedConversation}
  onSuggestionSelect={(suggestion) => {
    // Usar a sugestão selecionada
    console.log(suggestion);
  }}
/>
```

## Modelos Disponíveis

- **OpenAI GPT**: `gpt-3.5-turbo` (padrão)
- **Anthropic Claude**: `claude-3-sonnet-20240229`
- **Google Gemini**: `gemini-pro`
- **Cohere Command**: `command`

## Configurações Avançadas

### Temperatura
A temperatura padrão é 0.7 para todos os modelos. Você pode ajustar isso no arquivo `src/services/langchain.ts`:

```typescript
this.openaiModel = new ChatOpenAI({
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.7, // Ajuste aqui (0.0 = mais determinístico, 1.0 = mais criativo)
});
```

### Modelos Alternativos
Você pode alterar os modelos padrão no arquivo `src/services/langchain.ts`:

```typescript
// Para OpenAI
modelName: "gpt-4", // ou "gpt-4-turbo-preview"

// Para Anthropic
model: "claude-3-opus-20240229", // ou "claude-3-haiku-20240307"

// Para Google
model: "gemini-pro-vision", // para suporte a imagens
```

## Segurança

⚠️ **Importante**: Nunca commite suas chaves de API no repositório. O arquivo `.env` deve estar no `.gitignore`.

## Troubleshooting

### Erro: "Model not initialized"
- Verifique se a chave de API está configurada corretamente no `.env`
- Certifique-se de que o arquivo `.env` está na raiz do projeto
- Reinicie o servidor de desenvolvimento após adicionar as chaves

### Erro: "API key invalid"
- Verifique se a chave de API está correta
- Certifique-se de que a conta tem créditos disponíveis
- Verifique se a API está ativa na plataforma

### Performance Lenta
- Considere usar modelos mais rápidos (ex: `gpt-3.5-turbo` em vez de `gpt-4`)
- Ajuste a temperatura para valores mais baixos
- Implemente cache para respostas frequentes

## Próximos Passos

1. Configure suas chaves de API no arquivo `.env`
2. Teste o assistente com uma conversa do Chatwoot
3. Personalize os prompts e configurações conforme necessário
4. Implemente funcionalidades adicionais como cache e histórico 