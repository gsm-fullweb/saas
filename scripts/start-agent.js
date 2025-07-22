#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Configurações
const config = {
  development: {
    env: { NODE_ENV: 'development' },
    args: ['--watch']
  },
  production: {
    env: { NODE_ENV: 'production' },
    args: []
  }
};

// Função para iniciar o agente
const startAgent = (mode = 'development') => {
  console.log(`🚀 Iniciando agente em modo ${mode}...`);
  
  const agentPath = path.join(process.cwd(), 'agent-proxy.js');
  
  if (!fs.existsSync(agentPath)) {
    console.error('❌ Arquivo agent-proxy.js não encontrado!');
    process.exit(1);
  }
  
  const env = { ...process.env, ...config[mode].env };
  const args = config[mode].args;
  
  const child = spawn('node', [agentPath, ...args], {
    stdio: 'inherit',
    env
  });
  
  child.on('error', (error) => {
    console.error('❌ Erro ao iniciar agente:', error.message);
    process.exit(1);
  });
  
  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ Agente encerrado com código ${code}`);
      process.exit(code);
    }
  });
  
  // Tratamento de sinais
  process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando agente...');
    child.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Encerrando agente...');
    child.kill('SIGTERM');
  });
};

// Pega o modo dos argumentos da linha de comando
const mode = process.argv[2] || 'development';

if (!['development', 'production'].includes(mode)) {
  console.error('❌ Modo inválido. Use: development ou production');
  process.exit(1);
}

startAgent(mode); 