# 🚀 **ChatHook LangChain - Sistema de Atendimento Inteligente**

## 📋 **Descrição**

Sistema SaaS de atendimento multi-canal integrado com Chatwoot e LangChain para automações inteligentes. O projeto combina dados reais do Chatwoot (via proxy) com processamento de IA para otimizar o atendimento ao cliente.

## ✨ **Funcionalidades Principais**

### 🤖 **LangChain Integration**
- **Lead Scoring Automático**: Análise inteligente de leads
- **Respostas Automáticas**: IA gera respostas contextuais
- **Roteamento Inteligente**: Atribuição automática de agentes
- **Enriquecimento de Contatos**: Dados enriquecidos automaticamente
- **Webhooks para n8n**: Integração com automações externas

### 📊 **Dashboard Completo**
- **Métricas em Tempo Real**: Conversas, agentes, performance
- **Lista de Conversas**: Visualização e gerenciamento
- **Kanban Board**: Organização visual das conversas
- **Sistema de Notificações**: Alertas em tempo real

### 🔧 **Arquitetura Robusta**
- **Proxy Chatwoot**: Comunicação segura com Chatwoot
- **Fallbacks Inteligentes**: Funciona com ou sem IA
- **Tratamento de Erros**: Sistema resiliente
- **Modo Desenvolvimento**: Simulações para desenvolvimento

## 🛠️ **Tecnologias Utilizadas**

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Lucide React
- **IA**: LangChain + OpenAI GPT-4
- **Backend**: Chatwoot Proxy (PHP)
- **Automação**: n8n Webhooks
- **Monitoramento**: Agent Proxy (Node.js)

## 🚀 **Instalação e Configuração**

### **1. Clone o repositório**
```bash
git clone <seu-repositorio>
cd project-chathook-LangChain
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
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

### **4. Execute o projeto**
```bash
npm run dev
```

### **5. Acesse a aplicação**
Abra http://localhost:5173 no seu navegador

## 📁 **Estrutura do Projeto**

```
project-chathook-LangChain/
├── src/
│   ├── components/
│   │   └── chatwoot/          # Componentes do Chatwoot
│   ├── hooks/                 # Custom hooks
│   ├── services/              # Serviços (LangChain, API)
│   ├── types/                 # Tipos TypeScript
│   └── utils/                 # Utilitários
├── scripts/                   # Scripts de automação
├── agent-proxy.js            # Monitor de proxy
├── agent-proxy.config.js     # Configuração do agente
└── docs/                     # Documentação
```

## 🎯 **Como Usar**

### **1. Dashboard Principal**
- Visualize métricas em tempo real
- Acompanhe conversas ativas
- Monitore performance dos agentes

### **2. Lista de Conversas**
- Gerencie todas as conversas
- Atribua agentes
- Adicione tags e notas

### **3. Kanban Board**
- Organize conversas por status
- Arraste e solte para mudar status
- Visualização intuitiva

### **4. Demo LangChain**
- Teste funcionalidades de IA
- Simule eventos e automações
- Veja logs detalhados

## 🔧 **Scripts Disponíveis**

```bash
# Desenvolvimento
npm run dev                    # Inicia servidor de desenvolvimento
npm run build                  # Build para produção
npm run preview                # Preview do build

# Monitor de Proxy
npm run proxy-monitor          # Inicia monitor do proxy
npm run proxy-monitor:dev      # Modo desenvolvimento
npm run proxy-monitor:prod     # Modo produção
npm run proxy-monitor:test     # Modo teste
```

## 📊 **Status do Sistema**

| Componente | Status | Detalhes |
|------------|--------|----------|
| **Frontend React** | ✅ Funcionando | Interface responsiva |
| **Proxy Chatwoot** | ✅ Funcionando | Dados reais carregados |
| **LangChain IA** | ✅ Funcionando | Com ou sem API key |
| **Simulação Ações** | ✅ Funcionando | Logs detalhados |
| **Webhooks n8n** | ⚠️ Tentativa | Funciona se não houver CORS |

## 🚨 **Solução de Problemas**

### **Erro: "process is not defined"**
✅ **Já corrigido!** O sistema detecta automaticamente o ambiente.

### **Erro: "OpenAI API key not found"**
1. Verifique se o arquivo `.env` existe
2. Confirme se `VITE_OPENAI_API_KEY` está configurada
3. Reinicie o servidor: `npm run dev`

### **Erro: "CORS policy"**
✅ **Já resolvido!** Sistema funciona em modo de desenvolvimento com simulações.

## 🔄 **Fluxo de Dados**

```
Frontend (React) 
    ↓ GET (dados reais)
Proxy Chatwoot 
    ↓
LangChain (processamento IA)
    ↓
Simulação de Ações (logs)
    ↓
Webhooks n8n (tentativa)
```

## 📈 **Próximos Passos**

1. **Configure API key** do OpenAI para IA completa
2. **Personalize automações** conforme suas regras de negócio
3. **Configure CORS** no proxy para produção
4. **Implemente testes** automatizados
5. **Deploy em produção**

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 **Suporte**

- **Documentação**: Veja os arquivos `.md` no projeto
- **Issues**: Abra uma issue no GitHub
- **Email**: richard.fullweb@gmail.com

---

**Desenvolvido com ❤️ por Richard Wagner Portela**

**Sistema pronto para uso e desenvolvimento! 🚀✨** 