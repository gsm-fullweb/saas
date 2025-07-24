-- Políticas de Row Level Security para o sistema de Times

-- Habilitar RLS nas novas tabelas
ALTER TABLE times ENABLE ROW LEVEL SECURITY;
ALTER TABLE membros_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE atribuicoes_conversas ENABLE ROW LEVEL SECURITY;

-- Políticas para times
CREATE POLICY "Times isolados por empresa" ON times
  FOR ALL USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

-- Políticas para membros_times
CREATE POLICY "Membros de times isolados por empresa" ON membros_times
  FOR ALL USING (
    time_id IN (
      SELECT id FROM times 
      WHERE empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())
    )
  );

-- Políticas para métricas_times
CREATE POLICY "Métricas de times isoladas por empresa" ON metricas_times
  FOR ALL USING (
    time_id IN (
      SELECT id FROM times 
      WHERE empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())
    )
  );

-- Políticas para atribuicoes_conversas
CREATE POLICY "Atribuições isoladas por empresa" ON atribuicoes_conversas
  FOR ALL USING (
    conversa_id IN (
      SELECT id FROM conversas 
      WHERE empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())
    )
  );

-- Política específica para agentes verem apenas suas atribuições
CREATE POLICY "Agentes veem apenas suas atribuições" ON atribuicoes_conversas
  FOR SELECT USING (
    CASE 
      WHEN (SELECT tipo_usuario FROM usuarios WHERE id = auth.uid()) = 'agente'
      THEN usuario_id = auth.uid()
      ELSE conversa_id IN (
        SELECT id FROM conversas 
        WHERE empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())
      )
    END
  );

-- Política para agentes verem apenas times dos quais fazem parte
CREATE POLICY "Agentes veem apenas seus times" ON times
  FOR SELECT USING (
    CASE 
      WHEN (SELECT tipo_usuario FROM usuarios WHERE id = auth.uid()) = 'agente'
      THEN id IN (
        SELECT time_id FROM membros_times 
        WHERE usuario_id = auth.uid() AND ativo = true
      )
      ELSE empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())
    END
  );

-- Política para membros_times - agentes só veem suas próprias participações
CREATE POLICY "Agentes veem apenas suas participações em times" ON membros_times
  FOR SELECT USING (
    CASE 
      WHEN (SELECT tipo_usuario FROM usuarios WHERE id = auth.uid()) = 'agente'
      THEN usuario_id = auth.uid()
      ELSE time_id IN (
        SELECT id FROM times 
        WHERE empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())
      )
    END
  );
