# 📜 Documento Mestre do Projeto Escolar (NTPPS)
## Projeto: +VOZ Madalena – Ouvidoria Inteligente e Cidadania Digital

---

### 1. Dados de Identificação
- **Título do Projeto:** +VOZ Madalena: Tecnologia Social e Inteligência Artificial a Serviço da Cidadania no Sertão Central Cearense
- **Componente Curricular:** NTPPS (Núcleo de Trabalho, Pesquisa e Práticas Sociais)
- **Modalidade:** Ensino Médio Regular / Educação Profissional e Tecnológica (SEDUC-CE)
- **Local de Aplicação:** Município de Madalena – Estado do Ceará
- **Linha de Pesquisa:** Inovação Tecnológica, Gestão Pública Participativa e Inclusão Social no Campo

---

### 2. Contextualização e Diagnóstico Socioespacial

O município de **Madalena**, situado no Sertão Central do Ceará, possui uma área territorial de aproximadamente 1.034 km² e uma densidade demográfica marcada pela dispersão de suas famílias entre a Sede e cinco distritos rurais: **Macaoca**, **São José da Macaoca**, **Cacimba Nova**, **União** e **Cajazeiras**, além de mais de 70 comunidades rurais, assentamentos da reforma agrária (PAs) e pequenas fazendas.

Durante os debates e levantamentos de campo nas aulas de **NTPPS**, os estudantes identificaram uma barreira histórica:
1. **Fosso de Comunicação Rural-Urbana:** Cidadãos do campo enfrentam distâncias de até 40 km de estradas vicinais para se deslocarem até a Prefeitura na Sede apenas para solicitar a troca de uma lâmpada queimada, a passagem de uma máquina niveladora em estrada de terra ou o conserto de um vazamento d'água.
2. **Custo e Burocracia:** O deslocamento gera custo financeiro com passagens ou combustível, perda de dias de trabalho na roça e sensação de isolamento ou desamparo cívico.
3. **Barreiras de Letramento:** Parte considerável da população idosa ou rural tem facilidade em falar e gravar mensagens de voz no celular, mas enfrenta dificuldades ao redigir textos longos e burocráticos exigidos por ouvidorias tradicionais.
4. **Falta de Feedback e Transparência:** Quando uma reclamação era feita verbalmente a lideranças locais, o morador não tinha um número de protocolo nem forma de auditar se a demanda foi encaminhada ou esquecida.

---

### 3. Problematização Científica

> *"Como a ciência, a tecnologia digital e o conhecimento construído na escola pública podem aproximar de forma inclusiva e auditável a população de Madalena – especialmente das comunidades rurais – da administração municipal e da Câmara de Vereadores?"*

A partir dessa pergunta-problema formulada em sala de aula, o projeto uniu pesquisa social empírica à engenharia de software para conceber um aplicativo acessível, leve e gratuito, capaz de funcionar em conexões móveis instáveis e com recursos inclusivos como gravação de áudio e geolocalização.

---

### 4. Justificativa Social e Pedagógica

- **Pedagógica (NTPPS):** O NTPPS propõe que os estudantes desenvolvam competências de pesquisa-ação, empatia social, trabalho em equipe e protagonismo cidadão, saindo da teoria e intervindo na realidade concreta de sua cidade.
- **Social e Democrática:** O acesso aos serviços públicos é um direito fundamental. Quando um vazamento de água ou uma ponte avariada demora semanas para ser reportada, a saúde pública e o transporte escolar de crianças da zona rural são diretamente prejudicados.
- **Eficiência na Gestão Pública:** Para a Prefeitura e a Câmara de Madalena, a ferramenta gera um **mapa de calor territorial de demandas em tempo real**, permitindo que os secretários e vereadores aloquem recursos e equipes com base em dados reais e auditáveis, e não em suposições.

---

### 5. Objetivos do Projeto

#### 5.1. Objetivo Geral
Desenvolver e implantar uma plataforma digital progressiva (PWA) e colaborativa de ouvidoria municipal que permita a qualquer morador de Madalena – urbano ou rural – registrar, por texto, áudio, foto, vídeo e geolocalização, as carências de sua rua ou comunidade, direcionando-as automaticamente para as secretarias competentes com acompanhamento público transparente.

#### 5.2. Objetivos Específicos
1. **Mapear a malha territorial de Madalena:** Catalogar os 6 distritos e as mais de 70 localidades e assentamentos oficiais (com base no mapa do IPECE 2023 e requerimentos da Câmara Municipal) para acabar com o "apagão geográfico" das fazendas e vilas rurais.
2. **Eliminar barreiras de acesso:** Criar mecanismo de gravação de áudio pelo navegador e suporte a envio de denúncias sem necessidade de login complexo (opção anônima e identificada com conformidade LGPD).
3. **Integrar Inteligência Artificial:** Empregar modelo de IA para leitura semântica da denúncia, categorização automática por secretaria (Obras, Saúde, Educação, etc.) e classificação do grau de urgência.
4. **Construir Painel de Gestão e SLA:** Disponibilizar para os servidores municipais uma área administrativa com controle de prazos de atendimento (SLA), histórico de ações, envio de fotos de comprovação do serviço executado e exportação de relatórios.
5. **Garantir a Transparência Pública:** Desenvolver um mapa interativo aberto à população com indicadores de resolutividade, fortalecendo o controle social e a cidadania ativa.

---

### 6. Alinhamento com os Objetivos de Desenvolvimento Sustentável (ODS - ONU)

O projeto +VOZ Madalena está diretamente articulado à Agenda 2030 da ONU:
- **ODS 9 (Indústria, Inovação e Infraestrutura):** Uso de tecnologia móvel para monitorar e melhorar a infraestrutura básica de saneamento, estradas vicinais e iluminação pública.
- **ODS 11 (Cidades e Comunidades Sustentáveis):** Promoção de cidades e assentamentos humanos inclusivos, seguros, resilientes e sustentáveis, integrando o campo e a cidade.
- **ODS 16 (Paz, Justiça e Instituições Eficazes):** Desenvolvimento de instituições transparentes, responsáveis e acessíveis em todos os níveis, garantindo tomada de decisões receptiva, inclusiva, participativa e representativa.

---

### 7. Metodologia Científica e Etapas de Desenvolvimento

O projeto foi estruturado em quatro etapas pedagógicas sucessivas:

```
[Etapa 1: Diagnóstico de Campo]
  ├── Entrevistas com moradores rurais e urbanos
  └── Levantamento de dados com IPECE 2023 e Leis Municipais
           │
           ▼
[Etapa 2: Planejamento e Especificação]
  ├── Definição de personas (morador, ouvidor, vereador)
  └── Desenho da jornada do usuário em 5 passos simples
           │
           ▼
[Etapa 3: Prototipação e Desenvolvimento Tecnológico]
  ├── Desenvolvimento Full-Stack (React 18 + Vite + TypeScript)
  ├── Inteligência Artificial (Google Gemini Flash) para triagem
  └── Banco de dados local e em nuvem com sincronização resiliente
           │
           ▼
[Etapa 4: Validação, Apresentação e Entrega Cívica]
  ├── Testes de usabilidade com agricultores e estudantes
  ├── Apresentação de slides para a Câmara de Vereadores de Madalena
  └── Defesa perante a Banca Examinadora Escolar de NTPPS
```

---

### 8. Impactos e Resultados Esperados

1. **Redução em até 80% do tempo de tramitação** de um chamado público na Prefeitura de Madalena.
2. **Inclusão de comunidades rurais remotas** (como Treme, Brejo, Melancia, Grossos, Pau D'Arco) no mapa digital de investimentos públicos.
3. **Economia financeira para as famílias de agricultores**, eliminando viagens desnecessárias até a sede municipal.
4. **Fortalecimento do protagonismo juvenil**, demonstrando que alunos da escola pública são capazes de criar tecnologias de ponta com impacto social concreto para sua própria comunidade.
