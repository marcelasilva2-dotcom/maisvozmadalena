-- ==============================================================================
-- +VOZ MADALENA - DADOS INICIAIS (SEED DATA)
-- Prefeitura Municipal de Madalena - Ceará
-- ==============================================================================

-- Inserir secretarias municipais oficiais
INSERT INTO public.secretariats (id, name, description, icon_name, color, responsible_name, email, phone)
VALUES 
('infraestrutura', 'Secretaria de Infraestrutura e Obras', 'Responsável pela manutenção de vias, calçamentos, asfalto, pontes e reformas públicas.', 'Hammer', '#0F8A43', 'Eng. João Carlos Menezes', 'infraestrutura@madalena.ce.gov.br', '(88) 3442-1201'),
('saude', 'Secretaria Municipal de Saúde', 'Gestão dos Postos de Saúde (PSF), Hospital Municipal, distribuição de remédios e vigilância sanitária.', 'HeartPulse', '#E11D48', 'Dra. Maria Helena Castro', 'saude@madalena.ce.gov.br', '(88) 3442-1202'),
('educacao', 'Secretaria de Educação e Cultura', 'Administração de escolas municipais, creches, transporte escolar, merenda e eventos pedagógicos.', 'GraduationCap', '#2563EB', 'Prof. Francisco Antunes', 'educacao@madalena.ce.gov.br', '(88) 3442-1203'),
('limpeza_urbana', 'Setor de Limpeza Pública e Coleta', 'Coleta de lixo residencial, descarte de entulhos, capinação e varrição de praças.', 'Trash2', '#059669', 'Manoel Vieira dos Santos', 'limpeza@madalena.ce.gov.br', '(88) 3442-1204'),
('iluminacao_publica', 'Setor de Iluminação Pública', 'Troca de lâmpadas queimadas, manutenção de postes e expansão de luminárias de LED.', 'Lightbulb', '#D97706', 'Raimundo Nonato Silva', 'iluminacao@madalena.ce.gov.br', '(88) 3442-1205'),
('meio_ambiente', 'Secretaria de Meio Ambiente e Recursos Hídricos', 'Poda e controle de árvores, fiscalização de queimadas, preservação de açudes e fauna.', 'Leaf', '#16A34A', 'Bióloga Renata Bezerra', 'meioambiente@madalena.ce.gov.br', '(88) 3442-1206'),
('agricultura', 'Secretaria de Agricultura e Pecuária', 'Apoio ao produtor rural, abastecimento de água, corte de terra e recuperação de estradas vicinais.', 'Tractor', '#CA8A04', 'José Valdir Ferreira', 'agricultura@madalena.ce.gov.br', '(88) 3442-1207'),
('assistencia_social', 'Secretaria de Assistência Social e Cidadania', 'Programas sociais, CRAS, CREAS, Cadastro Único e apoio a famílias em vulnerabilidade.', 'Users', '#9333EA', 'Socorro Albuquerque', 'assistenciasocial@madalena.ce.gov.br', '(88) 3442-1208'),
('seguranca', 'Guarda Civil Municipal e Trânsito', 'Segurança preventiva, patrulhamento comunitário e fiscalização de trânsito em Madalena.', 'Shield', '#0284C7', 'Comandante Marcos Paulo Lima', 'seguranca@madalena.ce.gov.br', '(88) 3442-1209'),
('ouvidoria', 'Ouvidoria Geral do Município', 'Canal oficial de escuta do cidadão para elogios, denúncias contra servidores e transparência pública.', 'MessageSquare', '#475569', 'Dr. Paulo Rogério Chaves', 'ouvidoria@madalena.ce.gov.br', '(88) 3442-1200')
ON CONFLICT (id) DO NOTHING;

-- Inserir exemplos de denúncias iniciais para o painel de transparência
INSERT INTO public.reports (
    protocol, type, secretariat_id, category, description, location, status, citizen_name,
    timeline, comments, created_at, updated_at
)
VALUES
(
    'MVM-2026-894120',
    'identificada',
    'iluminacao_publica',
    'iluminacao',
    'Três lâmpadas queimadas consecutivas na Rua Padre Cícero, deixando o trecho próximo à praça muito escuro e perigoso.',
    '{"address": "Rua Padre Cícero, 340 - Centro", "neighborhood": "Centro", "lat": -4.8042, "lng": -39.5768}'::jsonb,
    'resolvida',
    'Antônio Carlos Bezerra',
    '[
        {"id": "t-1", "status": "recebida", "date": "2026-02-10T14:30:00Z", "title": "Denúncia Registrada", "description": "Denúncia registrada via aplicativo +VOZ.", "author": "Antônio Carlos"},
        {"id": "t-2", "status": "encaminhada", "date": "2026-02-11T09:00:00Z", "title": "Encaminhada à Equipe Elétrica", "description": "Ordem de serviço 402 gerada para a equipe de plantão.", "author": "Ouvidoria Geral"},
        {"id": "t-3", "status": "resolvida", "date": "2026-02-12T16:45:00Z", "title": "Lâmpadas Substituídas por LED", "description": "Realizada a troca das 3 luminárias por lâmpadas de LED de alta eficiência.", "author": "Setor de Iluminação"}
    ]'::jsonb,
    '[
        {"id": "c-1", "author": "Setor de Iluminação", "role": "Técnico Responsável", "text": "Serviço executado com sucesso no dia 12/02.", "date": "2026-02-12T16:46:00Z"}
    ]'::jsonb,
    '2026-02-10T14:30:00Z',
    '2026-02-12T16:46:00Z'
),
(
    'MVM-2026-745812',
    'anonima',
    'infraestrutura',
    'buraco',
    'Buraco profundo aberto no calçamento após as últimas chuvas, dificultando a passagem de motos e carros.',
    '{"address": "Avenida Antônio Costa, próx. ao mercadinho - São José", "neighborhood": "Bairro São José", "lat": -4.8095, "lng": -39.5721}'::jsonb,
    'em_atendimento',
    NULL,
    '[
        {"id": "t-4", "status": "recebida", "date": "2026-02-13T10:15:00Z", "title": "Denúncia Recebida", "description": "Registro anônimo recebido.", "author": "Sistema +VOZ"},
        {"id": "t-5", "status": "em_atendimento", "date": "2026-02-14T08:30:00Z", "title": "Equipe de Obras no Local", "description": "Equipe de calceteiros iniciou o nivelamento e reposição das pedras.", "author": "Sec. Infraestrutura"}
    ]'::jsonb,
    '[]'::jsonb,
    '2026-02-13T10:15:00Z',
    '2026-02-14T08:30:00Z'
),
(
    'MVM-2026-612984',
    'identificada',
    'limpeza_urbana',
    'entulho',
    'Acúmulo de galhos e entulho de poda na calçada impedindo a passagem de pedestres e cadeirantes.',
    '{"address": "Rua Raimundo Vieira da Silva, 112 - Alto da Boa Vista", "neighborhood": "Alto da Boa Vista", "lat": -4.8012, "lng": -39.5810}'::jsonb,
    'em_analise',
    'Maria de Fátima Sousa',
    '[
        {"id": "t-6", "status": "recebida", "date": "2026-02-15T11:00:00Z", "title": "Denúncia Registrada", "description": "Protocolo gerado.", "author": "Maria de Fátima"},
        {"id": "t-7", "status": "em_analise", "date": "2026-02-15T14:20:00Z", "title": "Em Triagem", "description": "Agendamento da caçamba e equipe de remoção.", "author": "Setor de Limpeza"}
    ]'::jsonb,
    '[]'::jsonb,
    '2026-02-15T11:00:00Z',
    '2026-02-15T14:20:00Z'
)
ON CONFLICT (protocol) DO NOTHING;
