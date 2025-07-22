# 🔧 **Configuração do Ambiente**

## 🚨 **Erro Corrigido: `process is not defined`**

O erro que você estava vendo foi corrigido! O problema era que o `process.env` não está disponível no ambiente do navegador (Vite/React).

### ✅ **Solução Implementada:**

1. **Detecção automática do ambiente** (navegador vs Node.js)
2. **Suporte a múltiplas variáveis de ambiente** (Vite e React)
3. **Fallbacks inteligentes** quando a API key não está disponível
4. **Lógica básica sem IA** quando o OpenAI não está configurado

---

## 📝 **Configuração das Variáveis de Ambiente**

### **1. Criar arquivo `.env` na raiz do projeto:**

```bash
# LangChain OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# Chatwoot Proxy Configuration
VITE_CHATWOOT_PROXY_URL=https://api.chathook.com.br/api/chatwoot-proxy.php
REACT_APP_CHATWOOT_PROXY_URL=https://api.chathook.com.br/api/chatwoot-proxy.php

# Account Configuration
VITE_CHATWOOT_ACCOUNT_ID=1
REACT_APP_CHATWOOT_ACCOUNT_ID=1

# Development Configuration
VITE_DEV_MODE=true
REACT_APP_DEV_MODE=true
```

### **2. Obter sua OpenAI API Key:**

1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova API key
3. Copie a chave e cole no arquivo `.env`

### **3. Reiniciar o servidor de desenvolvimento:**

```bash
npm run dev
```

---

## 🔄 **Como Funciona Agora**

### **Com API Key configurada:**
```
Frontend → LangChain com IA → Processamento Inteligente → Automações
```

### **Sem API Key (fallback):**
```
Frontend → Lógica Básica → Processamento Simples → Automações Básicas
```

---

## 🎯 **Funcionalidades por Modo**

### **✅ Modo Completo (com OpenAI API Key):**
- Lead scoring inteligente com IA
- Respostas automáticas contextuais
- Roteamento baseado em IA
- Enriquecimento de contatos inteligente
- Análise de sentimento

### **✅ Modo Básico (sem OpenAI API Key):**
- Lead scoring baseado em palavras-chave
- Respostas automáticas simples
- Roteamento básico
- Webhooks para n8n
- Funcionalidades essenciais

---

## 🚀 **Testando a Configuração**

### **1. Verificar se está funcionando:**

Abra o console do navegador e procure por estas mensagens:

**Com API Key:**
```
✅ OpenAI model inicializado com sucesso
🤖 LangChain processando evento: conversation_created
```

**Sem API Key:**
```
⚠️ OpenAI API key não encontrada. LangChain funcionará em modo limitado.
🔄 Executando lógica básica sem IA
```

### **2. Testar funcionalidades:**

- Acesse o dashboard
- Verifique se os dados estão carregando
- Teste o componente `LangChainOrchestratorDemo`
- Verifique os logs no console

---

## 🔧 **Solução de Problemas**

### **Erro: "process is not defined"**
✅ **Já corrigido!** O sistema agora detecta automaticamente o ambiente.

### **Erro: "OpenAI API key not found"**
1. Verifique se o arquivo `.env` existe na raiz
2. Confirme se a variável `VITE_OPENAI_API_KEY` está configurada
3. Reinicie o servidor: `npm run dev`

### **Erro: "Network error"**
1. Verifique sua conexão com a internet
2. Confirme se a API key é válida
3. Verifique os logs do console para mais detalhes

---

## 📊 **Status do Sistema**

### **Indicadores no Console:**

| Status | Mensagem | Significado |
|--------|----------|-------------|
| ✅ | `OpenAI model inicializado` | IA funcionando |
| ⚠️ | `OpenAI API key não encontrada` | Modo básico |
| 🔄 | `Executando lógica básica` | Fallback ativo |
| ❌ | `Erro no processamento` | Problema detectado |

---

## 🎉 **Resultado**

Agora o sistema funciona em **dois modos**:

1. **Modo Completo**: Com IA para processamento inteligente
2. **Modo Básico**: Sem IA, mas com todas as funcionalidades essenciais

**O erro foi corrigido e o sistema está funcionando! 🚀✨**

---

## 📞 **Próximos Passos**

1. **Configure sua API key** no arquivo `.env`
2. **Teste as funcionalidades** no dashboard
3. **Verifique os logs** no console
4. **Personalize as automações** conforme necessário

**Tudo pronto para uso! 🎯** 