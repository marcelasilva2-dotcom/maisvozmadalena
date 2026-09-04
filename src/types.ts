export type SecretariatId = 
  | 'saude'
  | 'educacao'
  | 'infraestrutura'
  | 'agricultura'
  | 'assistencia_social'
  | 'cultura'
  | 'governo'
  | 'saae'
  | 'administracao'
  | 'planejamento'
  | 'ouvidoria'
  | 'controladoria'
  | 'procuradoria'
  | 'gabinete'
  | 'meio_ambiente'
  | 'esporte'
  | 'seguranca'
  | 'iluminacao_publica'
  | 'limpeza_urbana'
  | 'outro'
  | (string & {});

export type CategoryId = 
  | 'buraco'
  | 'entulho'
  | 'arvore'
  | 'iluminacao'
  | 'falta_agua'
  | 'queimada'
  | 'animal'
  | 'predio_publico'
  | 'transporte_escolar'
  | 'medicamentos'
  | 'violencia'
  | 'atendimento'
  | 'outro';

export type ReportStatus = 
  | 'recebida'
  | 'em_analise'
  | 'encaminhada'
  | 'em_atendimento'
  | 'resolvida';

export type ReportType = 'identificada' | 'anonima';

export interface LocationData {
  address: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood: string;
  cep?: string;
  reference?: string;
  lat: number;
  lng: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  size?: string;
}

export interface TimelineEvent {
  id: string;
  status: ReportStatus;
  date: string;
  title: string;
  description: string;
  author: string;
  photos?: string[];
}

export interface ReportComment {
  id: string;
  author: string;
  role: string;
  text: string;
  date: string;
  isInternal?: boolean;
}

export interface Report {
  id: string;
  protocol: string;
  type: ReportType;
  secretariatId: SecretariatId;
  category: CategoryId;
  customCategory?: string;
  description: string;
  attachments: Attachment[];
  location: LocationData;
  createdAt: string;
  updatedAt: string;
  status: ReportStatus;
  
  // Identificação (opcional se for anônima)
  citizenName?: string;
  citizenCpf?: string;
  citizenEmail?: string;
  citizenPhone?: string;

  // Atendimento
  timeline: TimelineEvent[];
  comments: ReportComment[];
  solutionPhotos?: string[];
  solutionDate?: string;
  assignedOfficer?: string;

  // Avaliação do cidadão
  rating?: number;
  ratingFeedback?: string;
}

export interface SecretariatInfo {
  id: SecretariatId;
  name: string;
  description: string;
  iconName: string;
  color: string;
  responsibleName: string;
  email: string;
  phone: string;
  active?: boolean;
  address?: string;
  slaDays?: number;
}

export interface DistrictNeighborhood {
  name: string;
  type: 'Urbano' | 'Distrito' | 'Povoado' | 'Rural' | 'Assentamento' | 'Disperso';
  district?: string;
  details?: string;
}

export interface MadalenaLocality {
  id?: string;
  name: string;
  district: string;
  zone: 'Urbano' | 'Rural' | 'Distrito' | 'Povoado' | 'Assentamento' | 'Disperso';
  details?: string;
  subgroup?: string;
  lat?: number;
  lng?: number;
}

export interface DistrictGroup {
  id: string;
  name: string;
  shortName: string;
  type: 'Sede' | 'Distrito' | 'Disperso';
  coords: { lat: number; lng: number };
  subgroups: {
    label: string;
    items: MadalenaLocality[];
  }[];
}

export interface AiClassificationResult {
  secretariatId: SecretariatId;
  category: CategoryId;
  urgency: 'baixa' | 'media' | 'alta' | 'urgente';
  summary: string;
  recommendedAction: string;
}
