import cron from 'node-cron';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Carrega a configuração
let config;
try {
  config = await import('./agent-proxy.config.js');
  config = config.default;
} catch (error) {
  console.error('❌ Erro ao carregar configuração:', error.message);
  console.log('📝 Usando configuração padrão...');
  config = {
    monitoring: {
      checkInterval: 5,
      requestTimeout: 10,
      maxRetries: 3,
      retryDelay: 2,
      verbose: true,
      enableWebhooks: false
    },
    api: {
      baseUrl: 'https://api.chathook.com.br/api/chatwoot-proxy.php',
      defaultAccountId: 1,
      endpoints: [
        { name: 'Conversas', path: 'conversations', required: true },
        { name: 'Agentes', path: 'agents', required: true },
        { name: 'Contatos', path: 'contacts', required: true },
        { name: 'Busca de Contatos', path: 'contacts/search', required: false },
        { name: 'Caixas de Entrada', path: 'inboxes', required: true }
      ]
    },
    logging: {
      level: 'info',
      file: './logs/agent-proxy.log'
    }
  };
}

// Cria diretório de logs se não existir
const logDir = path.dirname(config.logging.file);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Função para log
const log = (level, message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  console.log(logMessage);
  
  // Salva no arquivo de log
  fs.appendFileSync(config.logging.file, logMessage + '\n');
};

// Configuração do axios
const axiosConfig = {
  timeout: config.monitoring.requestTimeout * 1000,
  headers: {
    ...(config.security?.headers || { 'User-Agent': 'Chatwoot-Proxy-Monitor/1.0' }),
    'Accept': 'application/json'
  }
};

// Função para verificar um endpoint específico com retry
const checkEndpoint = async (endpoint, retryCount = 0) => {
  const startTime = Date.now();
  const url = `${config.api.baseUrl}?endpoint=${endpoint.path}&account_id=${config.api.defaultAccountId}`;
  
  try {
    if (config.monitoring.verbose) {
      log('info', `🔍 Verificando: ${endpoint.name}...`);
    }
    
    const response = await axios.get(url, axiosConfig);
    const responseTime = Date.now() - startTime;
    
    if (response.status === (endpoint.expectedStatus || 200)) {
      log('info', `✅ [SUCCESS] ${endpoint.name}: OK (${responseTime}ms)`);
      
      // Verifica estrutura de dados
      if (response.data && typeof response.data === 'object') {
        if (response.data.data && response.data.data.payload) {
          if (config.monitoring.verbose) {
            log('debug', `   📊 Estrutura de dados: OK (payload encontrado)`);
          }
        } else {
          log('warn', `   ⚠️ Estrutura de dados: Diferente do esperado`);
        }
      }
      
      return { 
        success: true, 
        responseTime, 
        status: response.status,
        endpoint: endpoint.name,
        url 
      };
    } else {
      log('warn', `⚠️ [WARNING] ${endpoint.name}: Status ${response.status} (${responseTime}ms)`);
      return { 
        success: false, 
        responseTime, 
        status: response.status,
        endpoint: endpoint.name,
        url,
        error: `Status ${response.status}`
      };
    }
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (retryCount < config.monitoring.maxRetries) {
      log('warn', `🔄 [RETRY] ${endpoint.name}: Tentativa ${retryCount + 1}/${config.monitoring.maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, config.monitoring.retryDelay * 1000));
      return await checkEndpoint(endpoint, retryCount + 1);
    }
    
    let errorMessage = '';
    if (error.code === 'ECONNABORTED') {
      errorMessage = `Timeout após ${responseTime}ms`;
    } else if (error.response) {
      errorMessage = `${error.response.status} - ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = `Erro de rede - ${error.message}`;
    } else {
      errorMessage = error.message;
    }
    
    log('error', `❌ [ERROR] ${endpoint.name}: ${errorMessage} (${responseTime}ms)`);
    
    return { 
      success: false, 
      responseTime, 
      endpoint: endpoint.name,
      url,
      error: errorMessage 
    };
  }
};

// Função para enviar notificações
const sendNotification = async (type, data) => {
  if (!config.monitoring.enableWebhooks) return;
  
  const webhookUrl = config.monitoring.webhooks[type];
  if (!webhookUrl) return;
  
  try {
    await axios.post(webhookUrl, {
      timestamp: new Date().toISOString(),
      type,
      data
    }, { timeout: 5000 });
    
    log('info', `✅ Notificação ${type} enviada com sucesso`);
  } catch (error) {
    log('error', `❌ Erro ao enviar notificação ${type}: ${error.message}`);
  }
};

// Função principal para verificar todos os proxies
const checkProxies = async () => {
  const timestamp = new Date().toLocaleString('pt-BR');
  log('info', `\n🕐 [${timestamp}] Executando verificação de proxies...`);
  log('info', '='.repeat(60));
  
  const results = [];
  
  for (const endpoint of config.api.endpoints) {
    const result = await checkEndpoint(endpoint);
    results.push(result);
    
    // Pausa entre requisições
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Resumo dos resultados
  log('info', '\n📊 RESUMO DA VERIFICAÇÃO:');
  log('info', '='.repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
  
  log('info', `✅ Sucessos: ${successful}/${results.length}`);
  log('info', `❌ Falhas: ${failed}/${results.length}`);
  log('info', `⏱️ Tempo médio de resposta: ${avgResponseTime.toFixed(0)}ms`);
  
  if (failed > 0) {
    log('warn', '\n🔍 ENDPOINTS COM PROBLEMAS:');
    results.filter(r => !r.success).forEach(r => {
      log('warn', `   • ${r.endpoint}: ${r.error}`);
    });
    
    // Envia notificação de erro
    await sendNotification('error', {
      failedEndpoints: results.filter(r => !r.success),
      summary: { total: results.length, successful, failed, avgResponseTime }
    });
  } else {
    // Envia notificação de sucesso
    await sendNotification('success', {
      summary: { total: results.length, successful, failed, avgResponseTime }
    });
  }
  
  log('info', '='.repeat(60));
  
  // Coleta métricas se habilitado
  if (config.metrics?.enabled) {
    collectMetrics(results);
  }
};

// Função para coletar métricas
const collectMetrics = (results) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    totalChecks: results.length,
    successfulChecks: results.filter(r => r.success).length,
    failedChecks: results.filter(r => !r.success).length,
    avgResponseTime: results.reduce((sum, r) => sum + r.responseTime, 0) / results.length,
    statusCodes: results.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {}),
    endpoints: results.map(r => ({
      name: r.endpoint,
      success: r.success,
      responseTime: r.responseTime,
      status: r.status
    }))
  };
  
  // Salva métricas em arquivo
  const metricsFile = './logs/metrics.json';
  fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 2));
  
  if (config.monitoring.verbose) {
    log('debug', `📈 Métricas salvas em ${metricsFile}`);
  }
};

// Configuração do cron job
const cronSchedule = `*/${config.monitoring.checkInterval} * * * *`;
log('info', `⏰ Agendando verificação para executar a cada ${config.monitoring.checkInterval} minutos (${cronSchedule})`);

// Inicia o cron job
cron.schedule(cronSchedule, checkProxies, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});

log('info', '🚀 Agente de verificação de proxy iniciado com sucesso!');
log('info', `📝 Logs serão exibidos a cada verificação (${config.monitoring.checkInterval} minutos)`);
log('info', '🛑 Pressione Ctrl+C para parar o agente\n');

// Executa a verificação inicial
checkProxies();

// Tratamento de graceful shutdown
process.on('SIGINT', () => {
  log('info', '\n🛑 Recebido sinal de parada. Encerrando agente...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('info', '\n🛑 Recebido sinal de término. Encerrando agente...');
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  log('error', `💥 Erro não capturado: ${error.message}`);
  log('error', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  log('error', `💥 Promise rejeitada não tratada: ${reason}`);
});
