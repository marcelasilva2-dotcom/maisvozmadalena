-- ==============================================================================
-- +VOZ MADALENA - ESQUEMA DO BANCO DE DADOS SUPABASE (POSTGRESQL + STORAGE)
-- Prefeitura Municipal de Madalena - Ceará
-- ==============================================================================

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA PRINCIPAL DE DENÚNCIAS / RECLAMAÇÕES (REPORTS)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocol VARCHAR(32) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL DEFAULT 'anonima' CHECK (type IN ('identificada', 'anonima')),
    secretariat_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    custom_category VARCHAR(100),
    description TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    location JSONB NOT NULL DEFAULT '{"address": "Madalena - CE", "neighborhood": "Centro", "lat": -4.8042, "lng": -39.5768}'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'recebida' CHECK (status IN ('recebida', 'em_analise', 'encaminhada', 'em_atendimento', 'resolvida')),
    
    -- Dados opcionais do cidadão (Sob sigilo da LGPD Lei 13.709/2018)
    citizen_name VARCHAR(150),
    citizen_cpf VARCHAR(20),
    citizen_email VARCHAR(120),
    citizen_phone VARCHAR(30),
    
    -- Histórico de atendimento, despacho e comentários operacionais
    timeline JSONB DEFAULT '[]'::jsonb,
    comments JSONB DEFAULT '[]'::jsonb,
    solution_photos JSONB DEFAULT '[]'::jsonb,
    solution_date TIMESTAMPTZ,
    assigned_officer VARCHAR(120),
    
    -- Avaliação do cidadão sobre o serviço executado
    rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
    rating_feedback TEXT,
    
    -- Metadados de auditoria
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABELA DE SECRETARIAS MUNICIPAIS
CREATE TABLE IF NOT EXISTS public.secretariats (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    color VARCHAR(20),
    responsible_name VARCHAR(150),
    email VARCHAR(120),
    phone VARCHAR(30),
    address VARCHAR(255),
    sla_days INT DEFAULT 5,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Garantir colunas caso a tabela já existisse previamente
ALTER TABLE public.secretariats ADD COLUMN IF NOT EXISTS address VARCHAR(255);
ALTER TABLE public.secretariats ADD COLUMN IF NOT EXISTS sla_days INT DEFAULT 5;
ALTER TABLE public.secretariats ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- 4. TABELA DE LOCALIDADES E BAIRROS OFICIAIS DE MADALENA (MAPEAMENTO IPECE)
CREATE TABLE IF NOT EXISTS public.localities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL UNIQUE,
    district VARCHAR(100) NOT NULL,
    zone VARCHAR(50) NOT NULL DEFAULT 'Rural',
    details TEXT,
    subgroup VARCHAR(100),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 5. ÍNDICES DE ALTA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_reports_protocol ON public.reports(protocol);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_secretariat ON public.reports(secretariat_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_location_gin ON public.reports USING GIN (location);
CREATE INDEX IF NOT EXISTS idx_localities_district ON public.localities(district);

-- 6. TRIGGER AUTOMÁTICO PARA ATUALIZAR updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_reports_updated_at ON public.reports;
CREATE TRIGGER set_reports_updated_at
    BEFORE UPDATE ON public.reports
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS set_localities_updated_at ON public.localities;
CREATE TRIGGER set_localities_updated_at
    BEFORE UPDATE ON public.localities
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- 7. HABILITAR ROW LEVEL SECURITY (RLS) NAS TABELAS PÚBLICAS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secretariats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.localities ENABLE ROW LEVEL SECURITY;

-- 8. POLÍTICAS DE SEGURANÇA IDEMPOTENTES (RLS POLICIES)

-- Políticas de Reports
DROP POLICY IF EXISTS "Leitura pública de relatórios e transparência" ON public.reports;
CREATE POLICY "Leitura pública de relatórios e transparência"
    ON public.reports FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Criação pública de denúncias" ON public.reports;
CREATE POLICY "Criação pública de denúncias"
    ON public.reports FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Atualização pública de avaliação" ON public.reports;
DROP POLICY IF EXISTS "Atualização e despacho de denúncias" ON public.reports;
CREATE POLICY "Atualização e despacho de denúncias"
    ON public.reports FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Políticas de Secretariats
DROP POLICY IF EXISTS "Leitura pública de secretarias" ON public.secretariats;
CREATE POLICY "Leitura pública de secretarias"
    ON public.secretariats FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Modificação de secretarias" ON public.secretariats;
CREATE POLICY "Modificação de secretarias"
    ON public.secretariats FOR ALL
    USING (true)
    WITH CHECK (true);

-- Políticas de Localidades
DROP POLICY IF EXISTS "Leitura pública de localidades" ON public.localities;
CREATE POLICY "Leitura pública de localidades"
    ON public.localities FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Gerenciamento de localidades" ON public.localities;
CREATE POLICY "Gerenciamento de localidades"
    ON public.localities FOR ALL
    USING (true)
    WITH CHECK (true);

-- 9. HABILITAR SUPABASE REALTIME DE FORMA SEGURA
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'reports'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
    END IF;
END $$;

-- ==============================================================================
-- 10. CONFIGURAÇÃO COMPLETA DO SUPABASE STORAGE (FOTOS, ÁUDIOS E VÍDEOS)
-- ==============================================================================

-- Criar ou atualizar o bucket 'complaint-attachments' como PÚBLICO
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'complaint-attachments', 
    'complaint-attachments', 
    true,
    52428800, -- Limite de 50MB por arquivo (fotos de alta resolução, vídeos e depoimentos em áudio)
    ARRAY[
        'image/jpeg', 
        'image/jpg',
        'image/png', 
        'image/webp', 
        'image/gif', 
        'image/svg+xml',
        'video/mp4', 
        'video/webm', 
        'video/quicktime', 
        'audio/webm', 
        'audio/mp3', 
        'audio/mpeg', 
        'audio/ogg', 
        'audio/wav',
        'application/pdf'
    ]
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY[
        'image/jpeg', 
        'image/jpg', 
        'image/png', 
        'image/webp', 
        'image/gif', 
        'image/svg+xml', 
        'video/mp4', 
        'video/webm', 
        'video/quicktime', 
        'audio/webm', 
        'audio/mp3', 
        'audio/mpeg', 
        'audio/ogg', 
        'audio/wav', 
        'application/pdf'
    ];

-- NOTA IMPORTANTE: A tabela storage.objects já possui RLS ativado nativamente pelo Supabase
-- e pertence ao papel do sistema (supabase_storage_admin). Portanto, NÃO execute
-- "ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY", pois isso gera o erro 42501.

-- Políticas de Acesso para os Objetos do Bucket 'complaint-attachments'
-- (Exclui versões antigas antes de recriar para permitir execução idempotente sem erros)

-- 1. Leitura Pública: permite que cidadãos vejam as fotos no portal de transparência e consulta de protocolo
DROP POLICY IF EXISTS "Acesso público aos anexos de denúncias" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Acesso público aos anexos de denúncias"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'complaint-attachments');

-- 2. Envio Público (INSERT): permite upload de fotos de denúncia e fotos de solução concluída
DROP POLICY IF EXISTS "Envio público de fotos e anexos" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Uploads" ON storage.objects;
CREATE POLICY "Envio público de fotos e anexos"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'complaint-attachments');

-- 3. Atualização (UPDATE): permite atualizar arquivos no bucket se necessário
DROP POLICY IF EXISTS "Atualização pública de fotos e anexos" ON storage.objects;
CREATE POLICY "Atualização pública de fotos e anexos"
    ON storage.objects FOR UPDATE
    TO public
    USING (bucket_id = 'complaint-attachments')
    WITH CHECK (bucket_id = 'complaint-attachments');

-- 4. Exclusão (DELETE): gestão interna de arquivos
DROP POLICY IF EXISTS "Exclusão de fotos e anexos" ON storage.objects;
CREATE POLICY "Exclusão de fotos e anexos"
    ON storage.objects FOR DELETE
    TO public
    USING (bucket_id = 'complaint-attachments');
