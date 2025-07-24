-- Criação das tabelas principais para a plataforma SaaS de WhatsApp

-- Tabela de empresas (tenants)
CREATE TABLE empresas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  telefone_whatsapp VARCHAR(20),
  logo_url TEXT,
  configuracoes JSONB DEFAULT '{}',
  plano VARCHAR(50) DEFAULT 'basico',
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuários (vinculados às empresas)
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  cargo VARCHAR(100),
  tipo_usuario VARCHAR(20) CHECK (tipo_usuario IN ('gestor', 'agente')) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  ultimo_acesso TIMESTAMP WITH TIME ZONE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contatos
CREATE TABLE contatos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  telefone VARCHAR(20) NOT NULL,
  nome VARCHAR(255),
  email VARCHAR(255),
  qualificacao VARCHAR(20) CHECK (qualificacao IN ('lead', 'cliente', 'spam', 'prospect')) DEFAULT 'lead',
  tags TEXT[],
  observacoes TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(empresa_id, telefone)
);

-- Tabela de conversas/tickets
CREATE TABLE conversas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  contato_id UUID REFERENCES contatos(id) ON DELETE CASCADE,
  agente_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  numero_ticket VARCHAR(20) UNIQUE NOT NULL,
  assunto VARCHAR(255),
  status VARCHAR(20) CHECK (status IN ('aberta', 'em_andamento', 'aguardando', 'fechada')) DEFAULT 'aberta',
  prioridade VARCHAR(20) CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')) DEFAULT 'media',
  canal VARCHAR(20) DEFAULT 'whatsapp',
  primeira_mensagem_em TIMESTAMP WITH TIME ZONE,
  ultima_mensagem_em TIMESTAMP WITH TIME ZONE,
  fechada_em TIMESTAMP WITH TIME ZONE,
  tempo_resposta_medio INTEGER, -- em minutos
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE mensagens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversa_id UUID REFERENCES conversas(id) ON DELETE CASCADE,
  remetente_tipo VARCHAR(20) CHECK (remetente_tipo IN ('cliente', 'agente', 'sistema')) NOT NULL,
  remetente_id UUID, -- ID do usuário se for agente
  conteudo TEXT NOT NULL,
  tipo_mensagem VARCHAR(20) CHECK (tipo_mensagem IN ('texto', 'imagem', 'audio', 'video', 'documento')) DEFAULT 'texto',
  arquivo_url TEXT,
  whatsapp_message_id VARCHAR(255),
  lida BOOLEAN DEFAULT false,
  enviada BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notas internas
CREATE TABLE notas_internas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversa_id UUID REFERENCES conversas(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de transferências de conversa
CREATE TABLE transferencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversa_id UUID REFERENCES conversas(id) ON DELETE CASCADE,
  de_agente_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  para_agente_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  motivo TEXT,
  criado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_usuarios_empresa_id ON usuarios(empresa_id);
CREATE INDEX idx_contatos_empresa_id ON contatos(empresa_id);
CREATE INDEX idx_contatos_telefone ON contatos(telefone);
CREATE INDEX idx_conversas_empresa_id ON conversas(empresa_id);
CREATE INDEX idx_conversas_agente_id ON conversas(agente_id);
CREATE INDEX idx_conversas_status ON conversas(status);
CREATE INDEX idx_mensagens_conversa_id ON mensagens(conversa_id);
CREATE INDEX idx_mensagens_criado_em ON mensagens(criado_em);
CREATE INDEX idx_notas_conversa_id ON notas_internas(conversa_id);

-- Função para gerar número do ticket
CREATE OR REPLACE FUNCTION gerar_numero_ticket()
RETURNS TRIGGER AS $$
BEGIN
  NEW.numero_ticket := 'TK' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(EXTRACT(EPOCH FROM NOW())::INTEGER::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar número do ticket automaticamente
CREATE TRIGGER trigger_gerar_numero_ticket
  BEFORE INSERT ON conversas
  FOR EACH ROW
  EXECUTE FUNCTION gerar_numero_ticket();

-- Função para atualizar timestamp de atualização
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar timestamps
CREATE TRIGGER trigger_empresas_atualizado_em
  BEFORE UPDATE ON empresas
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_usuarios_atualizado_em
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_contatos_atualizado_em
  BEFORE UPDATE ON contatos
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_conversas_atualizado_em
  BEFORE UPDATE ON conversas
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();
