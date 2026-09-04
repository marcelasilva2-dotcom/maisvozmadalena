# ⚙️ Especificação Técnica e Arquitetura de Software
## Plataforma: +VOZ Madalena

---

### 1. Visão Geral da Arquitetura

O sistema foi concebido sob o paradigma **Full-Stack Híbrido e Resiliente**, combinando um Frontend SPA reativo em **React 18 + Vite + TypeScript** com backend de intermediação segura em **Node.js / Express**, integração com a **API Google Gemini Flash** para processamento de linguagem natural e camada de persistência em **Supabase / LocalStorage / Memory Fallback**.

```
                           +VOZ MADALENA
                     ARQUITETURA DO SISTEMA
                     
 [ Cidadão (Mobile/Desktop) ]       [ Painel Admin (Ouvidoria) ]
             │                                   │
             ▼                                   ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                     FRONTEND CLIENT                         │
 │  • React 18 + TypeScript + Vite                             │
 │  • Tailwind CSS (Design System Verde Municipal #0F8A43)     │
 │  • Lucide React (Iconografia Semântica)                     │
 │  • Leaflet & OpenStreetMap (Mapa Geográfico de Madalena)    │
 │  • Service Worker + PWA Manifest (Instalação e Cache)       │
 └──────────────────────────────┬──────────────────────────────┘
                                │ HTTP / JSON
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                      BACKEND SERVER                         │
 │  • Node.js + Express API Router (`/api/*`)                  │
 │  • Proxy Seguro de Autenticação e Chaves                    │
 │  • Endpoint de Triagem por IA (`/api/classify`)             │
 └──────────────┬──────────────────────────────┬───────────────┘
                │                              │
                ▼                              ▼
 ┌───────────────────────────┐   ┌─────────────────────────────┐
 │      MOTOR DE IA          │   │     BANCO DE DADOS          │
 │  Google GenAI SDK         │   │  Supabase Cloud Database    │
 │  Modelo: Gemini 2.5 Flash │   │  LocalStorage Resiliente    │
 │  (Triagem e Urgência)     │   │  (70+ Localidades Auditadas)│
 └───────────────────────────┘   └─────────────────────────────┘
```

---

### 2. Stack Tecnológica

| Camada | Tecnologia | Justificativa Técnica |
| :--- | :--- | :--- |
| **Linguagem Principal** | **TypeScript 5.x** | Tipagem estática rigorosa para prevenir falhas de runtime e garantir consistência nos modelos de dados de denúncias e localidades. |
| **Biblioteca de UI** | **React 18** | Reatividade declarativa, arquitetura de componentes modulares e excelente desempenho em dispositivos móveis populares. |
| **Build Tool** | **Vite** | Empacotamento ultrarrápido, otimização automática de assets e geração de bundles estáticos leves. |
| **Estilização** | **Tailwind CSS v4** | Utilitários modernos, design responsivo "Mobile-First", paleta institucional de Madalena e ausência de overhead de CSS não utilizado. |
| **Georreferenciamento** | **Leaflet + OpenStreetMap** | Solução open-source de mapeamento leve, que dispensa cobrança de licenças corporativas para a prefeitura e possui suporte fluido a mapas táticos e marcadores customizados. |
| **Inteligência Artificial** | **@google/genai (Gemini 2.5 Flash)** | Modelo de última geração com latência ultrabaixa, excelente compreensão do português falado no Ceará e inferência de contextos municipais. |
| **Camada de Servidor** | **Express (Node.js)** | Rotas intermediárias de API para segurança de credenciais, blindando segredos governamentais contra acesso via DevTools do navegador. |
| **Ícones** | **Lucide React** | Biblioteca unificada de ícones SVG escaláveis e semânticos. |

---

### 3. Modelo de Dados Principal (Entidades TypeScript)

#### 3.1. Entidade Report (Ocorrência / Denúncia)
```typescript
export interface Report {
  id: string;                      // Identificador único (ex: rep-1741123456789)
  protocol: string;                // Protocolo cívico formatado (ex: MVM-2026-894210)
  type: 'anonima' | 'identificada';// Modalidade de denúncia
  secretariatId: string;           // Secretaria vinculada (ex: infraestrutura, saude)
  category: string;                // Categoria da demanda (ex: iluminacao, buraco)
  customCategory?: string;         // Categoria livre (quando category === 'outro')
  description: string;             // Relato do morador
  attachments: Attachment[];       // Fotos, vídeos e áudios
  location: {
    address: string;               // Endereço completo formatado
    street?: string;               // Logradouro
    number?: string;               // Número
    complement?: string;           // Complemento
    neighborhood: string;          // Nome da localidade ou bairro
    cep?: string;                  // CEP do município (63860-000)
    reference?: string;            // Ponto de referência na zona rural
    lat: number;                   // Latitude geográfica
    lng: number;                   // Longitude geográfica
  };
  createdAt: string;               // Data de abertura (ISO 8601)
  updatedAt: string;               // Última movimentação (ISO 8601)
  status: 'recebida' | 'encaminhada' | 'em_atendimento' | 'resolvida';
  citizenName?: string;            // Nome (se identificada)
  citizenCpf?: string;             // CPF (se identificada)
  citizenEmail?: string;           // E-mail para notificação
  citizenPhone?: string;           // WhatsApp para notificação
  timeline: TimelineItem[];        // Histórico de alterações públicas
  comments: ReportComment[];       // Comentários da ouvidoria
  solutionPhotos?: string[];       // Fotografias do serviço concluído pela equipe
  assignedOfficer?: string;        // Servidor ou equipe responsável
  rating?: number;                 // Nota do cidadão (1 a 5 estrelas)
  citizenFeedback?: string;        // Opinião do cidadão sobre o atendimento
}
```

#### 3.2. Entidade MadalenaLocality (Malha Territorial)
```typescript
export interface MadalenaLocality {
  id?: string;
  name: string;                    // Nome oficial da comunidade/bairro
  district: string;                // Distrito de vinculação (Sede, Macaoca, etc.)
  zone: 'Urbano' | 'Rural' | 'Povoado' | 'Assentamento' | 'Distrito';
  details?: string;                // Nota descritiva (ex: "Assentamento PA", "Vila")
  subgroup?: string;               // Agrupamento interno
  lat?: number;                    // Coordenada Latitude
  lng?: number;                    // Coordenada Longitude
}
```

---

### 4. Inteligência Artificial: Pipeline de Triagem Cívica

O sistema utiliza a rota `/api/classify` hospedada no backend para intermediar as solicitações:
1. O texto ou transcrição de áudio do cidadão é enriquecido com o contexto de Madalena - CE.
2. O modelo **Gemini 2.5 Flash** processa o texto através de um prompt de engenharia cívica estruturado:
   - Identifica a **Secretaria Responsável** mais adequada com base nas atribuições legais da Prefeitura de Madalena.
   - Detecta o nível de **Urgência** (Baixa, Média, Alta, Crítica) considerando riscos à vida, saúde pública e prejuízo ao transporte escolar.
   - Gera um **Resumo Executivo** para os fiscais da prefeitura.
3. A resposta retorna em formato JSON estrito para autopreencher os seletores na interface do morador, que mantém a liberdade de confirmar ou alterar a sugestão da IA.

---

### 5. Segurança, Resiliência e Conformidade Legal

1. **Blindagem de Chaves de API:** A chave de API do Gemini (`GEMINI_API_KEY`) é mantida exclusivamente no ambiente de servidor em tempo de execução, jamais trafegando nas requisições do navegador do usuário.
2. **Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018):**
   - Dados sensíveis do cidadão (CPF, telefone, e-mail) não são exibidos na consulta pública aberta de protocolos nem nos marcadores do mapa geral.
   - O modo anônimo permite ao cidadão fiscalizar sem sofrer qualquer tipo de represália local.
3. **Persistência Híbrida e Local:** Caso haja interrupção temporária de conexão com o banco de dados remoto ou sinal de operadora móvel instável em áreas de serra, o sistema utiliza o motor de cache e sincronização local para reter as alterações até que a conexão seja restabelecida.
