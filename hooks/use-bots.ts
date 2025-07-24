<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react'
import { botService, Bot, WebhookPayload } from '@/services/bot-service'

export function useBots() {
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar bots
  const carregarBots = useCallback(() => {
    try {
      setLoading(true)
      setError(null)
      const botsData = botService.getBots()
      setBots(botsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar bots')
    } finally {
      setLoading(false)
    }
  }, [])

  // Criar bot
  const criarBot = useCallback(async (dados: Omit<Bot, "id" | "criadoEm" | "atualizadoEm">) => {
    try {
      setError(null)
      const novoBot = botService.criarBot(dados)
      setBots(prev => [...prev, novoBot])
      return novoBot
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar bot')
      throw err
    }
  }, [])

  // Atualizar bot
  const atualizarBot = useCallback(async (id: string, dados: Partial<Bot>) => {
    try {
      setError(null)
      const botAtualizado = botService.atualizarBot(id, dados)
      if (botAtualizado) {
        setBots(prev => prev.map(bot => bot.id === id ? botAtualizado : bot))
        return botAtualizado
      }
      throw new Error('Bot não encontrado')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar bot')
      throw err
    }
  }, [])

  // Excluir bot
  const excluirBot = useCallback(async (id: string) => {
    try {
      setError(null)
      const sucesso = botService.excluirBot(id)
      if (sucesso) {
        setBots(prev => prev.filter(bot => bot.id !== id))
        return true
      }
      throw new Error('Bot não encontrado')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir bot')
      throw err
    }
  }, [])

  // Alternar status do bot
  const alternarStatusBot = useCallback(async (id: string) => {
    try {
      setError(null)
      const sucesso = botService.alternarStatusBot(id)
      if (sucesso) {
        setBots(prev => prev.map(bot => 
          bot.id === id ? { ...bot, ativo: !bot.ativo, atualizadoEm: new Date().toISOString() } : bot
        ))
        return true
      }
      throw new Error('Bot não encontrado')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alternar status do bot')
      throw err
    }
  }, [])

  // Testar webhook
  const testarWebhook = useCallback(async (webhookUrl: string) => {
    try {
      setError(null)
      return await botService.testarWebhook(webhookUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao testar webhook')
      throw err
    }
  }, [])

  // Enviar mensagem para bots
  const enviarParaBots = useCallback(async (payload: WebhookPayload) => {
    try {
      setError(null)
      return await botService.enviarParaBots(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem para bots')
      throw err
    }
  }, [])

  // Validar URL do webhook
  const validarWebhookUrl = useCallback((url: string) => {
    return botService.validarWebhookUrl(url)
  }, [])

  // Carregar bots na inicialização
  useEffect(() => {
    carregarBots()
  }, [carregarBots])

  return {
    bots,
    loading,
    error,
    carregarBots,
    criarBot,
    atualizarBot,
    excluirBot,
    alternarStatusBot,
    testarWebhook,
    enviarParaBots,
    validarWebhookUrl
  }
=======
import { useState, useEffect, useCallback } from 'react'
import { botService, Bot, WebhookPayload } from '@/services/bot-service'

export function useBots() {
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar bots
  const carregarBots = useCallback(() => {
    try {
      setLoading(true)
      setError(null)
      const botsData = botService.getBots()
      setBots(botsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar bots')
    } finally {
      setLoading(false)
    }
  }, [])

  // Criar bot
  const criarBot = useCallback(async (dados: Omit<Bot, "id" | "criadoEm" | "atualizadoEm">) => {
    try {
      setError(null)
      const novoBot = botService.criarBot(dados)
      setBots(prev => [...prev, novoBot])
      return novoBot
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar bot')
      throw err
    }
  }, [])

  // Atualizar bot
  const atualizarBot = useCallback(async (id: string, dados: Partial<Bot>) => {
    try {
      setError(null)
      const botAtualizado = botService.atualizarBot(id, dados)
      if (botAtualizado) {
        setBots(prev => prev.map(bot => bot.id === id ? botAtualizado : bot))
        return botAtualizado
      }
      throw new Error('Bot não encontrado')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar bot')
      throw err
    }
  }, [])

  // Excluir bot
  const excluirBot = useCallback(async (id: string) => {
    try {
      setError(null)
      const sucesso = botService.excluirBot(id)
      if (sucesso) {
        setBots(prev => prev.filter(bot => bot.id !== id))
        return true
      }
      throw new Error('Bot não encontrado')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir bot')
      throw err
    }
  }, [])

  // Alternar status do bot
  const alternarStatusBot = useCallback(async (id: string) => {
    try {
      setError(null)
      const sucesso = botService.alternarStatusBot(id)
      if (sucesso) {
        setBots(prev => prev.map(bot => 
          bot.id === id ? { ...bot, ativo: !bot.ativo, atualizadoEm: new Date().toISOString() } : bot
        ))
        return true
      }
      throw new Error('Bot não encontrado')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alternar status do bot')
      throw err
    }
  }, [])

  // Testar webhook
  const testarWebhook = useCallback(async (webhookUrl: string) => {
    try {
      setError(null)
      return await botService.testarWebhook(webhookUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao testar webhook')
      throw err
    }
  }, [])

  // Enviar mensagem para bots
  const enviarParaBots = useCallback(async (payload: WebhookPayload) => {
    try {
      setError(null)
      return await botService.enviarParaBots(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem para bots')
      throw err
    }
  }, [])

  // Validar URL do webhook
  const validarWebhookUrl = useCallback((url: string) => {
    return botService.validarWebhookUrl(url)
  }, [])

  // Carregar bots na inicialização
  useEffect(() => {
    carregarBots()
  }, [carregarBots])

  return {
    bots,
    loading,
    error,
    carregarBots,
    criarBot,
    atualizarBot,
    excluirBot,
    alternarStatusBot,
    testarWebhook,
    enviarParaBots,
    validarWebhookUrl
  }
>>>>>>> 107753abbc7c201e46bfd2d1098db0e7d2541e5c
} 