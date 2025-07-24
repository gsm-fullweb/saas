// Mock do Supabase para demonstração
export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        order: (column: string, options?: any) => ({
          single: () => Promise.resolve({ data: null, error: null }),
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
        }),
        in: (values: any[]) => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
    upsert: (data: any, options?: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  }),
  channel: (name: string) => ({
    on: (event: string, options: any, callback: Function) => ({
      subscribe: () => ({ unsubscribe: () => {} }),
    }),
  }),
  removeChannel: (channel: any) => {},
  getChannels: () => [],
}

// Tipos TypeScript para o banco de dados
export interface Empresa {
  id: string
  nome: string
  slug: string
  telefone_whatsapp?: string
  logo_url?: string
  configuracoes: Record<string, any>
  plano: string
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export interface Usuario {
  id: string
  empresa_id: string
  email: string
  nome: string
  avatar_url?: string
  cargo?: string
  tipo_usuario: "gestor" | "agente"
  ativo: boolean
  ultimo_acesso?: string
  criado_em: string
  atualizado_em: string
}

export interface Contato {
  id: string
  empresa_id: string
  telefone: string
  nome?: string
  email?: string
  qualificacao: "lead" | "cliente" | "spam" | "prospect"
  tags?: string[]
  observacoes?: string
  criado_em: string
  atualizado_em: string
}

export interface Conversa {
  id: string
  empresa_id: string
  contato_id: string
  agente_id?: string
  numero_ticket: string
  assunto?: string
  status: "aberta" | "em_andamento" | "aguardando" | "fechada"
  prioridade: "baixa" | "media" | "alta" | "urgente"
  canal: string
  primeira_mensagem_em?: string
  ultima_mensagem_em?: string
  fechada_em?: string
  tempo_resposta_medio?: number
  criado_em: string
  atualizado_em: string
  contato?: Contato
  agente?: Usuario
}

export interface Mensagem {
  id: string
  conversa_id: string
  remetente_tipo: "cliente" | "agente" | "sistema"
  remetente_id?: string
  conteudo: string
  tipo_mensagem: "texto" | "imagem" | "audio" | "video" | "documento"
  arquivo_url?: string
  whatsapp_message_id?: string
  lida: boolean
  enviada: boolean
  criado_em: string
}

export interface NotaInterna {
  id: string
  conversa_id: string
  usuario_id: string
  conteudo: string
  criado_em: string
  usuario?: Usuario
}
