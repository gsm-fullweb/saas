# 🔑 Configuração da API Key do OpenAI

## ⚠️ Problema Identificado
O sistema está funcionando em modo limitado porque a API key do OpenAI não está configurada.

## 🚀 Como Configurar

### 1. Obter API Key do OpenAI
1. Acesse [OpenAI Platform](https://platform.openai.com/)
2. Faça login ou crie uma conta
3. Vá para "API Keys" no menu lateral
4. Clique em "Create new secret key"
5. Copie a chave gerada (formato: `sk-...`)

### 2. Criar Arquivo .env
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# LangChain OpenAI Configuration
VITE_OPENAI_API_KEY=sk-sua_chave_aqui
REACT_APP_OPENAI_API_KEY=sk-sua_chave_aqui

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

### 3. Substituir a Chave
Substitua `sk-sua_chave_aqui` pela sua API key real do OpenAI.

### 4. Reiniciar o Servidor
Após criar o arquivo `.env`, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 🔍 Verificação

Após a configuração, você deve ver no console:
- ✅ `OpenAI model initialized successfully`
- ✅ Dados carregando normalmente
- ✅ Funcionalidades de IA funcionando

## 💡 Alternativas

### Opção 1: Usar Variável de Ambiente Temporária
Se preferir não criar o arquivo `.env`, você pode definir a variável temporariamente:

**Windows (PowerShell):**
```powershell
$env:VITE_OPENAI_API_KEY="sk-sua_chave_aqui"
npm run dev
```

**Windows (CMD):**
```cmd
set VITE_OPENAI_API_KEY=sk-sua_chave_aqui
npm run dev
```

### Opção 2: Modo Sem IA
Se não quiser usar a API do OpenAI por enquanto, o sistema funcionará com:
- Dados básicos do Chatwoot
- Funcionalidades limitadas
- Sem processamento de IA

## 🛡️ Segurança

- ⚠️ **NUNCA** commite o arquivo `.env` no git
- ⚠️ **NUNCA** compartilhe sua API key
- ✅ O arquivo `.env` já está no `.gitignore`
- ✅ Use sempre variáveis de ambiente para chaves secretas

## 🆘 Suporte

Se tiver problemas:
1. Verifique se a API key está correta
2. Confirme se o arquivo `.env` está na raiz do projeto
3. Reinicie o servidor após criar o arquivo
4. Verifique o console do navegador para erros

## 📊 Funcionalidades com IA

Com a API key configurada, você terá acesso a:
- 🤖 Lead Scoring Inteligente
- 💬 Respostas Automáticas
- 🎯 Roteamento Inteligente
- 📈 Enriquecimento de Contatos
- 🏷️ Sugestão de Tags
- 📊 Análise de Sentimento 