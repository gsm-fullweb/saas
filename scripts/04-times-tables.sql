-- Criação das tabelas para o sistema de Times

-- Tabela de times
CREATE TABLE times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  cor VARCHAR(7) DEFAULT '#10B981', -- Cor em hexadecimal
  ativo BOOLEAN DEFAULT true,
  gestor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  configuracoes JSONB DEFAULT '{}',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(empresa_id, nome)
);

-- Tabela de relacionamento many-to-many entre usuários e times
CREATE TABLE membros_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  time_id UUID REFERENCES times(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  papel VARCHAR(20) CHECK (papel IN ('gestor', 'agente')) DEFAULT 'agente',
  ativo BOOLEAN DEFAULT true,
  data_entrada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_saida TIMESTAMP WITH TIME ZONE,
  criado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(time_id, usuario_id)
);

-- Tabela de métricas dos times (para relatórios)
CREATE TABLE metricas_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  time_id UUID REFERENCES times(id) ON DELETE CASCADE,
  data_metrica DATE NOT NULL,
  conversas_ativas INTEGER DEFAULT 0,
  conversas_fechadas INTEGER DEFAULT 0,
  tempo_resposta_medio INTEGER DEFAULT 0, -- em minutos
  taxa_resolucao DECIMAL(5,2) DEFAULT 0.00, -- percentual
  satisfacao_media DECIMAL(3,2) DEFAULT 0.00, -- de 0 a 5
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(time_id, data_metrica)
);

-- Tabela de atribuições de conversas (para múltiplos agentes)
CREATE TABLE atribuicoes_conversas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversa_id UUID REFERENCES conversas(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  time_id UUID REFERENCES times(id) ON DELETE SET NULL,
  tipo_atribuicao VARCHAR(20) CHECK (tipo_atribuicao IN ('principal', 'colaborador')) DEFAULT 'principal',
  ativo BOOLEAN DEFAULT true,
  atribuido_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  atribuido_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  removido_em TIMESTAMP WITH TIME ZONE,
  UNIQUE(conversa_id, usuario_id)
);

-- Adicionar colunas às tabelas existentes
ALTER TABLE usuarios ADD COLUMN time_padrao_id UUID REFERENCES times(id) ON DELETE SET NULL;
ALTER TABLE conversas ADD COLUMN time_id UUID REFERENCES times(id) ON DELETE SET NULL;

-- Índices para performance
CREATE INDEX idx_times_empresa_id ON times(empresa_id);
CREATE INDEX idx_times_gestor_id ON times(gestor_id);
CREATE INDEX idx_membros_times_time_id ON membros_times(time_id);
CREATE INDEX idx_membros_times_usuario_id ON membros_times(usuario_id);
CREATE INDEX idx_metricas_times_time_id ON metricas_times(time_id);
CREATE INDEX idx_metricas_times_data ON metricas_times(data_metrica);
CREATE INDEX idx_atribuicoes_conversa_id ON atribuicoes_conversas(conversa_id);
CREATE INDEX idx_atribuicoes_usuario_id ON atribuicoes_conversas(usuario_id);
CREATE INDEX idx_atribuicoes_time_id ON atribuicoes_conversas(time_id);

-- Função para calcular métricas diárias dos times
CREATE OR REPLACE FUNCTION calcular_metricas_time(time_uuid UUID, data_calculo DATE)
RETURNS VOID AS $$
DECLARE
  conversas_ativas_count INTEGER;
  conversas_fechadas_count INTEGER;
  tempo_medio INTEGER;
  taxa_resolucao_calc DECIMAL(5,2);
BEGIN
  -- Contar conversas ativas
  SELECT COUNT(*) INTO conversas_ativas_count
  FROM conversas c
  JOIN atribuicoes_conversas ac ON c.id = ac.conversa_id
  WHERE ac.time_id = time_uuid 
    AND c.status IN ('aberta', 'em_andamento', 'aguardando')
    AND DATE(c.criado_em) = data_calculo;

  -- Contar conversas fechadas
  SELECT COUNT(*) INTO conversas_fechadas_count
  FROM conversas c
  JOIN atribuicoes_conversas ac ON c.id = ac.conversa_id
  WHERE ac.time_id = time_uuid 
    AND c.status = 'fechada'
    AND DATE(c.fechada_em) = data_calculo;

  -- Calcular tempo médio de resposta (simulado)
  tempo_medio := FLOOR(RANDOM() * 10 + 1); -- 1-10 minutos

  -- Calcular taxa de resolução
  IF (conversas_ativas_count + conversas_fechadas_count) > 0 THEN
    taxa_resolucao_calc := (conversas_fechadas_count::DECIMAL / (conversas_ativas_count + conversas_fechadas_count)) * 100;
  ELSE
    taxa_resolucao_calc := 0;
  END IF;

  -- Inserir ou atualizar métricas
  INSERT INTO metricas_times (time_id, data_metrica, conversas_ativas, conversas_fechadas, tempo_resposta_medio, taxa_resolucao, satisfacao_media)
  VALUES (time_uuid, data_calculo, conversas_ativas_count, conversas_fechadas_count, tempo_medio, taxa_resolucao_calc, RANDOM() * 2 + 3)
  ON CONFLICT (time_id, data_metrica) 
  DO UPDATE SET
    conversas_ativas = EXCLUDED.conversas_ativas,
    conversas_fechadas = EXCLUDED.conversas_fechadas,
    tempo_resposta_medio = EXCLUDED.tempo_resposta_medio,
    taxa_resolucao = EXCLUDED.taxa_resolucao,
    satisfacao_media = EXCLUDED.satisfacao_media;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp de atualização
CREATE TRIGGER trigger_times_atualizado_em
  BEFORE UPDATE ON times
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();
