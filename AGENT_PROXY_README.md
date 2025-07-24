# 🤖 Agente de Monitoramento de Proxy Chatwoot

Este agente monitora continuamente os endpoints do proxy Chatwoot para garantir que estão funcionando corretamente.

## 📋 Funcionalidades

- ✅ **Monitoramento contínuo** dos endpoints do proxy
- ✅ **Verificação de saúde** com retry automático
- ✅ **Logs detalhados** com rotação automática
- ✅ **Métricas de performance** (tempo de resposta, status codes)
- ✅ **Notificações webhook** para alertas
- ✅ **Configuração flexível** via arquivo de configuração
- ✅ **Tratamento de erros** robusto
- ✅ **Graceful shutdown** com tratamento de sinais

## 🚀 Como Usar

### 1. Iniciar o Agente

```bash
# Modo desenvolvimento (com logs verbosos)
npm run proxy-monitor:dev

# Modo produção
npm run proxy-monitor:prod

# Execução direta
npm run proxy-monitor

# Execução direta com Node
node agent-proxy.js
```

### 2. Configuração

O agente usa o arquivo `agent-proxy.config.js` para configuração. Principais opções:

```javascript
module.exports = {
  monitoring: {
    checkInterval: 5,        // Intervalo em minutos
    requestTimeout: 10,      // Timeout em segundos
    maxRetries: 3,          // Tentativas em caso de falha
    retryDelay: 2,          // Delay entre tentativas
    verbose: true,          // Logs detalhados
    enableWebhooks: false   // Habilitar webhooks
  },
  api: {
    baseUrl: 'https://api.chathook.com.br/api/chatwoot-proxy.php',
    defaultAccountId: 1,
    endpoints: [
      { name: 'Conversas', path: 'conversations', required: true },
      { name: 'Agentes', path: 'agents', required: true },
      // ... mais endpoints
    ]
  }
};
```

## 📊 Endpoints Monitorados

| Endpoint | Nome | Obrigatório | Status Esperado |
|----------|------|-------------|-----------------|
| `conversations` | Conversas | ✅ | 200 |
| `agents` | Agentes | ✅ | 200 |
| `contacts` | Contatos | ✅ | 200 |
| `contacts/search` | Busca de Contatos | ❌ | 200 |
| `inboxes` | Caixas de Entrada | ✅ | 200 |

## 📈 Métricas Coletadas

O agente coleta as seguintes métricas:

- **Tempo de resposta** médio por endpoint
- **Taxa de sucesso** vs falhas
- **Códigos de status** HTTP
- **Uptime** do sistema
- **Histórico** de verificações

As métricas são salvas em `./logs/metrics.json`.

## 📝 Logs

### Estrutura dos Logs

```
[2024-01-15T10:30:00.000Z] [INFO] 🕐 [15/01/2024, 10:30:00] Executando verificação de proxies...
[2024-01-15T10:30:00.000Z] [INFO] ============================================================
[2024-01-15T10:30:00.000Z] [INFO] 🔍 Verificando: Conversas...
[2024-01-15T10:30:01.000Z] [INFO] ✅ [SUCCESS] Conversas: OK (681ms)
[2024-01-15T10:30:01.000Z] [DEBUG]    📊 Estrutura de dados: OK (payload encontrado)
```

### Níveis de Log

- **ERROR**: Erros críticos que impedem o funcionamento
- **WARN**: Avisos sobre problemas não críticos
- **INFO**: Informações gerais sobre o funcionamento
- **DEBUG**: Detalhes técnicos para debugging

### Arquivo de Log

Os logs são salvos em `./logs/agent-proxy.log` com rotação automática.

## 🔔 Notificações

### Webhooks

Configure webhooks no arquivo de configuração:

```javascript
monitoring: {
  enableWebhooks: true,
  webhooks: {
    success: 'https://webhook.site/your-success-webhook',
    error: 'https://webhook.site/your-error-webhook',
    warning: 'https://webhook.site/your-warning-webhook'
  }
}
```

### Estrutura das Notificações

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "type": "error",
  "data": {
    "failedEndpoints": [
      {
        "endpoint": "Conversas",
        "url": "https://api.chathook.com.br/api/chatwoot-proxy.php?endpoint=conversations&account_id=1",
        "error": "Timeout após 10000ms"
      }
    ],
    "summary": {
      "total": 5,
      "successful": 4,
      "failed": 1,
      "avgResponseTime": 245.6
    }
  }
}
```

## 🛠️ Configurações Avançadas

### Email Notifications

```javascript
notifications: {
  email: {
    enabled: true,
    smtp: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password'
      }
    },
    recipients: ['admin@empresa.com']
  }
}
```

### Slack Notifications

```javascript
notifications: {
  slack: {
    enabled: true,
    webhookUrl: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
    channel: '#monitoring'
  }
}
```

### Prometheus Metrics

```javascript
metrics: {
  prometheus: {
    enabled: true,
    port: 9090,
    endpoint: '/metrics'
  }
}
```

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de configuração**
   ```
   ❌ Erro ao carregar configuração: Cannot find module './agent-proxy.config.js'
   ```
   **Solução**: Verifique se o arquivo `agent-proxy.config.js` existe na raiz do projeto.

2. **Timeout nas requisições**
   ```
   ❌ [ERROR] Conversas: Timeout após 10000ms
   ```
   **Solução**: Aumente o `requestTimeout` na configuração ou verifique a conectividade de rede.

3. **Erro de permissão de arquivo**
   ```
   ❌ Erro ao salvar log: EACCES: permission denied
   ```
   **Solução**: Verifique as permissões do diretório `./logs/`.

### Logs de Debug

Para ativar logs detalhados, configure:

```javascript
monitoring: {
  verbose: true
}
```

### Teste Manual

Para testar um endpoint específico:

```bash
curl -X GET "https://api.chathook.com.br/api/chatwoot-proxy.php?endpoint=conversations&account_id=1" \
  -H "Accept: application/json" \
  -H "User-Agent: Chatwoot-Proxy-Monitor/1.0"
```

## 📦 Instalação

### Dependências

```bash
npm install node-cron axios
```

### Scripts Disponíveis

```bash
# Iniciar em modo desenvolvimento
npm run proxy-monitor:dev

# Iniciar em modo produção
npm run proxy-monitor:prod

# Execução direta
npm run proxy-monitor

# Teste rápido
npm run proxy-monitor:test
```

## 🔒 Segurança

- **Rate Limiting**: Configurável para evitar sobrecarga
- **Headers de Segurança**: User-Agent personalizado
- **Timeout**: Proteção contra requisições pendentes
- **Logs Seguros**: Não expõe informações sensíveis

## 📊 Monitoramento

### Métricas Disponíveis

- **Uptime**: Tempo de funcionamento do agente
- **Response Time**: Tempo médio de resposta por endpoint
- **Success Rate**: Taxa de sucesso das verificações
- **Error Rate**: Taxa de erro por tipo
- **Status Codes**: Distribuição de códigos HTTP

### Dashboard

Para visualizar as métricas em tempo real:

```bash
# Acesse o arquivo de métricas
cat ./logs/metrics.json

# Ou use jq para formatação
jq '.' ./logs/metrics.json
```

## 🚀 Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "proxy-monitor:prod"]
```

### PM2

```bash
# Instalar PM2
npm install -g pm2

# Iniciar com PM2
pm2 start agent-proxy.js --name "chatwoot-proxy-monitor"

# Monitorar
pm2 monit

# Logs
pm2 logs chatwoot-proxy-monitor
```

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique os logs em `./logs/agent-proxy.log`
2. Consulte as métricas em `./logs/metrics.json`
3. Teste manualmente os endpoints
4. Verifique a configuração em `agent-proxy.config.js`

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2024  
**Compatibilidade**: Node.js 16+  
**Licença**: MIT 