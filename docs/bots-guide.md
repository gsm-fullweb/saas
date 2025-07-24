# Guia de Bots e Webhooks - SaaS ChatHook

Este guia explica como criar e configurar bots automatizados usando webhooks no sistema SaaS ChatHook.

## 📋 Visão Geral

Os bots permitem automatizar o atendimento enviando mensagens recebidas para webhooks externos, onde você pode processar e responder automaticamente usando ferramentas como n8n, Zapier, Make (Integromat) ou sistemas personalizados.

## 🚀 Como Funciona

1. **Recebimento de Mensagem**: Quando um cliente envia uma mensagem
2. **Processamento**: O sistema prepara os dados da conversa
3. **Envio para Webhook**: Os dados são enviados para todos os bots ativos
4. **Resposta**: Seu webhook processa e pode retornar uma resposta
5. **Atualização**: O status do bot é atualizado com o resultado

## 🔧 Configuração de um Bot

### 1. Criar Novo Bot

1. Acesse a seção **Bots** no menu lateral
2. Clique em **"Novo Bot"**
3. Preencha os campos:
   - **Nome**: Nome descritivo do bot
   - **URL do Webhook**: URL que receberá os dados
   - **Tipo**: n8n, Zapier, Make ou Personalizado
   - **Descrição**: Descrição opcional
   - **Status**: Ativo/Inativo

### 2. Testar Conexão

1. Após inserir a URL do webhook, clique no botão de teste
2. O sistema enviará uma mensagem de teste
3. Verifique se a conexão foi bem-sucedida
4. Se houver erro, verifique a URL e tente novamente

### 3. Ativar o Bot

1. Certifique-se de que o bot está marcado como "Ativo"
2. Salve as configurações
3. O bot começará a receber mensagens automaticamente

## 📊 Estrutura dos Dados

### Payload Enviado

```json
{
  "conversa_id": "conv-123456",
  "contato": {
    "nome": "João Silva",
    "telefone": "+5511999999999",
    "email": "joao@exemplo.com"
  },
  "mensagem": {
    "id": "msg-789",
    "conteudo": "Olá, preciso de ajuda com meu pedido",
    "tipo": "texto",
    "timestamp": "2024-01-23T10:30:00.000Z"
  },
  "agente": {
    "id": "agente-001",
    "nome": "Maria Santos"
  },
  "empresa": {
    "id": "empresa-001",
    "nome": "Minha Empresa"
  },
  "metadata": {
    "canal": "whatsapp",
    "prioridade": "normal"
  }
}
```

### Campos Detalhados

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `conversa_id` | string | ID único da conversa |
| `contato.nome` | string | Nome completo do cliente |
| `contato.telefone` | string | Número do WhatsApp |
| `contato.email` | string | Email (se disponível) |
| `mensagem.id` | string | ID único da mensagem |
| `mensagem.conteudo` | string | Texto da mensagem |
| `mensagem.tipo` | string | tipo, imagem, audio, video, documento |
| `mensagem.timestamp` | string | Data/hora da mensagem |
| `agente.id` | string | ID do agente (se atribuído) |
| `agente.nome` | string | Nome do agente (se atribuído) |
| `empresa.id` | string | ID da empresa |
| `empresa.nome` | string | Nome da empresa |
| `metadata` | object | Informações adicionais |

## 🔗 Configuração por Plataforma

### n8n

1. **Criar Webhook**:
   - Adicione um nó "Webhook"
   - Configure o método POST
   - Copie a URL gerada

2. **Processar Dados**:
   - Use nós de condição para filtrar mensagens
   - Configure respostas automáticas
   - Integre com APIs externas

3. **Exemplo de Fluxo**:
   ```
   Webhook → IF (palavra-chave) → Resposta Automática → Enviar Mensagem
   ```

### Zapier

1. **Criar Zap**:
   - Trigger: Webhook (Catch Hook)
   - Copie a URL do webhook

2. **Configurar Ações**:
   - Filtrar por conteúdo
   - Enviar resposta via WhatsApp
   - Integrar com CRM

3. **Exemplo de Zap**:
   ```
   Webhook → Filter → WhatsApp → CRM Update
   ```

### Make (Integromat)

1. **Criar Cenário**:
   - Adicione um módulo Webhook
   - Configure para receber dados JSON

2. **Processamento**:
   - Use módulos de decisão
   - Configure respostas condicionais
   - Integre com sistemas externos

### Sistema Personalizado

1. **Endpoint**:
   - Crie um endpoint que aceite POST
   - Configure para receber JSON
   - Retorne status 200 para sucesso

2. **Processamento**:
   - Parse do JSON recebido
   - Lógica de negócio
   - Resposta via API do WhatsApp

## 🛠️ Exemplos Práticos

### Bot de Atendimento Automático

```javascript
// Exemplo de webhook em Node.js
app.post('/webhook/bot', (req, res) => {
  const { contato, mensagem } = req.body;
  
  // Verificar palavras-chave
  if (mensagem.conteudo.toLowerCase().includes('ajuda')) {
    // Enviar resposta automática
    enviarResposta(contato.telefone, 'Como posso ajudá-lo?');
  }
  
  res.status(200).json({ success: true });
});
```

### Bot de Qualificação de Leads

```javascript
// Exemplo de qualificação automática
app.post('/webhook/qualificacao', (req, res) => {
  const { contato, mensagem } = req.body;
  
  // Perguntas de qualificação
  const perguntas = [
    'Qual é o seu orçamento?',
    'Quando você precisa da solução?',
    'Qual é o tamanho da sua empresa?'
  ];
  
  // Lógica de qualificação
  const leadScore = calcularScore(mensagem.conteudo);
  
  if (leadScore > 7) {
    // Transferir para agente humano
    transferirParaAgente(contato.telefone);
  }
  
  res.status(200).json({ success: true });
});
```

## ⚠️ Boas Práticas

### Segurança

1. **Validação de Dados**: Sempre valide os dados recebidos
2. **Rate Limiting**: Implemente limites de requisições
3. **Autenticação**: Use tokens ou chaves de API
4. **HTTPS**: Sempre use HTTPS para webhooks

### Performance

1. **Resposta Rápida**: Responda em menos de 5 segundos
2. **Processamento Assíncrono**: Para tarefas longas
3. **Retry Logic**: Implemente retry para falhas
4. **Logs**: Mantenha logs para debug

### Monitoramento

1. **Status do Bot**: Monitore se está ativo
2. **Último Teste**: Verifique quando foi testado por último
3. **Taxa de Sucesso**: Acompanhe falhas vs sucessos
4. **Tempo de Resposta**: Monitore performance

## 🔍 Troubleshooting

### Problemas Comuns

1. **Webhook não responde**:
   - Verifique se a URL está correta
   - Confirme se o servidor está online
   - Teste com ferramentas como Postman

2. **Erro 404**:
   - Verifique se o endpoint existe
   - Confirme o método HTTP (POST)
   - Verifique a rota do webhook

3. **Erro 500**:
   - Verifique logs do servidor
   - Confirme se o JSON é válido
   - Teste com dados mínimos

4. **Timeout**:
   - Otimize o processamento
   - Use processamento assíncrono
   - Aumente timeout se necessário

### Debug

1. **Logs do Sistema**: Verifique logs do SaaS ChatHook
2. **Teste Manual**: Use o botão de teste na interface
3. **Ferramentas Externas**: Use Postman ou curl
4. **Monitoramento**: Acompanhe métricas de performance

## 📈 Métricas e Relatórios

### Métricas Disponíveis

- **Total de Bots**: Número de bots configurados
- **Bots Ativos**: Bots em funcionamento
- **Taxa de Sucesso**: % de webhooks que respondem
- **Tempo de Resposta**: Tempo médio de resposta
- **Último Teste**: Quando cada bot foi testado

### Relatórios

1. **Relatório de Performance**: Eficiência dos bots
2. **Relatório de Erros**: Falhas e problemas
3. **Relatório de Uso**: Volume de mensagens processadas
4. **Relatório de Qualidade**: Satisfação dos clientes

## 🆘 Suporte

Para dúvidas ou problemas:

1. **Documentação**: Consulte este guia
2. **Testes**: Use o botão de teste na interface
3. **Logs**: Verifique logs do sistema
4. **Suporte**: Entre em contato com o suporte técnico

---

**Versão**: 1.0  
**Última Atualização**: Janeiro 2024  
**Compatibilidade**: SaaS ChatHook v1.0+ 