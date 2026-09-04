# 📋 PRD – Product Requirements Document (Documento de Requisitos)
## Plataforma: +VOZ Madalena

---

### 1. Visão Geral do Produto

O **+VOZ Madalena** é um aplicativo web progressivo (PWA) de ouvidoria municipal e cidadania ativa, projetado especificamente para as particularidades territoriais, sociais e culturais do município de Madalena - CE. A aplicação conecta os cidadãos diretamente às Secretarias Municipais competentes e à Câmara Municipal, com triagem automatizada via Inteligência Artificial, suporte nativo a gravação de áudio e geolocalização exata de ocorrências.

---

### 2. Personas do Sistema

#### Persona 1: Dona Francisca (Cidadã da Zona Rural)
- **Perfil:** 54 anos, agricultora familiar residente na localidade de *Brejo* (Distrito de Macaoca), a 28 km da Sede.
- **Dores:** A estrada vicinal está com valetas causadas pelas chuvas, impedindo a passagem da van escolar de seus netos. Dona Francisca tem baixa escolaridade e receio de preencher cadastros difíceis.
- **Como o +VOZ a ajuda:** Ela clica em "Nova Demanda", escolhe o modo Anônimo, aperta o botão de microfone e grava um áudio de 40 segundos relatando o problema. O sistema captura sua localização e envia a solicitação diretamente à Secretaria de Infraestrutura.

#### Persona 2: Lucas (Jovem Cidadão da Área Urbana)
- **Perfil:** 19 anos, estudante universitário morador do bairro *Santana* (Sede de Madalena).
- **Dores:** Há um vazamento de água e entulho acumulado em frente ao posto de saúde do bairro. Ele quer acompanhar formalmente a denúncia e receber atualizações.
- **Como o +VOZ o ajuda:** Registra no modo identificado com e-mail/WhatsApp, anexa fotos e recebe o protocolo `MVM-2026-XXXXXX`. Quando a equipe da Prefeitura conserta o cano e publica a foto da solução, Lucas recebe o aviso e avalia o atendimento com 5 estrelas.

#### Persona 3: Dr. Vicente (Ouvidor Geral e Servidor Público Municipal)
- **Perfil:** 42 anos, responsável pela triagem das demandas na Prefeitura de Madalena.
- **Dores:** Recebia denúncias desorganizadas por WhatsApp pessoal de vereadores e bilhetes em papel sem foto nem ponto de referência claro.
- **Como o +VOZ o ajuda:** Acessa o Painel Administrativo com filtros avançados por distrito e secretaria, visualiza as fotos enviadas, os relatórios em CSV e controla os prazos de SLA (3 a 5 dias), enviando ordens de serviço diretamente para as equipes de campo.

---

### 3. Requisitos Funcionais (RF)

| Código | Requisito Funcional | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| **RF01** | Escolha do Tipo de Registro | O cidadão pode optar entre registro **Anônimo** (sem identificação) ou **Identificado** (com nome, CPF, e-mail e telefone para notificações). | Essencial |
| **RF02** | Formulário Guiado Passo a Passo | O envio de demandas é organizado em 5 etapas pedagógicas claras: Secretaria, Categoria, Relato/Descrição, Anexos e Localização. | Essencial |
| **RF03** | Gravação de Depoimento por Áudio | O aplicativo permite gravar mensagens de voz pelo navegador sem exigir digitação de texto longo. | Alta |
| **RF04** | Anexo de Mídias Múltiplas | Suporte para upload de fotos (JPG, PNG), vídeos curtos (MP4) e documentos com pré-visualização em tempo real. | Alta |
| **RF05** | Assistência por Inteligência Artificial | Botão "+VOZ IA" que analisa o relato do morador, sugere a secretaria responsável, a subcategoria e o nível de urgência (baixa, média, alta, crítica). | Alta |
| **RF06** | Mapeamento Territorial de Madalena | Catálogo oficial dos 6 distritos e mais de 70 localidades, povoados, assentamentos e fazendas, com auto-preenchimento de coordenadas. | Essencial |
| **RF07** | Opção para Fazendas Não Listadas | Campo livre caso o morador resida em propriedade rural não constante na lista oficial, vinculando-a ao distrito de referência mais próximo. | Média |
| **RF08** | Geração de Protocolo Único | Cada demanda gera um código padronizado (ex: `MVM-2026-104928`) com cópia em 1 clique e comprovante para download. | Essencial |
| **RF09** | Consulta Pública de Protocolo | Tela de consulta rápida onde qualquer cidadão insere o protocolo e visualiza o histórico cronológico de atendimento (linha do tempo). | Essencial |
| **RF10** | Avaliação do Cidadão (Nota e Feedback) | Quando o chamado atinge o status "Resolvida", o cidadão pode avaliar o serviço com nota de 1 a 5 estrelas e comentário. | Média |
| **RF11** | Painel Administrativo da Ouvidoria | Área de acesso restrito com estatísticas gerais, visualização de ocorrências, alteração de status e inclusão de fotos de conclusão do serviço. | Essencial |
| **RF12** | Gerenciamento de Secretarias (CRUD) | O gestor pode cadastrar novas secretarias municipais, editar dados de titulares, telefones, prazos de SLA e cores institucionais. | Alta |
| **RF13** | Gerenciamento de Localidades (CRUD) | O administrador pode cadastrar novas comunidades rurais, editar nomes/distritos e corrigir coordenadas geográficas. | Alta |
| **RF14** | Exportação de Dados em CSV | Capacidade de exportar relatórios de ocorrências e de localidades para planilhas eletrônicas (Excel / Google Planilhas). | Alta |
| **RF15** | Painel de Transparência Aberta | Seção pública com mapa interativo (Leaflet), contadores de resolutividade e ranking de ocorrências por bairro e distrito. | Média |
| **RF16** | Módulo de Apresentação Institucional | Slides interativos integrados para apresentação na Câmara Municipal de Madalena e Feiras Científicas. | Média |

---

### 4. Requisitos Não-Funcionais (RNF)

| Código | Requisito Não-Funcional | Critério de Aceitação |
| :--- | :--- | :--- |
| **RNF01** | **Progressive Web App (PWA)** | A aplicação deve ser instalável na tela inicial de qualquer smartphone Android ou iOS com manifesto e service worker ativos. |
| **RNF02** | **Resiliência e Funcionamento Offline-First** | Na ausência de sinal de internet, os dados básicos e localidades devem permanecer navegáveis via cache local. |
| **RNF03** | **Tempo de Carregamento e Desempenho** | Tempo de carregamento inicial inferior a 2,5 segundos em conexões 3G/4G no interior do Ceará. |
| **RNF04** | **Conformidade com a LGPD (Lei 13.709/2018)** | Dados pessoais de cidadãos identificados devem ser anonimizados em visualizações públicas; opção expressa de consentimento e sigilo da fonte em denúncias. |
| **RNF05** | **Acessibilidade e Usabilidade (WCAG AA)** | Alto contraste cromático (paleta verde municipal `#0F8A43`, amarelo `#FF8C00` e cinza neutro), fontes legíveis (Poppins) e botões com área de toque mínima de 44px para telas táteis. |
| **RNF06** | **Compatibilidade Multidispositivo** | Layout 100% responsivo, adaptável desde smartphones compactos (320px de largura) até telões de projeção de plenário da Câmara. |
| **RNF07** | **Segurança da API de Inteligência Artificial** | As chaves da API de IA (Gemini) devem ser mantidas restritas ao ambiente de servidor (backend), sem exposição no navegador do usuário. |

---

### 5. Regras de Negócio (RN)

1. **RN01 - Unicidade do Protocolo:** Não podem existir dois protocolos idênticos no sistema.
2. **RN02 - Validação de Declaração de Verdade:** Nenhuma ocorrência pode ser enviada sem que o usuário marque expressamente a ciência de que declara informações verdadeiras nos termos da lei.
3. **RN03 - Controle de SLA Municipal:** O prazo padrão para triagem da Ouvidoria é de 48 horas úteis, e o prazo para conclusão do serviço em campo pelas secretarias varia de 3 a 10 dias úteis conforme a gravidade.
4. **RN04 - Comprovação de Serviço Executado:** Para alterar o status de uma ocorrência de "Em Atendimento" para "Resolvida", o administrador é encorajado a anexar a fotografia da obra ou reparo concluído.
