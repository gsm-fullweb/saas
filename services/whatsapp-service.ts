// Serviço para integração com Evolution API

import { supabase } from "./supabase-client" // Import supabase client

interface EvolutionAPIConfig {
  baseUrl: string
  apiKey: string
  instanceName: string
}

interface WhatsAppMessage {
  number: string
  message: string
  type?: "text" | "image" | "audio" | "video" | "document"
  mediaUrl?: string
}

interface WebhookMessage {
  key: {
    remoteJid: string
    fromMe: boolean
    id: string
  }
  message: {
    conversation?: string
    imageMessage?: {
      caption?: string
      url: string
    }
    audioMessage?: {
      url: string
    }
    videoMessage?: {
      caption?: string
      url: string
    }
    documentMessage?: {
      title?: string
      url: string
    }
  }
  messageTimestamp: number
  pushName?: string
}

export class WhatsAppService {
  private config: EvolutionAPIConfig

  constructor(config: EvolutionAPIConfig) {
    this.config = config
  }

  // Enviar mensagem de texto
  async enviarMensagem(numero: string, mensagem: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/message/sendText/${this.config.instanceName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: this.config.apiKey,
        },
        body: JSON.stringify({
          number: numero,
          text: mensagem,
        }),
      })

      return response.ok
    } catch (error) {
      console.error("Erro ao enviar mensagem WhatsApp:", error)
      return false
    }
  }

  // Enviar mídia
  async enviarMidia(
    numero: string,
    mediaUrl: string,
    caption?: string,
    type: "image" | "audio" | "video" | "document" = "image",
  ): Promise<boolean> {
    try {
      const endpoint = `${this.config.baseUrl}/message/send${type.charAt(0).toUpperCase() + type.slice(1)}/${this.config.instanceName}`

      const body: any = {
        number: numero,
        media: mediaUrl,
      }

      if (caption && (type === "image" || type === "video")) {
        body.caption = caption
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: this.config.apiKey,
        },
        body: JSON.stringify(body),
      })

      return response.ok
    } catch (error) {
      console.error("Erro ao enviar mídia WhatsApp:", error)
      return false
    }
  }

  // Processar webhook de mensagem recebida
  async processarWebhookMensagem(webhookData: WebhookMessage, empresaId: string): Promise<void> {
    try {
      const numero = webhookData.key.remoteJid.replace("@s.whatsapp.net", "")
      const nomeContato = webhookData.pushName || ""

      // Extrair conteúdo da mensagem
      let conteudo = ""
      let tipoMensagem: "texto" | "imagem" | "audio" | "video" | "documento" = "texto"
      let arquivoUrl = ""

      if (webhookData.message.conversation) {
        conteudo = webhookData.message.conversation
      } else if (webhookData.message.imageMessage) {
        conteudo = webhookData.message.imageMessage.caption || "[Imagem]"
        tipoMensagem = "imagem"
        arquivoUrl = webhookData.message.imageMessage.url
      } else if (webhookData.message.audioMessage) {
        conteudo = "[Áudio]"
        tipoMensagem = "audio"
        arquivoUrl = webhookData.message.audioMessage.url
      } else if (webhookData.message.videoMessage) {
        conteudo = webhookData.message.videoMessage.caption || "[Vídeo]"
        tipoMensagem = "video"
        arquivoUrl = webhookData.message.videoMessage.url
      } else if (webhookData.message.documentMessage) {
        conteudo = webhookData.message.documentMessage.title || "[Documento]"
        tipoMensagem = "documento"
        arquivoUrl = webhookData.message.documentMessage.url
      }

      // Buscar ou criar contato
      const { data: contato, error: contatoError } = await supabase
        .from("contatos")
        .upsert(
          {
            empresa_id: empresaId,
            telefone: numero,
            nome: nomeContato || null,
            qualificacao: "lead",
          },
          {
            onConflict: "empresa_id,telefone",
          },
        )
        .select()
        .single()

      if (contatoError) throw contatoError

      // Buscar conversa aberta ou criar nova
      let { data: conversa, error: conversaError } = await supabase
        .from("conversas")
        .select("*")
        .eq("contato_id", contato.id)
        .in("status", ["aberta", "em_andamento"])
        .single()

      if (conversaError && conversaError.code === "PGRST116") {
        // Criar nova conversa
        const { data: novaConversa, error: novaConversaError } = await supabase
          .from("conversas")
          .insert({
            empresa_id: empresaId,
            contato_id: contato.id,
            assunto: `Conversa com ${nomeContato || numero}`,
            status: "aberta",
            prioridade: "media",
            primeira_mensagem_em: new Date().toISOString(),
          })
          .select()
          .single()

        if (novaConversaError) throw novaConversaError
        conversa = novaConversa
      } else if (conversaError) {
        throw conversaError
      }

      // Salvar mensagem
      await supabase.from("mensagens").insert({
        conversa_id: conversa.id,
        remetente_tipo: "cliente",
        conteudo,
        tipo_mensagem: tipoMensagem,
        arquivo_url: arquivoUrl || null,
        whatsapp_message_id: webhookData.key.id,
      })

      // Atualizar conversa
      await supabase
        .from("conversas")
        .update({
          ultima_mensagem_em: new Date().toISOString(),
          status: conversa.status === "fechada" ? "aberta" : conversa.status,
        })
        .eq("id", conversa.id)

      console.log(`Mensagem processada para contato ${numero}`)
    } catch (error) {
      console.error("Erro ao processar webhook:", error)
      throw error
    }
  }

  // Verificar status da instância
  async verificarStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/connectionState/${this.config.instanceName}`, {
        headers: {
          apikey: this.config.apiKey,
        },
      })

      if (!response.ok) return false

      const data = await response.json()
      return data.instance?.state === "open"
    } catch (error) {
      console.error("Erro ao verificar status da instância:", error)
      return false
    }
  }

  // Obter QR Code para conexão
  async obterQRCode(): Promise<string | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/connect/${this.config.instanceName}`, {
        method: "GET",
        headers: {
          apikey: this.config.apiKey,
        },
      })

      if (!response.ok) return null

      const data = await response.json()
      return data.base64 || null
    } catch (error) {
      console.error("Erro ao obter QR Code:", error)
      return null
    }
  }
}

// Instância global do serviço (configurar com variáveis de ambiente)
export const whatsappService = new WhatsAppService({
  baseUrl: import.meta.env.VITE_EVOLUTION_API_URL || "http://localhost:8080",
  apiKey: import.meta.env.VITE_EVOLUTION_API_KEY || "",
  instanceName: import.meta.env.VITE_EVOLUTION_INSTANCE_NAME || "default",
})
