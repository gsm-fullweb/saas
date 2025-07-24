# Configuração do Ambiente - SaaS ChatHook

Este documento explica como configurar o ambiente de desenvolvimento e produção para o projeto SaaS ChatHook.

## Pré-requisitos

- Node.js 18+ 
- pnpm ou npm
- Conta no Supabase
- Acesso ao proxy Chatwoot

## Configuração das Variáveis de Ambiente

### 1. Criar arquivo `.env.local`

Na raiz do projeto, crie um arquivo `.env.local` com as seguintes variáveis:

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

# Chatwoot Configuration
NEXT_PUBLIC_CHATWOOT_PROXY_URL=https://api.chathook.com.br/api/chatwoot-proxy.php
```

### 2. Configuração do Supabase

#### Estrutura do Banco de Dados

Execute os scripts SQL na seguinte ordem:

1. `scripts/01-create-tables.sql` - Cria as tabelas principais
2. `scripts/02-rls-policies.sql` - Configura as políticas de segurança
3. `scripts/03-seed-data.sql` - Insere dados iniciais (opcional)

#### Tabelas Principais

- `empresas` - Dados das empresas
- `usuarios` - Usuários do sistema
- `contatos` - Contatos dos clientes
- `conversas` - Conversas/tickets
- `mensagens` - Mensagens das conversas
- `notas_internas` - Notas internas dos agentes

### 3. Configuração do Chatwoot

O sistema utiliza um proxy seguro para comunicação com o Chatwoot:

- **URL do Proxy**: `https://api.chathook.com.br/api/chatwoot-proxy.php`
- **Autenticação**: Gerenciada pelo proxy
- **Estrutura de Resposta**: `{ "data": { "meta": {...}, "payload": [...] } }`

## Instalação e Execução

### 1. Instalar Dependências

```bash
# Usando pnpm (recomendado)
pnpm install

# Ou usando npm
npm install
```

### 2. Executar em Desenvolvimento

```bash
# Usando pnpm
pnpm dev

# Ou usando npm
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

### 3. Build para Produção

```bash
# Usando pnpm
pnpm build
pnpm start

# Ou usando npm
npm run build
npm start
```

## Estrutura do Projeto

```
SaasChathook-main/
├── app/                    # Páginas Next.js
├── components/             # Componentes React
├── hooks/                  # Hooks personalizados
├── lib/                    # Configurações e utilitários
├── services/               # Serviços externos
├── scripts/                # Scripts SQL
└── public/                 # Arquivos estáticos
```

## Hooks Disponíveis

### Supabase
- `useEmpresas()` - Gerenciar empresas
- `useUsuarios(empresaId)` - Gerenciar usuários
- `useContatos(empresaId)` - Gerenciar contatos
- `useConversas(empresaId)` - Gerenciar conversas
- `useMensagens(conversaId)` - Gerenciar mensagens

### Chatwoot
- `useChatwootConversations(accountId)` - Conversas do Chatwoot
- `useChatwootAgents(accountId)` - Agentes do Chatwoot
- `useChatwootContacts(accountId)` - Contatos do Chatwoot

## Configuração de Deploy

### Vercel

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Deploy automático será feito a cada push

### Outras Plataformas

Configure as variáveis de ambiente conforme necessário para sua plataforma de deploy.

## Troubleshooting

### Erro de Conexão com Supabase

1. Verifique se as variáveis de ambiente estão corretas
2. Confirme se o projeto Supabase está ativo
3. Verifique as políticas RLS

### Erro de Conexão com Chatwoot

1. Verifique se o proxy está funcionando
2. Confirme se o account_id está correto
3. Use o parâmetro `debug=1` para mais informações

### Problemas de Build

1. Verifique se todas as dependências estão instaladas
2. Confirme se o TypeScript está configurado corretamente
3. Verifique se não há erros de linting

## Segurança

- Nunca commite arquivos `.env*` no repositório
- Use sempre o proxy para comunicação com Chatwoot
- Configure corretamente as políticas RLS no Supabase
- Mantenha as chaves de API seguras

## Suporte

Para dúvidas ou problemas:

1. Verifique a documentação do Supabase
2. Consulte os logs de erro
3. Use o modo debug do proxy Chatwoot
4. Abra uma issue no repositório 