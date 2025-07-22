export default {
    // Configurações do agente de monitoramento
    monitoring: {
      // Intervalo de verificação (em minutos)
      checkInterval: 5,
      
      // Timeout para cada requisição (em segundos)
      requestTimeout: 4,
      
      // Número máximo de tentativas em caso de falha
      maxRetries: 3,
      
      // Delay entre tentativas (em segundos)
      retryDelay: 2,
      
      // Habilitar logs detalhados
      verbose: true,
      
      // Habilitar notificações webhook
      enableWebhooks: false,
      
      // URLs dos webhooks para notificações
      webhooks: {
        success: 'https://webhook.site/your-success-webhook',
        error: 'https://webhook.site/your-error-webhook',
        warning: 'https://webhook.site/your-warning-webhook'
      }
    },
  
    // Configurações da API
    api: {
      // URL base da API
      baseUrl: 'https://api.chathook.com.br/api/chatwoot-proxy.php',
      
      // ID da conta padrão
      defaultAccountId: 1,
      
      // Endpoints para monitorar
      endpoints: [
        {
          name: 'Conversas',
          path: 'conversations',
          required: true,
          expectedStatus: 200
        },
        {
          name: 'Agentes',
          path: 'agents',
          required: true,
          expectedStatus: 200
        },
        {
          name: 'Contatos',
          path: 'contacts',
          required: true,
          expectedStatus: 200
        },
        {
          name: 'Busca de Contatos',
          path: 'contacts/search',
          required: false,
          expectedStatus: 200
        },
        {
          name: 'Caixas de Entrada',
          path: 'inboxes',
          required: true,
          expectedStatus: 200
        }
      ]
    },
  
    // Configurações de notificação
    notifications: {
      // Habilitar notificações por email
      email: {
        enabled: false,
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
      },
      
      // Habilitar notificações por Slack
      slack: {
        enabled: false,
        webhookUrl: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
        channel: '#monitoring'
      },
      
      // Habilitar notificações por Discord
      discord: {
        enabled: false,
        webhookUrl: 'https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK'
      }
    },
  
    // Configurações de logging
    logging: {
      // Nível de log (error, warn, info, debug)
      level: 'info',
      
      // Arquivo de log
      file: './logs/agent-proxy.log',
      
      // Rotação de logs
      rotation: {
        enabled: true,
        maxSize: '10m',
        maxFiles: 5
      },
      
      // Formato do timestamp
      timestampFormat: 'YYYY-MM-DD HH:mm:ss'
    },
  
    // Configurações de métricas
    metrics: {
      // Habilitar coleta de métricas
      enabled: true,
      
      // Intervalo de coleta (em minutos)
      collectionInterval: 5,
      
      // Métricas a serem coletadas
      collect: {
        responseTime: true,
        statusCodes: true,
        errorRates: true,
        uptime: true
      },
      
      // Exportar métricas para Prometheus
      prometheus: {
        enabled: false,
        port: 9090,
        endpoint: '/metrics'
      }
    },
  
    // Configurações de segurança
    security: {
      // Rate limiting
      rateLimit: {
        enabled: true,
        maxRequests: 100,
        windowMs: 15 * 60 * 1000 // 15 minutos
      },
      
      // Headers de segurança
      headers: {
        'User-Agent': 'Kiro-ChatHook-Monitor/1.0',
        'X-Monitoring': 'true'
      }
    },
  
    // Configurações de desenvolvimento
    development: {
      // Modo de desenvolvimento
      mode: process.env.NODE_ENV === 'development',
      
      // Habilitar logs extras em desenvolvimento
      verbose: process.env.NODE_ENV === 'development',
      
      // Mock de respostas para desenvolvimento
      mockResponses: false
    }
  }; 