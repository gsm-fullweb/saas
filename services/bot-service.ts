<<<<<<< HEAD
// Serviço para gerenciamento de bots e webhooks
export interface Bot {
  id: string
  nome: string
  webhookUrl: string
  descricao?: string
  ativo: boolean
  ultimoTeste?: {
    sucesso: boolean
    timestamp: string
    mensagem?: string
  }
  criadoEm: string
  atualizadoEm: string
}

export interface WebhookPayload {
  conversa_id: string
  contato: {
    nome: string
    telefone: string
    email?: string
  }
  mensagem: {
    id: string
    conteudo: string
    tipo: "texto" | "imagem" | "audio" | "video" | "documento"
    timestamp: string
  }
  agente?: {
    id: string
    nome: string
  }
  empresa: {
    id: string
    nome: string
  }
  metadata?: Record<string, any>
}

export class BotService {
  private static instance: BotService
  private bots: Bot[] = []

  private constructor() {
    this.carregarBots()
  }

  public static getInstance(): BotService {
    if (!BotService.instance) {
      BotService.instance = new BotService()
    }
    return BotService.instance
  }

  private carregarBots(): void {
    try {
      if (typeof window !== 'undefined') {
        const botsSalvos = localStorage.getItem("bots")
        if (botsSalvos) {
          this.bots = JSON.parse(botsSalvos)
        }
      }
    } catch (error) {
      console.error("Erro ao carregar bots:", error)
      this.bots = []
    }
  }

  private salvarBots(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem("bots", JSON.stringify(this.bots))
      }
    } catch (error) {
      console.error("Erro ao salvar bots:", error)
    }
  }

  // Buscar todos os bots
  public getBots(): Bot[] {
    return [...this.bots]
  }

  // Buscar bot por ID
  public getBot(id: string): Bot | undefined {
    return this.bots.find(bot => bot.id === id)
  }

  // Buscar bots ativos
  public getBotsAtivos(): Bot[] {
    return this.bots.filter(bot => bot.ativo)
  }

  // Criar novo bot
  public criarBot(dados: Omit<Bot, "id" | "criadoEm" | "atualizadoEm">): Bot {
    const novoBot: Bot = {
      ...dados,
      id: Date.now().toString(),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    }

    this.bots.push(novoBot)
    this.salvarBots()
    return novoBot
  }

  // Atualizar bot
  public atualizarBot(id: string, dados: Partial<Bot>): Bot | null {
    const index = this.bots.findIndex(bot => bot.id === id)
    if (index === -1) return null

    this.bots[index] = {
      ...this.bots[index],
      ...dados,
      atualizadoEm: new Date().toISOString()
    }

    this.salvarBots()
    return this.bots[index]
  }

  // Excluir bot
  public excluirBot(id: string): boolean {
    const index = this.bots.findIndex(bot => bot.id === id)
    if (index === -1) return false

    this.bots.splice(index, 1)
    this.salvarBots()
    return true
  }

  // Alternar status do bot
  public alternarStatusBot(id: string): boolean {
    const bot = this.bots.find(b => b.id === id)
    if (!bot) return false

    bot.ativo = !bot.ativo
    bot.atualizadoEm = new Date().toISOString()
    this.salvarBots()
    return true
  }

  // Testar webhook
  public async testarWebhook(webhookUrl: string): Promise<{
    sucesso: boolean
    mensagem: string
    response?: any
  }> {
    try {
      const payload: WebhookPayload = {
        conversa_id: "teste-123",
        contato: {
          nome: "Usuário Teste",
          telefone: "+5511999999999",
          email: "teste@exemplo.com"
        },
        mensagem: {
          id: "msg-teste-123",
          conteudo: "Esta é uma mensagem de teste para verificar se o webhook está funcionando corretamente.",
          tipo: "texto",
          timestamp: new Date().toISOString()
        },
        agente: {
          id: "agente-teste",
          nome: "Agente Teste"
        },
        empresa: {
          id: "empresa-teste",
          nome: "Empresa Teste"
        },
        metadata: {
          teste: true,
          origem: "sistema-teste"
        }
      }

      // Usar proxy para evitar problemas de CORS
      const response = await fetch('/api/webhook-proxy', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookUrl,
          payload
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const responseData = await response.text()
      
      return {
        sucesso: true,
        mensagem: "Webhook testado com sucesso! Resposta recebida.",
        response: responseData
      }
    } catch (error) {
      return {
        sucesso: false,
        mensagem: `Erro ao testar webhook: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      }
    }
  }

  // Enviar mensagem para todos os bots ativos
  public async enviarParaBots(payload: WebhookPayload): Promise<{
    sucessos: string[]
    falhas: Array<{ botId: string, erro: string }>
  }> {
    const botsAtivos = this.getBotsAtivos()
    const resultados = {
      sucessos: [] as string[],
      falhas: [] as Array<{ botId: string, erro: string }>
    }

    for (const bot of botsAtivos) {
      try {
        // Usar proxy para evitar problemas de CORS
        const response = await fetch('/api/webhook-proxy', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            webhookUrl: bot.webhookUrl,
            payload
          })
        })

        if (response.ok) {
          resultados.sucessos.push(bot.id)
          
          // Atualizar último teste
          this.atualizarBot(bot.id, {
            ultimoTeste: {
              sucesso: true,
              timestamp: new Date().toISOString(),
              mensagem: "Mensagem enviada com sucesso"
            }
          })
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        resultados.falhas.push({
          botId: bot.id,
          erro: error instanceof Error ? error.message : "Erro desconhecido"
        })

        // Atualizar último teste com falha
        this.atualizarBot(bot.id, {
          ultimoTeste: {
            sucesso: false,
            timestamp: new Date().toISOString(),
            mensagem: error instanceof Error ? error.message : "Erro desconhecido"
          }
        })
      }
    }

    return resultados
  }

  // Validar URL do webhook
  public validarWebhookUrl(url: string): { valido: boolean; erro?: string } {
    try {
      const urlObj = new URL(url)
      
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        return { valido: false, erro: "URL deve usar HTTP ou HTTPS" }
      }

      if (!urlObj.hostname) {
        return { valido: false, erro: "URL deve ter um hostname válido" }
      }

      return { valido: true }
    } catch (error) {
      return { valido: false, erro: "URL inválida" }
    }
  }

  // Gerar exemplo de payload
  public gerarExemploPayload(): WebhookPayload {
    return {
      conversa_id: "conv-123456",
      contato: {
        nome: "João Silva",
        telefone: "+5511999999999",
        email: "joao@exemplo.com"
      },
      mensagem: {
        id: "msg-789",
        conteudo: "Olá, preciso de ajuda com meu pedido",
        tipo: "texto",
        timestamp: new Date().toISOString()
      },
      agente: {
        id: "agente-001",
        nome: "Maria Santos"
      },
      empresa: {
        id: "empresa-001",
        nome: "Minha Empresa"
      },
      metadata: {
        canal: "whatsapp",
        prioridade: "normal"
      }
    }
  }
}

// Instância singleton
=======
// Serviço para gerenciamento de bots e webhooks
export interface Bot {
  id: string
  nome: string
  webhookUrl: string
  descricao?: string
  ativo: boolean
  ultimoTeste?: {
    sucesso: boolean
    timestamp: string
    mensagem?: string
  }
  criadoEm: string
  atualizadoEm: string
}

export interface WebhookPayload {
  conversa_id: string
  contato: {
    nome: string
    telefone: string
    email?: string
  }
  mensagem: {
    id: string
    conteudo: string
    tipo: "texto" | "imagem" | "audio" | "video" | "documento"
    timestamp: string
  }
  agente?: {
    id: string
    nome: string
  }
  empresa: {
    id: string
    nome: string
  }
  metadata?: Record<string, any>
}

export class BotService {
  private static instance: BotService
  private bots: Bot[] = []

  private constructor() {
    this.carregarBots()
  }

  public static getInstance(): BotService {
    if (!BotService.instance) {
      BotService.instance = new BotService()
    }
    return BotService.instance
  }

  private carregarBots(): void {
    try {
      if (typeof window !== 'undefined') {
        const botsSalvos = localStorage.getItem("bots")
        if (botsSalvos) {
          this.bots = JSON.parse(botsSalvos)
        }
      }
    } catch (error) {
      console.error("Erro ao carregar bots:", error)
      this.bots = []
    }
  }

  private salvarBots(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem("bots", JSON.stringify(this.bots))
      }
    } catch (error) {
      console.error("Erro ao salvar bots:", error)
    }
  }

  // Buscar todos os bots
  public getBots(): Bot[] {
    return [...this.bots]
  }

  // Buscar bot por ID
  public getBot(id: string): Bot | undefined {
    return this.bots.find(bot => bot.id === id)
  }

  // Buscar bots ativos
  public getBotsAtivos(): Bot[] {
    return this.bots.filter(bot => bot.ativo)
  }

  // Criar novo bot
  public criarBot(dados: Omit<Bot, "id" | "criadoEm" | "atualizadoEm">): Bot {
    const novoBot: Bot = {
      ...dados,
      id: Date.now().toString(),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    }

    this.bots.push(novoBot)
    this.salvarBots()
    return novoBot
  }

  // Atualizar bot
  public atualizarBot(id: string, dados: Partial<Bot>): Bot | null {
    const index = this.bots.findIndex(bot => bot.id === id)
    if (index === -1) return null

    this.bots[index] = {
      ...this.bots[index],
      ...dados,
      atualizadoEm: new Date().toISOString()
    }

    this.salvarBots()
    return this.bots[index]
  }

  // Excluir bot
  public excluirBot(id: string): boolean {
    const index = this.bots.findIndex(bot => bot.id === id)
    if (index === -1) return false

    this.bots.splice(index, 1)
    this.salvarBots()
    return true
  }

  // Alternar status do bot
  public alternarStatusBot(id: string): boolean {
    const bot = this.bots.find(b => b.id === id)
    if (!bot) return false

    bot.ativo = !bot.ativo
    bot.atualizadoEm = new Date().toISOString()
    this.salvarBots()
    return true
  }

  // Testar webhook
  public async testarWebhook(webhookUrl: string): Promise<{
    sucesso: boolean
    mensagem: string
    response?: any
  }> {
    try {
      const payload: WebhookPayload = {
        conversa_id: "teste-123",
        contato: {
          nome: "Usuário Teste",
          telefone: "+5511999999999",
          email: "teste@exemplo.com"
        },
        mensagem: {
          id: "msg-teste-123",
          conteudo: "Esta é uma mensagem de teste para verificar se o webhook está funcionando corretamente.",
          tipo: "texto",
          timestamp: new Date().toISOString()
        },
        agente: {
          id: "agente-teste",
          nome: "Agente Teste"
        },
        empresa: {
          id: "empresa-teste",
          nome: "Empresa Teste"
        },
        metadata: {
          teste: true,
          origem: "sistema-teste"
        }
      }

      // Usar proxy para evitar problemas de CORS
      const response = await fetch('/api/webhook-proxy', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookUrl,
          payload
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const responseData = await response.text()
      
      return {
        sucesso: true,
        mensagem: "Webhook testado com sucesso! Resposta recebida.",
        response: responseData
      }
    } catch (error) {
      return {
        sucesso: false,
        mensagem: `Erro ao testar webhook: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      }
    }
  }

  // Enviar mensagem para todos os bots ativos
  public async enviarParaBots(payload: WebhookPayload): Promise<{
    sucessos: string[]
    falhas: Array<{ botId: string, erro: string }>
  }> {
    const botsAtivos = this.getBotsAtivos()
    const resultados = {
      sucessos: [] as string[],
      falhas: [] as Array<{ botId: string, erro: string }>
    }

    for (const bot of botsAtivos) {
      try {
        // Usar proxy para evitar problemas de CORS
        const response = await fetch('/api/webhook-proxy', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            webhookUrl: bot.webhookUrl,
            payload
          })
        })

        if (response.ok) {
          resultados.sucessos.push(bot.id)
          
          // Atualizar último teste
          this.atualizarBot(bot.id, {
            ultimoTeste: {
              sucesso: true,
              timestamp: new Date().toISOString(),
              mensagem: "Mensagem enviada com sucesso"
            }
          })
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        resultados.falhas.push({
          botId: bot.id,
          erro: error instanceof Error ? error.message : "Erro desconhecido"
        })

        // Atualizar último teste com falha
        this.atualizarBot(bot.id, {
          ultimoTeste: {
            sucesso: false,
            timestamp: new Date().toISOString(),
            mensagem: error instanceof Error ? error.message : "Erro desconhecido"
          }
        })
      }
    }

    return resultados
  }

  // Validar URL do webhook
  public validarWebhookUrl(url: string): { valido: boolean; erro?: string } {
    try {
      const urlObj = new URL(url)
      
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        return { valido: false, erro: "URL deve usar HTTP ou HTTPS" }
      }

      if (!urlObj.hostname) {
        return { valido: false, erro: "URL deve ter um hostname válido" }
      }

      return { valido: true }
    } catch (error) {
      return { valido: false, erro: "URL inválida" }
    }
  }

  // Gerar exemplo de payload
  public gerarExemploPayload(): WebhookPayload {
    return {
      conversa_id: "conv-123456",
      contato: {
        nome: "João Silva",
        telefone: "+5511999999999",
        email: "joao@exemplo.com"
      },
      mensagem: {
        id: "msg-789",
        conteudo: "Olá, preciso de ajuda com meu pedido",
        tipo: "texto",
        timestamp: new Date().toISOString()
      },
      agente: {
        id: "agente-001",
        nome: "Maria Santos"
      },
      empresa: {
        id: "empresa-001",
        nome: "Minha Empresa"
      },
      metadata: {
        canal: "whatsapp",
        prioridade: "normal"
      }
    }
  }
}

// Instância singleton
>>>>>>> 107753abbc7c201e46bfd2d1098db0e7d2541e5c
export const botService = BotService.getInstance() 