# Guia de Configuração do Supabase • +VOZ Madalena

Este projeto foi totalmente estruturado para rodar com o **Supabase** (PostgreSQL em nuvem com Realtime, Auth e Storage).

---

## 🚀 Passo 1: Criar o Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto.
2. Defina o nome do projeto (ex: `voz-madalena`) e uma senha segura para o banco.
3. Escolha a região mais próxima (ex: `South America (São Paulo)`).

---

## 📜 Passo 2: Executar o Script SQL
1. No painel do Supabase, clique em **SQL Editor** no menu lateral esquerdo.
2. Clique em **New Query**.
3. Copie todo o conteúdo do arquivo `supabase/schema.sql` deste projeto e cole no editor.
4. Clique em **Run** (Executar).
5. *(Opcional)* Execute também o arquivo `supabase/seed.sql` para carregar dados iniciais de secretarias e denúncias de exemplo.

---

## 🔑 Passo 3: Configurar as Chaves no `.env` ou Painel de Segredos

No painel do Supabase, vá em **Project Settings > API** e copie:
- **Project URL** (ex: `https://xyzcompany.supabase.co`)
- **anon / public key** (Chave pública para o frontend)
- **service_role key** (Chave privada para o servidor backend)

Adicione no arquivo `.env` (ou no painel Secrets do AI Studio):

```env
# Frontend (Vite)
VITE_SUPABASE_URL="https://SEU_PROJETO.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-chave-anon-publica"

# Backend (Express / Node.js)
SUPABASE_URL="https://SEU_PROJETO.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sua-chave-service-role-privada"
```

---

## ✨ Recursos já integrados no Código:
- ✅ **PostgreSQL Schema**: Tabela `reports` com tipos JSONB para histórico e localização.
- ✅ **Supabase Realtime**: Atualização ao vivo no Painel da Prefeitura e Transparência.
- ✅ **Row Level Security (RLS)**: Leitura pública e submissão anônima/identificada segura.
- ✅ **Storage Bucket**: Bucket `complaint-attachments` para fotos e vídeos da população.
- ✅ **Modo Híbrido Resiliente**: Se as chaves ainda não forem preenchidas, o sistema opera em modo de demonstração local sem travar.
