import { SecretariatInfo, Report, CategoryId } from '../types';
import { 
  MADALENA_NEIGHBORHOODS,
  MADALENA_DISTRICT_GROUPS,
  ALL_MADALENA_LOCALITIES,
  MADALENA_DISTRICT_NAMES,
  DISTRICT_COORDINATES,
  findLocality,
  getCoordinatesForLocality
} from './localitiesData';

export {
  MADALENA_NEIGHBORHOODS,
  MADALENA_DISTRICT_GROUPS,
  ALL_MADALENA_LOCALITIES,
  MADALENA_DISTRICT_NAMES,
  DISTRICT_COORDINATES,
  findLocality,
  getCoordinatesForLocality
};

export const MADALENA_COORDS = {
  lat: -4.8042,
  lng: -39.5768,
};

export const SECRETARIATS: SecretariatInfo[] = [
  {
    id: 'educacao',
    name: 'Secretaria de Educação',
    description: 'Gestão de escolas municipais, creches, transporte escolar para zona rural e sede, merenda escolar e suporte pedagógico.',
    iconName: 'GraduationCap',
    color: '#2563EB',
    responsibleName: 'Juliana Maria Fernandes Pinheiro',
    email: 'Juh1434@hotmail.com',
    phone: '(88) 99944-1326',
    address: 'Rua Maria Armênia Barbosa, Nº 309 - Santa Terezinha, CEP: 63.860-000, Madalena - CE',
    slaDays: 4,
    active: true
  },
  {
    id: 'assistencia_social',
    name: 'Secretaria de Assistência Social',
    description: 'CRAS, CREAS, Cadastro Único, Bolsa Família e atendimento a famílias em situação de vulnerabilidade social no município.',
    iconName: 'Users',
    color: '#9333EA',
    responsibleName: 'Valdemiro Júnior',
    email: 'assistenciasocial@madalena.ce.gov.br',
    phone: '(85) 99807-0763',
    address: 'Rua Augusto Máximo Vieira, Nº 80 - Centro, CEP: 63.860-000, Madalena - CE',
    slaDays: 3,
    active: true
  },
  {
    id: 'governo',
    name: 'Secretaria de Governo',
    description: 'Articulação institucional, interlocução com a Câmara Municipal de Vereadores, lideranças distritais e representação política.',
    iconName: 'Building2',
    color: '#0F8A43',
    responsibleName: 'Benocélio da Silva Carneiro',
    email: 'secgovernomadalena@madalena.ce.gov.br',
    phone: '(88) 99629-1075',
    address: 'Avenida Antônio Severo de Pinho, Nº 40 - Centro, CEP: 63.860-000, Madalena - CE',
    slaDays: 4,
    active: true
  },
  {
    id: 'infraestrutura',
    name: 'Secretaria de Obras',
    description: 'Pavimentação asfáltica e em pedra tosca, calçamento, manutenção de estradas vicinais, galerias, drenagem pluvial e prédios públicos.',
    iconName: 'Hammer',
    color: '#CA8A04',
    responsibleName: 'Cristiano Barros Uchôa',
    email: 'Cris.ulloa21@gmail.com',
    phone: '(88) 99279-3878',
    address: 'Rua Maria Eurivete Pinho da Silva, Nº 140 - Nova Madalena, CEP: 63.860-000, Madalena - CE',
    slaDays: 5,
    active: true
  },
  {
    id: 'agricultura',
    name: 'Secretaria de Agricultura',
    description: 'Apoio ao homem do campo, abastecimento na zona rural, poços artesianos, corte de terra e incentivo à produção agrícola.',
    iconName: 'Tractor',
    color: '#16A34A',
    responsibleName: 'Antônio Ribeiro Barros',
    email: 'Ribeiro.madalena@hotmail.com',
    phone: '(88) 99466-1088',
    address: 'Rua Augusto Máximo Vieira, Nº 80 - Centro, CEP: 63.860-000, Madalena - CE',
    slaDays: 5,
    active: true
  },
  {
    id: 'cultura',
    name: 'Secretaria de Cultura, Esporte, Turismo e Juventude',
    description: 'Promoção de eventos culturais e tradicionais, manutenção de praças esportivas, campeonatos locais e políticas para a juventude.',
    iconName: 'Palette',
    color: '#805AD5',
    responsibleName: 'Adauto Maciel Barros',
    email: 'Adautobarros21@gmail.com',
    phone: '(88) 99239-1816',
    address: 'Rua Pedro Alves dos Santos, Nº 53 - São José, CEP: 63.860-000, Madalena - CE',
    slaDays: 5,
    active: true
  },
  {
    id: 'saude',
    name: 'Secretaria de Saúde',
    description: 'Gestão dos Postos de Saúde (UBS), Hospital e Maternidade Mãe Tetê, SAMU 192, distribuição de medicamentos e vigilância em saúde.',
    iconName: 'HeartPulse',
    color: '#E11D48',
    responsibleName: 'Crislene Barros Uchôa',
    email: 'crisleneuchoadavi@gmail.com',
    phone: '(88) 99902-6816',
    address: 'Rua José Homero Saraiva Câmara, Nº 80 - Santa Terezinha, CEP: 63.860-000, Madalena - CE',
    slaDays: 3,
    active: true
  },
  {
    id: 'saae',
    name: 'SAAE - Serviço Autônomo de Água e Esgoto',
    description: 'Abastecimento de água tratada, saneamento básico, ligação de água, desobstrução e manutenção da rede de distribuição e esgoto.',
    iconName: 'Droplets',
    color: '#0284C7',
    responsibleName: 'Fcº Evaldo Alves Dias',
    email: 'saaemadalena@yahoo.com.br',
    phone: '(88) 99685-8594',
    address: 'Rua José Severo de Pinho, Centro, CEP: 63.860-000, Madalena - CE',
    slaDays: 2,
    active: true
  },
  {
    id: 'administracao',
    name: 'Secretaria de Administração e Finanças',
    description: 'Gestão de recursos humanos, compras públicas, licitações, folha de pagamento, arrecadação de tributos (IPTU, ISS) e finanças municipais.',
    iconName: 'FileText',
    color: '#475569',
    responsibleName: 'Natália Pinho',
    email: 'administracaofinancas@madalena.ce.gov.br',
    phone: '(88) 9.9461-5404',
    address: 'Rua Augusto Máximo Vieira, Nº 80 - Centro, CEP: 63.860-000, Madalena - CE',
    slaDays: 4,
    active: true
  },
  {
    id: 'planejamento',
    name: 'Secretaria de Planejamento e Gestão (SEPLAG)',
    description: 'Planejamento estratégico governamental, captação de recursos estaduais e federais, monitoramento de convênios e projetos estruturantes.',
    iconName: 'Briefcase',
    color: '#0284C7',
    responsibleName: 'Charles Costa de Oliveira',
    email: 'seplag@madalena.ce.gov.br',
    phone: '(88) 9.9457-6464',
    address: 'Av. Antônio Costa Vieira, Nº 305 - Centro, CEP: 63.860-000, Madalena - CE',
    slaDays: 5,
    active: true
  },
  {
    id: 'ouvidoria',
    name: 'Ouvidoria Geral do Município',
    description: 'Canal oficial de recebimento e apuração de manifestações, denúncias de conduta, elogios e pedidos pela Lei de Acesso à Informação (e-SIC).',
    iconName: 'Megaphone',
    color: '#0F8A43',
    responsibleName: 'Elton Silva',
    email: 'ouvidoria@madalena.ce.gov.br',
    phone: '(88) 9.9264-2715',
    address: 'Avenida Antônio Severo de Pinho, Nº 40 - Centro, CEP: 63.860-000, Madalena - CE',
    slaDays: 3,
    active: true
  },
  {
    id: 'controladoria',
    name: 'Controladoria Geral do Município (CGM)',
    description: 'Auditoria interna, conformidade legal dos atos administrativos, fiscalização fiscal e transparência pública.',
    iconName: 'Shield',
    color: '#334155',
    responsibleName: 'Juliano Gonçalves',
    email: 'controladoria@madalena.ce.gov.br',
    phone: '(88) 9.9461-5404',
    address: 'Rua Augusto Máximo Vieira, Nº 80 - Centro, CEP: 63.860-000, Madalena - CE',
    slaDays: 5,
    active: true
  },
  {
    id: 'procuradoria',
    name: 'Procuradoria Geral do Município',
    description: 'Consultoria e assessoramento jurídico ao Poder Executivo e representação judicial dos interesses do Município de Madalena.',
    iconName: 'FileText',
    color: '#1E293B',
    responsibleName: 'Dr. Francisco Lucas Mesquita dos Santos',
    email: 'procuradoria@madalena.ce.gov.br',
    phone: '(88) 9.9461-5404',
    address: 'Rua Augusto Máximo Vieira, Nº 80 - Centro, CEP: 63.860-000, Madalena - CE',
    slaDays: 5,
    active: true
  },
  {
    id: 'gabinete',
    name: 'Gabinete do Prefeito',
    description: 'Coordenação executiva, gestão da agenda do Prefeito Municipal Crispiano Barros Uchôa e despacho direto de solicitações dos cidadãos.',
    iconName: 'Building2',
    color: '#0F8A43',
    responsibleName: 'Adrilea Márcia Cruz Costa',
    email: 'gabinete@madalena.ce.gov.br',
    phone: '(88) 9.9461-5404',
    address: 'Rua Augusto Máximo Vieira, Nº 80 - Centro, CEP: 63.860-000, Madalena - CE',
    slaDays: 3,
    active: true
  },
  {
    id: 'iluminacao_publica',
    name: 'Setor de Iluminação Pública',
    description: 'Manutenção de postes de energia pública, substituição de lâmpadas queimadas ou piscando e reparos na iluminação de ruas e praças.',
    iconName: 'Lightbulb',
    color: '#D97706',
    responsibleName: 'Cristiano Barros Uchôa (Obras)',
    email: 'Cris.ulloa21@gmail.com',
    phone: '(88) 99279-3878',
    address: 'Rua Maria Eurivete Pinho da Silva, Nº 140 - Nova Madalena, CEP: 63.860-000, Madalena - CE',
    slaDays: 2,
    active: true
  },
  {
    id: 'limpeza_urbana',
    name: 'Setor de Limpeza Urbana e Coleta',
    description: 'Coleta regular de lixo doméstico, varrição e capinação de ruas, recolhimento de entulhos acumulados e limpeza de áreas públicas.',
    iconName: 'Trash2',
    color: '#059669',
    responsibleName: 'Cristiano Barros Uchôa (Obras)',
    email: 'Cris.ulloa21@gmail.com',
    phone: '(88) 99279-3878',
    address: 'Rua Maria Eurivete Pinho da Silva, Nº 140 - Nova Madalena, CEP: 63.860-000, Madalena - CE',
    slaDays: 2,
    active: true
  },
  {
    id: 'meio_ambiente',
    name: 'Recursos Hídricos e Defesa Ambiental',
    description: 'Fiscalização de queimadas, poda de árvores em risco, abastecimento de água e manutenção de chafarizes e mananciais.',
    iconName: 'Trees',
    color: '#0D9488',
    responsibleName: 'Antônio Ribeiro Barros (Agricultura)',
    email: 'Ribeiro.madalena@hotmail.com',
    phone: '(88) 99466-1088',
    address: 'Rua Augusto Máximo Vieira, Nº 80 - Centro, CEP: 63.860-000, Madalena - CE',
    slaDays: 3,
    active: true
  }
];

export const CATEGORIES: { id: CategoryId; label: string; icon: string; defaultSecretariat: string }[] = [
  { id: 'buraco', label: 'Buraco na Via / Calçamento', icon: 'Construction', defaultSecretariat: 'infraestrutura' },
  { id: 'entulho', label: 'Entulho ou Lixo Acumulado', icon: 'Trash2', defaultSecretariat: 'limpeza_urbana' },
  { id: 'arvore', label: 'Poda de Árvore ou Risco de Queda', icon: 'Trees', defaultSecretariat: 'meio_ambiente' },
  { id: 'iluminacao', label: 'Lâmpada Apagada / Poste com Defeito', icon: 'Lightbulb', defaultSecretariat: 'iluminacao_publica' },
  { id: 'falta_agua', label: 'Falta de Água / Vazamento Público / Saneamento', icon: 'Droplets', defaultSecretariat: 'saae' },
  { id: 'queimada', label: 'Foco de Queimada Não Autorizada', icon: 'Flame', defaultSecretariat: 'meio_ambiente' },
  { id: 'animal', label: 'Animal Solto em Via Pública / Risco', icon: 'Dog', defaultSecretariat: 'saude' },
  { id: 'predio_publico', label: 'Manutenção em Prédio Público', icon: 'Building', defaultSecretariat: 'infraestrutura' },
  { id: 'transporte_escolar', label: 'Rota ou Ônibus Escolar', icon: 'Bus', defaultSecretariat: 'educacao' },
  { id: 'medicamentos', label: 'Falta de Medicamentos ou Insumos', icon: 'Pill', defaultSecretariat: 'saude' },
  { id: 'violencia', label: 'Ponto Inseguro / Perturbação', icon: 'ShieldAlert', defaultSecretariat: 'seguranca' },
  { id: 'atendimento', label: 'Reclamação sobre Atendimento', icon: 'UserCheck', defaultSecretariat: 'ouvidoria' },
  { id: 'outro', label: 'Outras Solicitações', icon: 'HelpCircle', defaultSecretariat: 'ouvidoria' }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-1',
    protocol: 'MAD-2026-89412',
    type: 'identificada',
    secretariatId: 'iluminacao_publica',
    category: 'iluminacao',
    description: 'Há três lâmpadas queimadas na Rua Maria do Carmo, próximo ao número 240. O trecho está muito escuro à noite, gerando insegurança para as famílias e estudantes.',
    attachments: [
      {
        id: 'att-1',
        name: 'poste_escuro.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80'
      }
    ],
    location: {
      address: 'Rua Maria do Carmo, 240, Centro, Madalena - CE',
      street: 'Rua Maria do Carmo',
      number: '240',
      neighborhood: 'Centro',
      cep: '63860-000',
      reference: 'Em frente à Mercaria do Sr. Zé',
      lat: -4.8035,
      lng: -39.5772
    },
    createdAt: '2026-08-01T14:30:00.000Z',
    updatedAt: '2026-08-03T10:15:00.000Z',
    status: 'resolvida',
    citizenName: 'João da Silva Santos',
    citizenCpf: '***.458.912-**',
    citizenEmail: 'joao.santos@gmail.com',
    citizenPhone: '(88) 99872-3311',
    assignedOfficer: 'Sérgio Mendes (Técnico Iluminação)',
    solutionPhotos: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80'
    ],
    solutionDate: '2026-08-03T10:15:00.000Z',
    rating: 5,
    ratingFeedback: 'Equipe muito ágil! Trocaram a luminária por LED no mesmo dia. Parabéns à prefeitura.',
    timeline: [
      {
        id: 't-1',
        status: 'recebida',
        date: '2026-08-01T14:30:00.000Z',
        title: 'Denúncia Registrada',
        description: 'A solicitação foi cadastrada com sucesso e aguarda triagem inicial.',
        author: 'Sistema +VOZ'
      },
      {
        id: 't-2',
        status: 'em_analise',
        date: '2026-08-01T16:00:00.000Z',
        title: 'Análise Técnica',
        description: 'Triagem concluída. Demanda validada e encaminhada para ordem de serviço.',
        author: 'Ouvidoria Geral'
      },
      {
        id: 't-3',
        status: 'em_atendimento',
        date: '2026-08-02T08:30:00.000Z',
        title: 'Equipe em Campo',
        description: 'Eletricista designado para substituição do braço de iluminação e lâmpada LED.',
        author: 'Sec. Iluminação Pública'
      },
      {
        id: 't-4',
        status: 'resolvida',
        date: '2026-08-03T10:15:00.000Z',
        title: 'Serviço Concluído',
        description: 'Três luminárias substituídas por modelo LED de alta eficiência. Ponto de iluminação reestabelecido.',
        author: 'Sérgio Mendes',
        photos: ['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80']
      }
    ],
    comments: [
      {
        id: 'c-1',
        author: 'Sérgio Mendes',
        role: 'Secretaria de Iluminação Pública',
        text: 'Prezado João, a equipe de manutenção de iluminação efetuou a troca das 3 lâmpadas por módulos de LED de 100W.',
        date: '2026-08-03T10:15:00.000Z',
        isInternal: false
      }
    ]
  },
  {
    id: 'rep-2',
    protocol: 'MAD-2026-77301',
    type: 'identificada',
    secretariatId: 'infraestrutura',
    category: 'buraco',
    description: 'Grande buraco aberto no calçamento da Rua Padre Francisco, no Alto da Brasília, dificultando a passagem de carros e causou queda de motociclista.',
    attachments: [
      {
        id: 'att-2',
        name: 'buraco_rua.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80'
      }
    ],
    location: {
      address: 'Rua Padre Francisco, s/n, Alto da Alegria, Madalena - CE',
      street: 'Rua Padre Francisco',
      neighborhood: 'Alto da Alegria',
      cep: '63860-000',
      reference: 'Perto da Areninha do Alto da Alegria',
      lat: -4.8080,
      lng: -39.5740
    },
    createdAt: '2026-08-02T09:10:00.000Z',
    updatedAt: '2026-08-03T11:00:00.000Z',
    status: 'em_atendimento',
    citizenName: 'Antonia Maria de Sousa',
    citizenCpf: '***.812.304-**',
    citizenEmail: 'antonia.maria@hotmail.com',
    citizenPhone: '(88) 98822-4400',
    assignedOfficer: 'Eng. Francisco Alves',
    timeline: [
      {
        id: 't-20',
        status: 'recebida',
        date: '2026-08-02T09:10:00.000Z',
        title: 'Denúncia Registrada',
        description: 'Solicitação recebida.',
        author: 'Sistema +VOZ'
      },
      {
        id: 't-21',
        status: 'encaminhada',
        date: '2026-08-02T11:00:00.000Z',
        title: 'Encaminhada à SEINFRA',
        description: 'Inclusão na programação de tapa-buracos da semana.',
        author: 'Ouvidoria Geral'
      },
      {
        id: 't-22',
        status: 'em_atendimento',
        date: '2026-08-03T09:00:00.000Z',
        title: 'Obra Iniciada',
        description: 'Equipe de calceteiros no local preparando a base do solo.',
        author: 'Eng. Francisco Alves'
      }
    ],
    comments: [
      {
        id: 'c-20',
        author: 'Eng. Francisco Alves',
        role: 'Secretaria de Infraestrutura',
        text: 'Prezada Antonia, a equipe de pavimentação já está no Alto da Alegria refazendo o calçamento no trecho afetado.',
        date: '2026-08-03T11:00:00.000Z',
        isInternal: false
      }
    ]
  },
  {
    id: 'rep-3',
    protocol: 'MAD-2026-64102',
    type: 'anonima',
    secretariatId: 'limpeza_urbana',
    category: 'entulho',
    description: 'Acúmulo de restos de poda e entulho de obra na esquina da Av. Antonio Costa com a Rua dos Pinhos. O lixo está invadindo a calçada.',
    attachments: [
      {
        id: 'att-3',
        name: 'entulho_rua.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80'
      }
    ],
    location: {
      address: 'Av. Antonio Costa x Rua dos Pinhos, Bairro dos Pinhos, Madalena - CE',
      street: 'Av. Antonio Costa',
      neighborhood: 'Bairro dos Pinhos',
      cep: '63860-000',
      reference: 'Próximo à quadra poliesportiva',
      lat: -4.8010,
      lng: -39.5810
    },
    createdAt: '2026-08-03T08:00:00.000Z',
    updatedAt: '2026-08-03T08:30:00.000Z',
    status: 'em_analise',
    timeline: [
      {
        id: 't-30',
        status: 'recebida',
        date: '2026-08-03T08:00:00.000Z',
        title: 'Denúncia Anônima Registrada',
        description: 'Aguardando vistoria técnica de limpeza.',
        author: 'Sistema +VOZ'
      },
      {
        id: 't-31',
        status: 'em_analise',
        date: '2026-08-03T08:30:00.000Z',
        title: 'Aguardando Caminhão Caçamba',
        description: 'Escalonado na rota de recolhimento de entulhos de hoje à tarde.',
        author: 'Geraldo Batista (Limpeza Urbana)'
      }
    ],
    comments: []
  },
  {
    id: 'rep-4',
    protocol: 'MAD-2026-51209',
    type: 'identificada',
    secretariatId: 'agricultura',
    category: 'outro',
    description: 'Necessidade de patrolamento na estrada rural que liga a sede ao Distrito de Cacimba Nova. As chuvas passadas criaram canaletas fundas na via.',
    attachments: [],
    location: {
      address: 'Vila de Cacimba Nova, Distrito de Cacimba Nova, Madalena - CE',
      neighborhood: 'Cacimba Nova',
      cep: '63860-000',
      reference: 'Trecho após a passagem molhada',
      lat: -4.8450,
      lng: -39.6900
    },
    createdAt: '2026-07-29T10:00:00.000Z',
    updatedAt: '2026-08-02T16:00:00.000Z',
    status: 'resolvida',
    citizenName: 'Raimundo Nonato de Paiva',
    citizenCpf: '***.221.908-**',
    citizenEmail: 'nonatopaiva@bol.com.br',
    citizenPhone: '(88) 99611-2288',
    assignedOfficer: 'Raimundo Nonato (Didi)',
    solutionPhotos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&q=80'
    ],
    solutionDate: '2026-08-02T16:00:00.000Z',
    rating: 5,
    ratingFeedback: 'A motoniveladora passou e deixou a estrada perfeita para o escoamento da safra!',
    timeline: [
      {
        id: 't-40',
        status: 'recebida',
        date: '2026-07-29T10:00:00.000Z',
        title: 'Registrada',
        description: 'Atendimento do produtor rural cadastrado.',
        author: 'Sistema +VOZ'
      },
      {
        id: 't-41',
        status: 'em_atendimento',
        date: '2026-08-01T07:00:00.000Z',
        title: 'Máquinas em Operação',
        description: 'Patrolamento e nivelamento do trecho de 8km executado.',
        author: 'Sec. de Agricultura'
      },
      {
        id: 't-42',
        status: 'resolvida',
        date: '2026-08-02T16:00:00.000Z',
        title: 'Estrada Liberada',
        description: 'Serviço concluído com aplicação de piçarra nos trechos críticos.',
        author: 'Raimundo Nonato (Didi)'
      }
    ],
    comments: []
  },
  {
    id: 'rep-5',
    protocol: 'MAD-2026-40391',
    type: 'identificada',
    secretariatId: 'saude',
    category: 'medicamentos',
    description: 'Solicitação de esclarecimento sobre a entrega da medicação para hipertensão no Posto de Saúde do Bairro Santana.',
    attachments: [],
    location: {
      address: 'Posto de Saúde da Família, Bairro Santana, Madalena - CE',
      neighborhood: 'Santana',
      cep: '63860-000',
      lat: -4.8020,
      lng: -39.5790
    },
    createdAt: '2026-08-03T11:20:00.000Z',
    updatedAt: '2026-08-03T11:20:00.000Z',
    status: 'recebida',
    citizenName: 'Francisca Eliane Lima',
    citizenCpf: '***.501.229-**',
    citizenEmail: 'eliane.lima@gmail.com',
    citizenPhone: '(88) 99401-8833',
    timeline: [
      {
        id: 't-50',
        status: 'recebida',
        date: '2026-08-03T11:20:00.000Z',
        title: 'Registrada',
        description: 'Recebida e aguardando triagem do almoxarifado de medicamentos.',
        author: 'Sistema +VOZ'
      }
    ],
    comments: []
  },
  {
    id: 'rep-6',
    protocol: 'MAD-2026-31904',
    type: 'identificada',
    secretariatId: 'educacao',
    category: 'transporte_escolar',
    description: 'Ajuste de horário do transporte escolar que atende aos alunos da Escola e Posto de Saúde da comunidade do Treme, no Distrito de Cajazeiras.',
    attachments: [],
    location: {
      address: 'Comunidade Treme, Distrito de Cajazeiras, Madalena - CE',
      neighborhood: 'Treme',
      cep: '63860-000',
      reference: 'Em frente à Escola Municipal do Treme',
      lat: -4.7310,
      lng: -39.5210
    },
    createdAt: '2026-08-03T09:45:00.000Z',
    updatedAt: '2026-08-03T14:10:00.000Z',
    status: 'em_atendimento',
    citizenName: 'Carlos Eduardo Mendes',
    citizenCpf: '***.604.119-**',
    citizenEmail: 'carlos.mendes@escola.ce.gov.br',
    citizenPhone: '(88) 99754-0012',
    assignedOfficer: 'Juliana Fernandes (Educação)',
    timeline: [
      {
        id: 't-60',
        status: 'recebida',
        date: '2026-08-03T09:45:00.000Z',
        title: 'Registrada',
        description: 'Solicitação referente à rota de transporte escolar no Treme.',
        author: 'Sistema +VOZ'
      },
      {
        id: 't-61',
        status: 'em_atendimento',
        date: '2026-08-03T14:10:00.000Z',
        title: 'Ajuste de Rota',
        description: 'Coordenação de transporte escolar readequou a escala da van para 6h45.',
        author: 'Sec. de Educação'
      }
    ],
    comments: []
  },
  {
    id: 'rep-7',
    protocol: 'MAD-2026-28101',
    type: 'identificada',
    secretariatId: 'infraestrutura',
    category: 'buraco',
    description: 'Manutenção de bueiro e passagem de água na Fazenda Brejo, no Distrito de Cajazeiras, após as fortes enxurradas.',
    attachments: [],
    location: {
      address: 'Fazenda Brejo, Distrito de Cajazeiras, Madalena - CE',
      neighborhood: 'Brejo',
      cep: '63860-000',
      reference: 'Próximo à cerca principal da Fazenda Brejo',
      lat: -4.7390,
      lng: -39.5290
    },
    createdAt: '2026-08-02T15:30:00.000Z',
    updatedAt: '2026-08-03T10:00:00.000Z',
    status: 'encaminhada',
    citizenName: 'Manoel Bezerra Filho',
    citizenCpf: '***.930.412-**',
    citizenEmail: 'manoel.brejo@gmail.com',
    citizenPhone: '(88) 99622-7711',
    timeline: [
      {
        id: 't-70',
        status: 'recebida',
        date: '2026-08-02T15:30:00.000Z',
        title: 'Registrada',
        description: 'Demanda de drenagem e bueiro na Fazenda Brejo.',
        author: 'Sistema +VOZ'
      },
      {
        id: 't-71',
        status: 'encaminhada',
        date: '2026-08-03T10:00:00.000Z',
        title: 'Vistoria Agendada',
        description: 'Técnico de drenagem visitará o local na próxima quinta-feira.',
        author: 'SEINFRA Madalena'
      }
    ],
    comments: []
  },
  {
    id: 'rep-8',
    protocol: 'MAD-2026-19208',
    type: 'anonima',
    secretariatId: 'iluminacao_publica',
    category: 'iluminacao',
    description: 'Poste com lâmpada piscando na praça central da Vila de Macaoca, gerando sensação de abandono no local de encontro das famílias.',
    attachments: [],
    location: {
      address: 'Praça Central de Macaoca, Vila Macaoca, Madalena - CE',
      neighborhood: 'Macaoca',
      cep: '63860-000',
      reference: 'Ao lado da capela de Macaoca',
      lat: -4.8950,
      lng: -39.5420
    },
    createdAt: '2026-08-03T12:00:00.000Z',
    updatedAt: '2026-08-03T12:00:00.000Z',
    status: 'recebida',
    timeline: [
      {
        id: 't-80',
        status: 'recebida',
        date: '2026-08-03T12:00:00.000Z',
        title: 'Registrada',
        description: 'Iluminação pública na praça de Macaoca.',
        author: 'Sistema +VOZ'
      }
    ],
    comments: []
  }
];
