"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth"

interface RealtimeSubscription {
  channel: string
  callback: (payload: any) => void
}

export function useRealtime() {
  const { usuario } = useAuth()
  const [subscriptions, setSubscriptions] = useState<RealtimeSubscription[]>([])

  // Inscrever-se em atualizações de conversas
  const subscribeToConversas = (callback: (payload: any) => void) => {
    if (!usuario) return

    const channel = supabase
      .channel("conversas-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversas",
          filter: `empresa_id=eq.${usuario.empresa_id}`,
        },
        callback,
      )
      .subscribe()

    setSubscriptions((prev) => [...prev, { channel: "conversas-changes", callback }])
    return channel
  }

  // Inscrever-se em atualizações de mensagens
  const subscribeToMensagens = (conversaId: string, callback: (payload: any) => void) => {
    const channel = supabase
      .channel(`mensagens-${conversaId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensagens",
          filter: `conversa_id=eq.${conversaId}`,
        },
        callback,
      )
      .subscribe()

    setSubscriptions((prev) => [...prev, { channel: `mensagens-${conversaId}`, callback }])
    return channel
  }

  // Inscrever-se em atualizações de notas internas
  const subscribeToNotasInternas = (conversaId: string, callback: (payload: any) => void) => {
    const channel = supabase
      .channel(`notas-${conversaId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notas_internas",
          filter: `conversa_id=eq.${conversaId}`,
        },
        callback,
      )
      .subscribe()

    setSubscriptions((prev) => [...prev, { channel: `notas-${conversaId}`, callback }])
    return channel
  }

  // Limpar todas as inscrições
  const unsubscribeAll = () => {
    subscriptions.forEach((sub) => {
      supabase.removeChannel(supabase.getChannels().find((ch) => ch.topic === sub.channel))
    })
    setSubscriptions([])
  }

  useEffect(() => {
    return () => {
      unsubscribeAll()
    }
  }, [])

  return {
    subscribeToConversas,
    subscribeToMensagens,
    subscribeToNotasInternas,
    unsubscribeAll,
  }
}
