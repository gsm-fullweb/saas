<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react'

// Serviço para integração com Chatwoot via proxy
// Seguindo as regras: sempre usar proxy, validar dados, estrutura data.data.payload

interface ChatwootProxyResponse<T> {
  data: {
    meta: {
      count?: number
      current_page?: number
      total_pages?: number
    }
    payload: T
  }
}

interface ChatwootConversation {
  id: number
  inbox_id: number
  status: 'open' | 'resolved' | 'pending'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  subject?: string
  created_at: string
  updated_at: string
  meta: {
    sender: {
      id: number
      name: string
      email?: string
      phone_number?: string
      avatar_url?: string
    }
  }
  messages: ChatwootMessage[]
}

interface ChatwootMessage {
  id: number
  conversation_id: number
  message_type: 'incoming' | 'outgoing'
  content: string
  content_type: 'text' | 'image' | 'audio' | 'video' | 'file'
  created_at: string
  updated_at: string
  sender: {
    id: number
    name: string
    type: 'contact' | 'agent_bot' | 'user'
  }
  attachments?: ChatwootAttachment[]
}

interface ChatwootAttachment {
  id: number
  message_id: number
  file_type: string
  file_name: string
  file_size: number
  data_url: string
}

interface ChatwootAgent {
  id: number
  name: string
  email: string
  role: 'agent' | 'administrator'
  status: 'online' | 'offline' | 'away'
  avatar_url?: string
}

interface ChatwootContact {
  id: number
  name: string
  email?: string
  phone_number?: string
  avatar_url?: string
  custom_attributes?: Record<string, any>
  created_at: string
  updated_at: string
}

class ChatwootService {
  private proxyUrl = 'https://api.chathook.com.br/api/chatwoot-proxy.php'

  // Método genérico para fazer chamadas ao proxy
  private async makeProxyCall<T>(
    endpoint: string,
    params: Record<string, any> = {},
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = new URL(this.proxyUrl)
      url.searchParams.set('endpoint', endpoint)
      
      // Adicionar parâmetros à URL
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value.toString())
      })

      const response = await fetch(url.toString(), {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        ...options,
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`)
      }

      const data: ChatwootProxyResponse<T> = await response.json()
      
      // Validação da estrutura de resposta
      if (!data || !data.data || !data.data.payload) {
        throw new Error('Estrutura de resposta inválida do proxy')
      }

      return data.data.payload
    } catch (error) {
      console.error('Erro na chamada do proxy Chatwoot:', error)
      throw error
    }
  }

  // Buscar conversas
  async getConversations(accountId: number, params: {
    status?: string
    page?: number
    per_page?: number
    assignee_id?: number
  } = {}): Promise<ChatwootConversation[]> {
    try {
      const conversations = await this.makeProxyCall<ChatwootConversation[]>(
        'conversations',
        { account_id: accountId, ...params }
      )

      // Validação: verificar se é array antes de retornar
      if (!Array.isArray(conversations)) {
        console.error('Resposta de conversas não é um array:', conversations)
        return []
      }

      return conversations
    } catch (error) {
      console.error('Erro ao buscar conversas:', error)
      return []
    }
  }

  // Buscar conversa específica
  async getConversation(accountId: number, conversationId: number): Promise<ChatwootConversation | null> {
    try {
      const conversation = await this.makeProxyCall<ChatwootConversation>(
        'conversations',
        { 
          account_id: accountId, 
          conversation_id: conversationId 
        }
      )

      return conversation
    } catch (error) {
      console.error('Erro ao buscar conversa:', error)
      return null
    }
  }

  // Buscar mensagens de uma conversa
  async getMessages(accountId: number, conversationId: number): Promise<ChatwootMessage[]> {
    try {
      const messages = await this.makeProxyCall<ChatwootMessage[]>(
        'messages',
        { 
          account_id: accountId, 
          conversation_id: conversationId 
        }
      )

      // Validação: verificar se é array
      if (!Array.isArray(messages)) {
        console.error('Resposta de mensagens não é um array:', messages)
        return []
      }

      return messages
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
      return []
    }
  }

  // Enviar mensagem
  async sendMessage(
    accountId: number, 
    conversationId: number, 
    content: string,
    messageType: 'outgoing' = 'outgoing'
  ): Promise<ChatwootMessage | null> {
    try {
      const message = await this.makeProxyCall<ChatwootMessage>(
        'messages',
        { account_id: accountId },
        {
          method: 'POST',
          body: {
            conversation_id: conversationId,
            content,
            message_type: messageType,
          },
        }
      )

      return message
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      return null
    }
  }

  // Atualizar status da conversa
  async updateConversationStatus(
    accountId: number,
    conversationId: number,
    status: 'open' | 'resolved' | 'pending'
  ): Promise<ChatwootConversation | null> {
    try {
      const conversation = await this.makeProxyCall<ChatwootConversation>(
        'conversations',
        { account_id: accountId },
        {
          method: 'PATCH',
          body: {
            conversation_id: conversationId,
            status,
          },
        }
      )

      return conversation
    } catch (error) {
      console.error('Erro ao atualizar status da conversa:', error)
      return null
    }
  }

  // Buscar agentes
  async getAgents(accountId: number): Promise<ChatwootAgent[]> {
    try {
      const agents = await this.makeProxyCall<ChatwootAgent[]>(
        'agents',
        { account_id: accountId }
      )

      // Validação: verificar se é array
      if (!Array.isArray(agents)) {
        console.error('Resposta de agentes não é um array:', agents)
        return []
      }

      return agents
    } catch (error) {
      console.error('Erro ao buscar agentes:', error)
      return []
    }
  }

  // Buscar contatos
  async getContacts(accountId: number, params: {
    page?: number
    per_page?: number
  } = {}): Promise<ChatwootContact[]> {
    try {
      const contacts = await this.makeProxyCall<ChatwootContact[]>(
        'contacts',
        { account_id: accountId, ...params }
      )

      // Validação: verificar se é array
      if (!Array.isArray(contacts)) {
        console.error('Resposta de contatos não é um array:', contacts)
        return []
      }

      return contacts
    } catch (error) {
      console.error('Erro ao buscar contatos:', error)
      return []
    }
  }

  // Buscar contato específico
  async getContact(accountId: number, contactId: number): Promise<ChatwootContact | null> {
    try {
      const contact = await this.makeProxyCall<ChatwootContact>(
        'contacts',
        { 
          account_id: accountId, 
          contact_id: contactId 
        }
      )

      return contact
    } catch (error) {
      console.error('Erro ao buscar contato:', error)
      return null
    }
  }

  // Atribuir conversa a um agente
  async assignConversation(
    accountId: number,
    conversationId: number,
    agentId: number
  ): Promise<ChatwootConversation | null> {
    try {
      const conversation = await this.makeProxyCall<ChatwootConversation>(
        'conversations',
        { account_id: accountId },
        {
          method: 'PATCH',
          body: {
            conversation_id: conversationId,
            assignee_id: agentId,
          },
        }
      )

      return conversation
    } catch (error) {
      console.error('Erro ao atribuir conversa:', error)
      return null
    }
  }

  // Buscar métricas da conta
  async getAccountMetrics(accountId: number): Promise<any> {
    try {
      const metrics = await this.makeProxyCall<any>(
        'metrics',
        { account_id: accountId }
      )

      return metrics
    } catch (error) {
      console.error('Erro ao buscar métricas:', error)
      return null
    }
  }

  // Debug: método para testar conexão
  async testConnection(accountId: number): Promise<boolean> {
    try {
      const response = await this.makeProxyCall<any>(
        'conversations',
        { 
          account_id: accountId,
          debug: 1 // Parâmetro de debug conforme regras
        }
      )
      
      console.log('Teste de conexão bem-sucedido:', response)
      return true
    } catch (error) {
      console.error('Teste de conexão falhou:', error)
      return false
    }
  }
}

// Instância singleton do serviço
export const chatwootService = new ChatwootService()

// Hooks personalizados para usar o serviço
export function useChatwootConversations(accountId: number) {
  const [conversations, setConversations] = useState<ChatwootConversation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadConversations = useCallback(async (params?: any) => {
    if (!accountId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const data = await chatwootService.getConversations(accountId, params)
      setConversations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversas')
    } finally {
      setLoading(false)
    }
  }, [accountId])

  const sendMessage = useCallback(async (
    conversationId: number,
    content: string
  ) => {
    try {
      setError(null)
      const message = await chatwootService.sendMessage(accountId, conversationId, content)
      
      if (message) {
        // Atualizar conversa local com nova mensagem
        setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, message],
              updated_at: message.created_at
            }
          }
          return conv
        }))
      }
      
      return message
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem')
      throw err
    }
  }, [accountId])

  const updateStatus = useCallback(async (
    conversationId: number,
    status: 'open' | 'resolved' | 'pending'
  ) => {
    try {
      setError(null)
      const conversation = await chatwootService.updateConversationStatus(accountId, conversationId, status)
      
      if (conversation) {
        setConversations(prev => prev.map(conv => 
          conv.id === conversationId ? conversation : conv
        ))
      }
      
      return conversation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status')
      throw err
    }
  }, [accountId])

  return {
    conversations,
    loading,
    error,
    loadConversations,
    sendMessage,
    updateStatus
  }
}

export function useChatwootAgents(accountId: number) {
  const [agents, setAgents] = useState<ChatwootAgent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAgents = useCallback(async () => {
    if (!accountId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const data = await chatwootService.getAgents(accountId)
      setAgents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar agentes')
    } finally {
      setLoading(false)
    }
  }, [accountId])

  useEffect(() => {
    loadAgents()
  }, [loadAgents])

  return {
    agents,
    loading,
    error,
    loadAgents
  }
}

export function useChatwootContacts(accountId: number) {
  const [contacts, setContacts] = useState<ChatwootContact[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadContacts = useCallback(async (params?: any) => {
    if (!accountId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const data = await chatwootService.getContacts(accountId, params)
      setContacts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contatos')
    } finally {
      setLoading(false)
    }
  }, [accountId])

  return {
    contacts,
    loading,
    error,
    loadContacts
  }
=======
import { useState, useEffect, useCallback } from 'react'

// Serviço para integração com Chatwoot via proxy
// Seguindo as regras: sempre usar proxy, validar dados, estrutura data.data.payload

interface ChatwootProxyResponse<T> {
  data: {
    meta: {
      count?: number
      current_page?: number
      total_pages?: number
    }
    payload: T
  }
}

interface ChatwootConversation {
  id: number
  inbox_id: number
  status: 'open' | 'resolved' | 'pending'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  subject?: string
  created_at: string
  updated_at: string
  meta: {
    sender: {
      id: number
      name: string
      email?: string
      phone_number?: string
      avatar_url?: string
    }
  }
  messages: ChatwootMessage[]
}

interface ChatwootMessage {
  id: number
  conversation_id: number
  message_type: 'incoming' | 'outgoing'
  content: string
  content_type: 'text' | 'image' | 'audio' | 'video' | 'file'
  created_at: string
  updated_at: string
  sender: {
    id: number
    name: string
    type: 'contact' | 'agent_bot' | 'user'
  }
  attachments?: ChatwootAttachment[]
}

interface ChatwootAttachment {
  id: number
  message_id: number
  file_type: string
  file_name: string
  file_size: number
  data_url: string
}

interface ChatwootAgent {
  id: number
  name: string
  email: string
  role: 'agent' | 'administrator'
  status: 'online' | 'offline' | 'away'
  avatar_url?: string
}

interface ChatwootContact {
  id: number
  name: string
  email?: string
  phone_number?: string
  avatar_url?: string
  custom_attributes?: Record<string, any>
  created_at: string
  updated_at: string
}

class ChatwootService {
  private proxyUrl = 'https://api.chathook.com.br/api/chatwoot-proxy.php'

  // Método genérico para fazer chamadas ao proxy
  private async makeProxyCall<T>(
    endpoint: string,
    params: Record<string, any> = {},
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = new URL(this.proxyUrl)
      url.searchParams.set('endpoint', endpoint)
      
      // Adicionar parâmetros à URL
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value.toString())
      })

      const response = await fetch(url.toString(), {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        ...options,
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`)
      }

      const data: ChatwootProxyResponse<T> = await response.json()
      
      // Validação da estrutura de resposta
      if (!data || !data.data || !data.data.payload) {
        throw new Error('Estrutura de resposta inválida do proxy')
      }

      return data.data.payload
    } catch (error) {
      console.error('Erro na chamada do proxy Chatwoot:', error)
      throw error
    }
  }

  // Buscar conversas
  async getConversations(accountId: number, params: {
    status?: string
    page?: number
    per_page?: number
    assignee_id?: number
  } = {}): Promise<ChatwootConversation[]> {
    try {
      const conversations = await this.makeProxyCall<ChatwootConversation[]>(
        'conversations',
        { account_id: accountId, ...params }
      )

      // Validação: verificar se é array antes de retornar
      if (!Array.isArray(conversations)) {
        console.error('Resposta de conversas não é um array:', conversations)
        return []
      }

      return conversations
    } catch (error) {
      console.error('Erro ao buscar conversas:', error)
      return []
    }
  }

  // Buscar conversa específica
  async getConversation(accountId: number, conversationId: number): Promise<ChatwootConversation | null> {
    try {
      const conversation = await this.makeProxyCall<ChatwootConversation>(
        'conversations',
        { 
          account_id: accountId, 
          conversation_id: conversationId 
        }
      )

      return conversation
    } catch (error) {
      console.error('Erro ao buscar conversa:', error)
      return null
    }
  }

  // Buscar mensagens de uma conversa
  async getMessages(accountId: number, conversationId: number): Promise<ChatwootMessage[]> {
    try {
      const messages = await this.makeProxyCall<ChatwootMessage[]>(
        'messages',
        { 
          account_id: accountId, 
          conversation_id: conversationId 
        }
      )

      // Validação: verificar se é array
      if (!Array.isArray(messages)) {
        console.error('Resposta de mensagens não é um array:', messages)
        return []
      }

      return messages
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
      return []
    }
  }

  // Enviar mensagem
  async sendMessage(
    accountId: number, 
    conversationId: number, 
    content: string,
    messageType: 'outgoing' = 'outgoing'
  ): Promise<ChatwootMessage | null> {
    try {
      const message = await this.makeProxyCall<ChatwootMessage>(
        'messages',
        { account_id: accountId },
        {
          method: 'POST',
          body: {
            conversation_id: conversationId,
            content,
            message_type: messageType,
          },
        }
      )

      return message
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      return null
    }
  }

  // Atualizar status da conversa
  async updateConversationStatus(
    accountId: number,
    conversationId: number,
    status: 'open' | 'resolved' | 'pending'
  ): Promise<ChatwootConversation | null> {
    try {
      const conversation = await this.makeProxyCall<ChatwootConversation>(
        'conversations',
        { account_id: accountId },
        {
          method: 'PATCH',
          body: {
            conversation_id: conversationId,
            status,
          },
        }
      )

      return conversation
    } catch (error) {
      console.error('Erro ao atualizar status da conversa:', error)
      return null
    }
  }

  // Buscar agentes
  async getAgents(accountId: number): Promise<ChatwootAgent[]> {
    try {
      const agents = await this.makeProxyCall<ChatwootAgent[]>(
        'agents',
        { account_id: accountId }
      )

      // Validação: verificar se é array
      if (!Array.isArray(agents)) {
        console.error('Resposta de agentes não é um array:', agents)
        return []
      }

      return agents
    } catch (error) {
      console.error('Erro ao buscar agentes:', error)
      return []
    }
  }

  // Buscar contatos
  async getContacts(accountId: number, params: {
    page?: number
    per_page?: number
  } = {}): Promise<ChatwootContact[]> {
    try {
      const contacts = await this.makeProxyCall<ChatwootContact[]>(
        'contacts',
        { account_id: accountId, ...params }
      )

      // Validação: verificar se é array
      if (!Array.isArray(contacts)) {
        console.error('Resposta de contatos não é um array:', contacts)
        return []
      }

      return contacts
    } catch (error) {
      console.error('Erro ao buscar contatos:', error)
      return []
    }
  }

  // Buscar contato específico
  async getContact(accountId: number, contactId: number): Promise<ChatwootContact | null> {
    try {
      const contact = await this.makeProxyCall<ChatwootContact>(
        'contacts',
        { 
          account_id: accountId, 
          contact_id: contactId 
        }
      )

      return contact
    } catch (error) {
      console.error('Erro ao buscar contato:', error)
      return null
    }
  }

  // Atribuir conversa a um agente
  async assignConversation(
    accountId: number,
    conversationId: number,
    agentId: number
  ): Promise<ChatwootConversation | null> {
    try {
      const conversation = await this.makeProxyCall<ChatwootConversation>(
        'conversations',
        { account_id: accountId },
        {
          method: 'PATCH',
          body: {
            conversation_id: conversationId,
            assignee_id: agentId,
          },
        }
      )

      return conversation
    } catch (error) {
      console.error('Erro ao atribuir conversa:', error)
      return null
    }
  }

  // Buscar métricas da conta
  async getAccountMetrics(accountId: number): Promise<any> {
    try {
      const metrics = await this.makeProxyCall<any>(
        'metrics',
        { account_id: accountId }
      )

      return metrics
    } catch (error) {
      console.error('Erro ao buscar métricas:', error)
      return null
    }
  }

  // Debug: método para testar conexão
  async testConnection(accountId: number): Promise<boolean> {
    try {
      const response = await this.makeProxyCall<any>(
        'conversations',
        { 
          account_id: accountId,
          debug: 1 // Parâmetro de debug conforme regras
        }
      )
      
      console.log('Teste de conexão bem-sucedido:', response)
      return true
    } catch (error) {
      console.error('Teste de conexão falhou:', error)
      return false
    }
  }
}

// Instância singleton do serviço
export const chatwootService = new ChatwootService()

// Hooks personalizados para usar o serviço
export function useChatwootConversations(accountId: number) {
  const [conversations, setConversations] = useState<ChatwootConversation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadConversations = useCallback(async (params?: any) => {
    if (!accountId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const data = await chatwootService.getConversations(accountId, params)
      setConversations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversas')
    } finally {
      setLoading(false)
    }
  }, [accountId])

  const sendMessage = useCallback(async (
    conversationId: number,
    content: string
  ) => {
    try {
      setError(null)
      const message = await chatwootService.sendMessage(accountId, conversationId, content)
      
      if (message) {
        // Atualizar conversa local com nova mensagem
        setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, message],
              updated_at: message.created_at
            }
          }
          return conv
        }))
      }
      
      return message
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem')
      throw err
    }
  }, [accountId])

  const updateStatus = useCallback(async (
    conversationId: number,
    status: 'open' | 'resolved' | 'pending'
  ) => {
    try {
      setError(null)
      const conversation = await chatwootService.updateConversationStatus(accountId, conversationId, status)
      
      if (conversation) {
        setConversations(prev => prev.map(conv => 
          conv.id === conversationId ? conversation : conv
        ))
      }
      
      return conversation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status')
      throw err
    }
  }, [accountId])

  return {
    conversations,
    loading,
    error,
    loadConversations,
    sendMessage,
    updateStatus
  }
}

export function useChatwootAgents(accountId: number) {
  const [agents, setAgents] = useState<ChatwootAgent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAgents = useCallback(async () => {
    if (!accountId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const data = await chatwootService.getAgents(accountId)
      setAgents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar agentes')
    } finally {
      setLoading(false)
    }
  }, [accountId])

  useEffect(() => {
    loadAgents()
  }, [loadAgents])

  return {
    agents,
    loading,
    error,
    loadAgents
  }
}

export function useChatwootContacts(accountId: number) {
  const [contacts, setContacts] = useState<ChatwootContact[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadContacts = useCallback(async (params?: any) => {
    if (!accountId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const data = await chatwootService.getContacts(accountId, params)
      setContacts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contatos')
    } finally {
      setLoading(false)
    }
  }, [accountId])

  return {
    contacts,
    loading,
    error,
    loadContacts
  }
>>>>>>> 107753abbc7c201e46bfd2d1098db0e7d2541e5c
} 