import { useState, useEffect, useCallback } from 'react'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import type { Empresa, Usuario, Contato, Conversa, Mensagem, NotaInterna } from '@/lib/supabase'

// Hook para gerenciar empresas
export function useEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarEmpresas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('empresas')
        .select('*')
        .order('nome')

      if (supabaseError) throw supabaseError
      
      setEmpresas(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar empresas')
      console.error('Erro ao carregar empresas:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const criarEmpresa = useCallback(async (empresa: Omit<Empresa, 'id' | 'criado_em' | 'atualizado_em'>) => {
    try {
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('empresas')
        .insert(empresa)
        .select()
        .single()

      if (supabaseError) throw supabaseError
      
      setEmpresas(prev => [...prev, data])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar empresa')
      console.error('Erro ao criar empresa:', err)
      throw err
    }
  }, [])

  const atualizarEmpresa = useCallback(async (id: string, updates: Partial<Empresa>) => {
    try {
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('empresas')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) throw supabaseError
      
      setEmpresas(prev => prev.map(emp => emp.id === id ? data : emp))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar empresa')
      console.error('Erro ao atualizar empresa:', err)
      throw err
    }
  }, [])

  useEffect(() => {
    carregarEmpresas()
  }, [carregarEmpresas])

  return {
    empresas,
    loading,
    error,
    carregarEmpresas,
    criarEmpresa,
    atualizarEmpresa
  }
}

// Hook para gerenciar usuários
export function useUsuarios(empresaId?: string) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarUsuarios = useCallback(async () => {
    if (!empresaId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('nome')

      if (supabaseError) throw supabaseError
      
      setUsuarios(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários')
      console.error('Erro ao carregar usuários:', err)
    } finally {
      setLoading(false)
    }
  }, [empresaId])

  const criarUsuario = useCallback(async (usuario: Omit<Usuario, 'id' | 'criado_em' | 'atualizado_em'>) => {
    try {
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('usuarios')
        .insert(usuario)
        .select()
        .single()

      if (supabaseError) throw supabaseError
      
      setUsuarios(prev => [...prev, data])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário')
      console.error('Erro ao criar usuário:', err)
      throw err
    }
  }, [])

  const atualizarUsuario = useCallback(async (id: string, updates: Partial<Usuario>) => {
    try {
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) throw supabaseError
      
      setUsuarios(prev => prev.map(user => user.id === id ? data : user))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário')
      console.error('Erro ao atualizar usuário:', err)
      throw err
    }
  }, [])

  useEffect(() => {
    carregarUsuarios()
  }, [carregarUsuarios])

  return {
    usuarios,
    loading,
    error,
    carregarUsuarios,
    criarUsuario,
    atualizarUsuario
  }
}

// Hook para gerenciar contatos
export function useContatos(empresaId?: string) {
  const [contatos, setContatos] = useState<Contato[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarContatos = useCallback(async () => {
    if (!empresaId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('contatos')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('nome')

      if (supabaseError) throw supabaseError
      
      setContatos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contatos')
      console.error('Erro ao carregar contatos:', err)
    } finally {
      setLoading(false)
    }
  }, [empresaId])

  const criarContato = useCallback(async (contato: Omit<Contato, 'id' | 'criado_em' | 'atualizado_em'>) => {
    try {
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('contatos')
        .insert(contato)
        .select()
        .single()

      if (supabaseError) throw supabaseError
      
      setContatos(prev => [...prev, data])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar contato')
      console.error('Erro ao criar contato:', err)
      throw err
    }
  }, [])

  const atualizarContato = useCallback(async (id: string, updates: Partial<Contato>) => {
    try {
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('contatos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) throw supabaseError
      
      setContatos(prev => prev.map(cont => cont.id === id ? data : cont))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar contato')
      console.error('Erro ao atualizar contato:', err)
      throw err
    }
  }, [])

  useEffect(() => {
    carregarContatos()
  }, [carregarContatos])

  return {
    contatos,
    loading,
    error,
    carregarContatos,
    criarContato,
    atualizarContato
  }
}

// Hook para gerenciar conversas
export function useConversas(empresaId?: string) {
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarConversas = useCallback(async () => {
    if (!empresaId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('conversas')
        .select(`
          *,
          contato:contatos(*),
          agente:usuarios(*)
        `)
        .eq('empresa_id', empresaId)
        .order('ultima_mensagem_em', { ascending: false })

      if (supabaseError) throw supabaseError
      
      setConversas(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversas')
      console.error('Erro ao carregar conversas:', err)
    } finally {
      setLoading(false)
    }
  }, [empresaId])

  const criarConversa = useCallback(async (conversa: Omit<Conversa, 'id' | 'criado_em' | 'atualizado_em'>) => {
    try {
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('conversas')
        .insert(conversa)
        .select(`
          *,
          contato:contatos(*),
          agente:usuarios(*)
        `)
        .single()

      if (supabaseError) throw supabaseError
      
      setConversas(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conversa')
      console.error('Erro ao criar conversa:', err)
      throw err
    }
  }, [])

  const atualizarConversa = useCallback(async (id: string, updates: Partial<Conversa>) => {
    try {
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('conversas')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          contato:contatos(*),
          agente:usuarios(*)
        `)
        .single()

      if (supabaseError) throw supabaseError
      
      setConversas(prev => prev.map(conv => conv.id === id ? data : conv))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar conversa')
      console.error('Erro ao atualizar conversa:', err)
      throw err
    }
  }, [])

  useEffect(() => {
    carregarConversas()
  }, [carregarConversas])

  return {
    conversas,
    loading,
    error,
    carregarConversas,
    criarConversa,
    atualizarConversa
  }
}

// Hook para gerenciar mensagens
export function useMensagens(conversaId?: string) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarMensagens = useCallback(async () => {
    if (!conversaId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('mensagens')
        .select('*')
        .eq('conversa_id', conversaId)
        .order('criado_em', { ascending: true })

      if (supabaseError) throw supabaseError
      
      setMensagens(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mensagens')
      console.error('Erro ao carregar mensagens:', err)
    } finally {
      setLoading(false)
    }
  }, [conversaId])

  const enviarMensagem = useCallback(async (mensagem: Omit<Mensagem, 'id' | 'criado_em'>) => {
    try {
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('mensagens')
        .insert(mensagem)
        .select()
        .single()

      if (supabaseError) throw supabaseError
      
      setMensagens(prev => [...prev, data])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem')
      console.error('Erro ao enviar mensagem:', err)
      throw err
    }
  }, [])

  const marcarComoLida = useCallback(async (mensagemId: string) => {
    try {
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('mensagens')
        .update({ lida: true })
        .eq('id', mensagemId)
        .select()
        .single()

      if (supabaseError) throw supabaseError
      
      setMensagens(prev => prev.map(msg => msg.id === mensagemId ? data : msg))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao marcar mensagem como lida')
      console.error('Erro ao marcar mensagem como lida:', err)
      throw err
    }
  }, [])

  useEffect(() => {
    carregarMensagens()
  }, [carregarMensagens])

  return {
    mensagens,
    loading,
    error,
    carregarMensagens,
    enviarMensagem,
    marcarComoLida
  }
} 