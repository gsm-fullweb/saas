-- Dados iniciais para o sistema de Times

-- Inserir times de exemplo
INSERT INTO times (id, empresa_id, nome, descricao, cor, ativo, gestor_id, configuracoes) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Vendas', 'Equipe responsável por vendas e prospecção de novos clientes', '#10B981', true, '550e8400-e29b-41d4-a716-446655440001', '{"horario_funcionamento": {"inicio": "08:00", "fim": "18:00"}}'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Suporte Técnico', 'Equipe especializada em suporte técnico e resolução de problemas', '#3B82F6', true, '550e8400-e29b-41d4-a716-446655440004', '{"horario_funcionamento": {"inicio": "07:00", "fim": "19:00"}}'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Atendimento Geral', 'Equipe para atendimento geral e triagem de clientes', '#F59E0B', false, '550e8400-e29b-41d4-a716-446655440006', '{"horario_funcionamento": {"inicio": "09:00", "fim": "17:00"}}'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Pós-Vendas', 'Equipe de relacionamento e pós-vendas', '#EC4899', true, '550e8400-e29b-41d4-a716-446655440001', '{"horario_funcionamento": {"inicio": "08:30", "fim": "17:30"}}'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Desenvolvimento', 'Equipe de desenvolvimento e melhorias do produto', '#8B5CF6', true, '550e8400-e29b-41d4-a716-446655440004', '{"horario_funcionamento": {"inicio": "09:00", "fim": "18:00"}}'),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Consultoria', 'Equipe de consultoria especializada', '#14B8A6', true, '550e8400-e29b-41d4-a716-446655440006', '{"horario_funcionamento": {"inicio": "08:00", "fim": "16:00"}}');

-- Inserir membros nos times
INSERT INTO membros_times (time_id, usuario_id, papel, ativo, criado_por) VALUES
-- Time Vendas
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'gestor', true, '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'agente', true, '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'agente', true, '550e8400-e29b-41d4-a716-446655440001'),

-- Time Suporte Técnico
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'gestor', true, '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'agente', true, '550e8400-e29b-41d4-a716-446655440001'),

-- Time Atendimento Geral
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', 'gestor', true, '550e8400-e29b-41d4-a716-446655440001'),

-- Time Pós-Vendas
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'gestor', true, '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'agente', true, '550e8400-e29b-41d4-a716-446655440001'),

-- Time Desenvolvimento
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'gestor', true, '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'agente', true, '550e8400-e29b-41d4-a716-446655440001'),

-- Time Consultoria
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 'gestor', true, '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', 'agente', true, '550e8400-e29b-41d4-a716-446655440001');

-- Atualizar usuários com times padrão
UPDATE usuarios SET time_padrao_id = '550e8400-e29b-41d4-a716-446655440001' WHERE id = '550e8400-e29b-41d4-a716-446655440001'; -- João Silva -> Vendas
UPDATE usuarios SET time_padrao_id = '550e8400-e29b-41d4-a716-446655440001' WHERE id = '550e8400-e29b-41d4-a716-446655440002'; -- Maria Santos -> Vendas
UPDATE usuarios SET time_padrao_id = '550e8400-e29b-41d4-a716-446655440001' WHERE id = '550e8400-e29b-41d4-a716-446655440003'; -- Pedro Costa -> Vendas
UPDATE usuarios SET time_padrao_id = '550e8400-e29b-41d4-a716-446655440002' WHERE id = '550e8400-e29b-41d4-a716-446655440004'; -- Ana Oliveira -> Suporte
UPDATE usuarios SET time_padrao_id = '550e8400-e29b-41d4-a716-446655440002' WHERE id = '550e8400-e29b-41d4-a716-446655440005'; -- Carlos Lima -> Suporte
UPDATE usuarios SET time_padrao_id = '550e8400-e29b-41d4-a716-446655440003' WHERE id = '550e8400-e29b-41d4-a716-446655440006'; -- Roberto Santos -> Atendimento

-- Inserir algumas atribuições de conversas
INSERT INTO atribuicoes_conversas (conversa_id, usuario_id, time_id, tipo_atribuicao, atribuido_por) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'principal', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'principal', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'principal', '550e8400-e29b-41d4-a716-446655440001');

-- Atualizar conversas com times
UPDATE conversas SET time_id = '550e8400-e29b-41d4-a716-446655440001' WHERE id = '550e8400-e29b-41d4-a716-446655440010';
UPDATE conversas SET time_id = '550e8400-e29b-41d4-a716-446655440001' WHERE id = '550e8400-e29b-41d4-a716-446655440011';
UPDATE conversas SET time_id = '550e8400-e29b-41d4-a716-446655440002' WHERE id = '550e8400-e29b-41d4-a716-446655440012';

-- Gerar métricas para os últimos 7 dias para times ativos
DO $$
DECLARE
  time_record RECORD;
  data_atual DATE;
  i INTEGER;
BEGIN
  FOR time_record IN SELECT id FROM times WHERE ativo = true LOOP
    FOR i IN 0..6 LOOP
      data_atual := CURRENT_DATE - i;
      PERFORM calcular_metricas_time(time_record.id, data_atual);
    END LOOP;
  END LOOP;
END $$;
