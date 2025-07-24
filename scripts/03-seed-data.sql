-- Dados de exemplo para desenvolvimento

-- Inserir empresa de exemplo
INSERT INTO empresas (id, nome, slug, telefone_whatsapp, plano) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'TechSolutions Ltda', 'techsolutions', '+5511999887766', 'premium');

-- Inserir usuários de exemplo
INSERT INTO usuarios (id, empresa_id, email, nome, tipo_usuario) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'gestor@techsolutions.com', 'Maria Silva', 'gestor'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'agente1@techsolutions.com', 'João Santos', 'agente'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'agente2@techsolutions.com', 'Ana Costa', 'agente');

-- Inserir contatos de exemplo
INSERT INTO contatos (empresa_id, telefone, nome, qualificacao) VALUES
('550e8400-e29b-41d4-a716-446655440000', '+5511987654321', 'Carlos Oliveira', 'cliente'),
('550e8400-e29b-41d4-a716-446655440000', '+5511876543210', 'Fernanda Lima', 'lead'),
('550e8400-e29b-41d4-a716-446655440000', '+5511765432109', 'Roberto Alves', 'prospect');

-- Inserir conversas de exemplo
INSERT INTO conversas (empresa_id, contato_id, agente_id, assunto, status, prioridade) VALUES
('550e8400-e29b-41d4-a716-446655440000', 
 (SELECT id FROM contatos WHERE telefone = '+5511987654321'), 
 '550e8400-e29b-41d4-a716-446655440002', 
 'Dúvida sobre produto', 'em_andamento', 'alta'),
('550e8400-e29b-41d4-a716-446655440000', 
 (SELECT id FROM contatos WHERE telefone = '+5511876543210'), 
 '550e8400-e29b-41d4-a716-446655440003', 
 'Solicitação de orçamento', 'aberta', 'media');
