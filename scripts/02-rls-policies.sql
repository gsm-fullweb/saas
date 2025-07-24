-- Habilitação do Row Level Security (RLS) para isolamento multi-tenant

-- Habilitar RLS em todas as tabelas
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas_internas ENABLE ROW LEVEL SECURITY;
ALTER TABLE transferencias ENABLE ROW LEVEL SECURITY;

-- Políticas para empresas
CREATE POLICY "Empresas podem ver apenas seus próprios dados" ON empresas
  FOR ALL USING (id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

-- Políticas para usuários
CREATE POLICY "Usuários podem ver apenas colegas da mesma empresa" ON usuarios
  FOR ALL USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

-- Políticas para contatos
CREATE POLICY "Contatos isolados por empresa" ON contatos
  FOR ALL USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

-- Políticas para conversas
CREATE POLICY "Conversas isoladas por empresa" ON conversas
  FOR ALL USING (empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid()));

-- Política específica para agentes (só veem suas conversas)
CREATE POLICY "Agentes veem apenas suas conversas" ON conversas
  FOR SELECT USING (
    CASE 
      WHEN (SELECT tipo_usuario FROM usuarios WHERE id = auth.uid()) = 'agente'
      THEN agente_id = auth.uid()
      ELSE empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())
    END
  );

-- Políticas para mensagens
CREATE POLICY "Mensagens isoladas por empresa" ON mensagens
  FOR ALL USING (
    conversa_id IN (
      SELECT id FROM conversas 
      WHERE empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())
    )
  );

-- Políticas para notas internas
CREATE POLICY "Notas internas isoladas por empresa" ON notas_internas
  FOR ALL USING (
    conversa_id IN (
      SELECT id FROM conversas 
      WHERE empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())
    )
  );

-- Políticas para transferências
CREATE POLICY "Transferências isoladas por empresa" ON transferencias
  FOR ALL USING (
    conversa_id IN (
      SELECT id FROM conversas 
      WHERE empresa_id = (SELECT empresa_id FROM usuarios WHERE id = auth.uid())
    )
  );
