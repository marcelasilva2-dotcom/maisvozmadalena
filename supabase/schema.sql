-- ==============================================================================
-- +VOZ MADALENA - ESQUEMA DO BANCO DE DADOS SUPABASE (POSTGRESQL)
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
    
    -- Dados opcionais do cidadão
    citizen_name VARCHAR(150),
    citizen_cpf VARCHAR(20),
    citizen_email VARCHAR(120),
    citizen_phone VARCHAR(30),
    
    -- Histórico de atendimento e comentários
    timeline JSONB DEFAULT '[]'::jsonb,
    comments JSONB DEFAULT '[]'::jsonb,
    solution_photos JSONB DEFAULT '[]'::jsonb,
    solution_date TIMESTAMPTZ,
    assigned_officer VARCHAR(120),
    
    -- Avaliação do cidadão
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
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 4. ÍNDICES DE ALTA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_reports_protocol ON public.reports(protocol);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_secretariat ON public.reports(secretariat_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_location_gin ON public.reports USING GIN (location);

-- 5. TRIGGER AUTOMÁTICO PARA ATUALIZAR updated_at
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

-- 6. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secretariats ENABLE ROW LEVEL SECURITY;

-- 7. POLÍTICAS DE SEGURANÇA (RLS POLICIES)
-- Qualquer cidadão pode consultar denúncias (para transparência e consulta de protocolo)
CREATE POLICY "Leitura pública de relatórios e transparência"
    ON public.reports FOR SELECT
    USING (true);

-- Qualquer cidadão pode inserir uma nova denúncia
CREATE POLICY "Criação pública de denúncias"
    ON public.reports FOR INSERT
    WITH CHECK (true);

-- Cidadãos podem avaliar denúncias resolvidas
CREATE POLICY "Atualização pública de avaliação"
    ON public.reports FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Leitura pública de secretarias
CREATE POLICY "Leitura pública de secretarias"
    ON public.secretariats FOR SELECT
    USING (true);

-- 8. HABILITAR SUPABASE REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;

-- 9. CONFIGURAÇÃO DO BUCKET DE ANEXOS / FOTOS (SUPABASE STORAGE)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('complaint-attachments', 'complaint-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para fotos de denúncia
CREATE POLICY "Acesso público aos anexos de denúncias"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'complaint-attachments');

CREATE POLICY "Envio público de fotos e anexos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'complaint-attachments');
