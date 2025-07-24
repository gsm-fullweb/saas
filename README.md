# SaaS ChatHook - Plataforma de Chat Integrada

*Plataforma moderna de chat integrada com Chatwoot e Supabase*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/rafael-portelas-projects/v0-modern-saa-s-platform)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/RmpCWu6zU5R)

## Overview

SaaS ChatHook é uma plataforma moderna de chat que integra com Chatwoot via proxy e utiliza Supabase como banco de dados. A plataforma oferece:

- Dashboard para gestores e agentes
- Integração com Chatwoot via proxy seguro
- Sistema de autenticação e autorização
- Gerenciamento de conversas, contatos e agentes
- **Sistema de bots automatizados via webhooks**
- Interface responsiva e moderna

## Funcionalidades

- **Dashboard**: Visão geral de conversas e métricas
- **Conversas**: Gerenciamento de tickets e mensagens
- **Contatos**: Base de dados de clientes
- **Agentes**: Gerenciamento de equipe
- **Bots**: Criação e gerenciamento de bots automatizados via webhooks
- **Integração WhatsApp**: Via webhooks

## 🚀 Sistema de Bots

### Características dos Bots

- **Criação Simples**: Interface intuitiva para criar bots
- **Teste de Conexão**: Teste webhooks diretamente na interface
- **Chat de Teste**: Simule conversas reais com seus bots
- **Chat Flutuante**: Interface compacta para testes rápidos
- **Monitoramento em Tempo Real**: Indicadores de status dos bots
- **Dashboard de Estatísticas**: Métricas detalhadas de performance
- **Múltiplas Plataformas**: Suporte para n8n, Zapier, Make e sistemas personalizados
- **Payload Estruturado**: Dados organizados e bem documentados

### Como Usar

1. **Criar Bot**:
   - Acesse a seção **Bots** no menu lateral
   - Clique em **"Novo Bot"**
   - Insira a URL do webhook (ex: `https://n8n-n8n.n1n956.easypanel.host/webhook/conversa`)
   - Teste a conexão com o botão de teste
   - Ative o bot e salve

2. **Testar Bot**:
   - Use o botão de chat para abrir o simulador de conversa
   - Envie mensagens de teste e veja as respostas do webhook
   - Use o "Teste Automático" para enviar múltiplas mensagens
   - Monitore estatísticas em tempo real

3. **Chat Flutuante**:
   - Use o botão de chat flutuante para testes rápidos
   - Interface compacta que não interfere na navegação
   - Ideal para testes contínuos durante o desenvolvimento

4. **Monitoramento**:
   - Visualize o status dos bots em tempo real
   - Acompanhe métricas de performance no dashboard
   - Veja estatísticas detalhadas de uso

### Exemplo de Webhook

```json
{
  "conversa_id": "conv-123456",
  "contato": {
    "nome": "João Silva",
    "telefone": "+5511999999999"
  },
  "mensagem": {
    "conteudo": "Olá, preciso de ajuda",
    "tipo": "texto"
  }
}
```

## Configuração do Ambiente

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Supabase Configuration
POSTGRES_URL=postgres://postgres.djlnjrrgejrgmguepjoh:0KDHSEqepYpnMfDf@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
POSTGRES_PRISMA_URL=postgres://postgres.djlnjrrgejrgmguepjoh:0KDHSEqepYpnMfDf@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
SUPABASE_URL=https://djlnjrrgejrgmguepjoh.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://djlnjrrgejrgmguepjoh.supabase.co
POSTGRES_URL_NON_POOLING=postgres://postgres.djlnjrrgejrgmguepjoh:0KDHSEqepYpnMfDf@aws-0-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require
SUPABASE_JWT_SECRET=KmnDpr779ZJpqbAAss5nnZ4l4+CsyhelBHQMBajYQnwkj6oT9djOwQmt9kg58g81X5rtfUw6r+g1kdeMBP8D4g==
POSTGRES_USER=postgres
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqbG5qcnJnZWpyZ21ndWVwam9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNjE2MzYsImV4cCI6MjA2ODgzNzYzNn0.7N_nP26Z_efJpwH1bS-JGQkWNmpY0dM91jVolhjbo98
POSTGRES_PASSWORD=0KDHSEqepYpnMfDf
POSTGRES_DATABASE=postgres
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqbG5qcnJnZWpyZ21ndWVwam9oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI2MTYzNiwiZXhwIjoyMDY4ODM3NjM2fQ.Mq6qqVuqXCMcL8dG4lE1bn6Of_O3MWCdJHz3uNBOTGk
POSTGRES_HOST=db.djlnjrrgejrgmguepjoh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqbG5qcnJnZWpyZ21ndWVwam9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNjE2MzYsImV4cCI6MjA2ODgzNzYzNn0.7N_nP26Z_efJpwH1bS-JGQkWNmpY0dM91jVolhjbo98
```

### Instalação

```bash
# Instalar dependências
npm install
# ou
pnpm install

# Executar em desenvolvimento
npm run dev
# ou
pnpm dev
```

## Arquitetura

### Estrutura do Projeto

- `app/` - Páginas e layouts do Next.js
- `components/` - Componentes React reutilizáveis
- `lib/` - Configurações e utilitários
- `hooks/` - Hooks personalizados
- `services/` - Serviços externos (WhatsApp, Bots, etc.)

### Integração com Chatwoot

A plataforma utiliza um proxy seguro para comunicação com o Chatwoot:

- **Proxy URL**: `https://api.chathook.com.br/api/chatwoot-proxy.php`
- **Autenticação**: Gerenciada pelo proxy (sem tokens expostos)
- **Estrutura de dados**: `{ "data": { "meta": {...}, "payload": [...] } }`

### Banco de Dados (Supabase)

O Supabase é utilizado para:

- Autenticação de usuários
- Armazenamento de dados da empresa
- Gerenciamento de conversas e mensagens
- Sistema de permissões e roles

## Deployment

O projeto está configurado para deploy no Vercel com as variáveis de ambiente necessárias.

## Desenvolvimento

Para continuar o desenvolvimento, acesse:
**[https://v0.dev/chat/projects/RmpCWu6zU5R](https://v0.dev/chat/projects/RmpCWu6zU5R)**

## Documentação

- [Guia de Configuração](./SETUP.md)
- [Guia de Bots](./docs/bots-guide.md)
