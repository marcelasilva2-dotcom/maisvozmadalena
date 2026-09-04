import { DistrictGroup, DistrictNeighborhood, MadalenaLocality } from '../types';

/**
 * Coordenadas de referência aproximadas para cada distrito municipal de Madalena / CE.
 * Permite centrar automaticamente o mapa quando o usuário seleciona um distrito ou localidade.
 */
export const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Madalena (Sede)': { lat: -4.8042, lng: -39.5768 },
  'Macaoca': { lat: -4.8950, lng: -39.5420 },
  'Cajazeiras': { lat: -4.7350, lng: -39.5250 },
  'Cacimba Nova': { lat: -4.8450, lng: -39.6900 },
  'Paus Branco': { lat: -4.9500, lng: -39.6200 },
  'União': { lat: -4.7200, lng: -39.6500 },
  'Outros Pontos / Dispersos': { lat: -4.8100, lng: -39.6000 }
};

/**
 * Estrutura hierárquica completa dos Distritos e Localidades de Madalena / CE
 * Fonte: Mapa do IPECE 2023 consolidado com Leis e Requerimentos da Câmara Municipal de Madalena.
 */
export const MADALENA_DISTRICT_GROUPS: DistrictGroup[] = [
  {
    id: 'distrito-madalena-sede',
    name: '1. Distrito: Madalena (Sede)',
    shortName: 'Madalena (Sede)',
    type: 'Sede',
    coords: DISTRICT_COORDINATES['Madalena (Sede)'],
    subgroups: [
      {
        label: 'Área Urbana (Bairros da Sede)',
        items: [
          { name: 'Centro', district: 'Madalena (Sede)', zone: 'Urbano', details: 'Bairro da Sede' },
          { name: 'Santana', district: 'Madalena (Sede)', zone: 'Urbano', details: 'Bairro da Sede' },
          { name: 'Santa Terezinha', district: 'Madalena (Sede)', zone: 'Urbano', details: 'Bairro da Sede' },
          { name: 'Nova Madalena', district: 'Madalena (Sede)', zone: 'Urbano', details: 'Bairro da Sede' },
          { name: 'Alto da Alegria', district: 'Madalena (Sede)', zone: 'Urbano', details: 'Bairro da Sede' },
          { name: 'Henrique Jorge', district: 'Madalena (Sede)', zone: 'Urbano', details: 'Bairro da Sede' },
          { name: 'Madalena Velha', district: 'Madalena (Sede)', zone: 'Urbano', details: 'Bairro da Sede' },
          { name: 'Bairro São José', district: 'Madalena (Sede)', zone: 'Urbano', details: 'Bairro da Sede' },
          { name: 'Bairro Hermano Pinho Vieira', district: 'Madalena (Sede)', zone: 'Urbano', details: 'Bairro da Sede' },
          { name: 'Bairro dos Pinhos', district: 'Madalena (Sede)', zone: 'Urbano', details: 'Bairro da Sede' }
        ]
      },
      {
        label: 'Área Rural do Distrito-Sede',
        items: [
          { name: 'Barra do Rio', district: 'Madalena (Sede)', zone: 'Rural' },
          { name: 'Boa Vista', district: 'Madalena (Sede)', zone: 'Rural' },
          { name: 'Cacimba do Gado', district: 'Madalena (Sede)', zone: 'Rural' },
          { name: 'Fazenda Central', district: 'Madalena (Sede)', zone: 'Rural' },
          { name: 'Leitão', district: 'Madalena (Sede)', zone: 'Rural' },
          { name: 'Pinhões', district: 'Madalena (Sede)', zone: 'Rural' },
          { name: 'São Gerardo', district: 'Madalena (Sede)', zone: 'Rural' },
          { name: 'São Gonçalo', district: 'Madalena (Sede)', zone: 'Rural' },
          { name: 'Sítio Umari', district: 'Madalena (Sede)', zone: 'Rural' }
        ]
      }
    ]
  },
  {
    id: 'distrito-macaoca',
    name: '2. Distrito: Macaoca',
    shortName: 'Macaoca',
    type: 'Distrito',
    coords: DISTRICT_COORDINATES['Macaoca'],
    subgroups: [
      {
        label: 'Vila Principal',
        items: [
          { name: 'Macaoca', district: 'Macaoca', zone: 'Distrito', details: 'Vila Principal / Sede Distrital' }
        ]
      },
      {
        label: 'Comunidades, Fazendas e Assentamentos de Macaoca',
        items: [
          { name: 'Cacimbinha', district: 'Macaoca', zone: 'Rural' },
          { name: 'Juremal', district: 'Macaoca', zone: 'Rural' },
          { name: 'Manga', district: 'Macaoca', zone: 'Rural' },
          { name: 'Mufumbo', district: 'Macaoca', zone: 'Rural' },
          { name: 'Nova Vida II', district: 'Macaoca', zone: 'Rural' },
          { name: 'Piçarreira', district: 'Macaoca', zone: 'Rural' },
          { name: 'Poço da Pedra', district: 'Macaoca', zone: 'Rural' },
          { name: 'Sabonete (Macaoca)', district: 'Macaoca', zone: 'Rural' },
          { name: 'Salamantra', district: 'Macaoca', zone: 'Rural' },
          { name: 'Salgadinho (Região do Açude Umari)', district: 'Macaoca', zone: 'Rural', details: 'Região do Açude Umari' },
          { name: 'Santa Catarina', district: 'Macaoca', zone: 'Rural' },
          { name: 'São Nicolau', district: 'Macaoca', zone: 'Rural' },
          { name: 'Serrote Feio', district: 'Macaoca', zone: 'Rural' },
          { name: 'Sítio Livramento', district: 'Macaoca', zone: 'Rural' },
          { name: 'Tigre', district: 'Macaoca', zone: 'Rural' },
          { name: 'Tigre/São José da Macaoca', district: 'Macaoca', zone: 'Rural' },
          { name: 'Várzea Alegre', district: 'Macaoca', zone: 'Rural' },
          { name: 'Várzea Grande', district: 'Macaoca', zone: 'Rural' },
          { name: 'Assentamento Santa Eliza', district: 'Macaoca', zone: 'Assentamento', details: 'Assentamento Rural' },
          { name: 'Assentamento São Joaquim', district: 'Macaoca', zone: 'Assentamento', details: 'Assentamento Rural' }
        ]
      }
    ]
  },
  {
    id: 'distrito-cajazeiras',
    name: '3. Distrito: Cajazeiras',
    shortName: 'Cajazeiras',
    type: 'Distrito',
    coords: DISTRICT_COORDINATES['Cajazeiras'],
    subgroups: [
      {
        label: 'Vila Principal',
        items: [
          { name: 'Cajazeiras', district: 'Cajazeiras', zone: 'Distrito', details: 'Vila Principal / Sede Distrital' }
        ]
      },
      {
        label: 'Comunidades, Fazendas e Assentamentos de Cajazeiras',
        items: [
          { name: 'Treme', district: 'Cajazeiras', zone: 'Povoado', details: 'Comunidade com Posto de Saúde e Escola' },
          { name: 'Brejo', district: 'Cajazeiras', zone: 'Rural', details: 'Fazenda Brejo' },
          { name: 'Açude', district: 'Cajazeiras', zone: 'Rural' },
          { name: 'Água Fria', district: 'Cajazeiras', zone: 'Rural' },
          { name: 'Besouro', district: 'Cajazeiras', zone: 'Rural' },
          { name: 'Bom Jesus', district: 'Cajazeiras', zone: 'Rural' },
          { name: 'Caiçara', district: 'Cajazeiras', zone: 'Rural' },
          { name: 'Cajazeiras dos Braganças', district: 'Cajazeiras', zone: 'Rural' },
          { name: 'Espinheiro', district: 'Cajazeiras', zone: 'Rural' },
          { name: 'Fazenda Caracol', district: 'Cajazeiras', zone: 'Rural' },
          { name: 'Mel', district: 'Cajazeiras', zone: 'Rural' },
          { name: 'Quieto (Cajazeiras)', district: 'Cajazeiras', zone: 'Rural' },
          { name: 'Ramadinha', district: 'Cajazeiras', zone: 'Rural' },
          { name: 'Sítio Novo', district: 'Cajazeiras', zone: 'Rural' },
          { name: 'Assentamento Pedras Altas', district: 'Cajazeiras', zone: 'Assentamento', details: 'Assentamento Rural' }
        ]
      }
    ]
  },
  {
    id: 'distrito-cacimba-nova',
    name: '4. Distrito: Cacimba Nova',
    shortName: 'Cacimba Nova',
    type: 'Distrito',
    coords: DISTRICT_COORDINATES['Cacimba Nova'],
    subgroups: [
      {
        label: 'Vila Principal',
        items: [
          { name: 'Cacimba Nova', district: 'Cacimba Nova', zone: 'Distrito', details: 'Vila Principal / Sede Distrital' }
        ]
      },
      {
        label: 'Comunidades, Fazendas e Assentamentos de Cacimba Nova',
        items: [
          { name: 'Algodões', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'Fazenda Córrego', district: 'Cacimba Nova', zone: 'Assentamento', details: 'Área de Assentamento' },
          { name: 'Fazenda Nova Aliança', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'Fazenda Santa Helena', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'Fazenda Santa Úrsula', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'Grossos', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'Lagoa de Dentro', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'Lagoa dos Bois', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'Lonjão', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'Olho d\'Água dos Barros', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'Pai Mané', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'Riacho Verde', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'Santo Antônio', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'São José', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'Sítio Santa Maria', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'Vaca Serrada', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'Várzea Cumprida', district: 'Cacimba Nova', zone: 'Rural' },
          { name: 'PA Marequeta', district: 'Cacimba Nova', zone: 'Assentamento', details: 'Projeto de Assentamento' }
        ]
      }
    ]
  },
  {
    id: 'distrito-paus-branco',
    name: '5. Distrito: Paus Branco',
    shortName: 'Paus Branco',
    type: 'Distrito',
    coords: DISTRICT_COORDINATES['Paus Branco'],
    subgroups: [
      {
        label: 'Vila Principal',
        items: [
          { name: 'Paus Branco', district: 'Paus Branco', zone: 'Distrito', details: 'Vila Principal / Sede Distrital' }
        ]
      },
      {
        label: 'Comunidades, Fazendas e Assentamentos de Paus Branco',
        items: [
          { name: 'Barrigas', district: 'Paus Branco', zone: 'Rural' },
          { name: 'Cachoeirinha', district: 'Paus Branco', zone: 'Rural' },
          { name: 'Escuro', district: 'Paus Branco', zone: 'Rural' },
          { name: 'Guanabara', district: 'Paus Branco', zone: 'Rural' },
          { name: 'Lagoa Velha', district: 'Paus Branco', zone: 'Rural' },
          { name: 'Melancia', district: 'Paus Branco', zone: 'Rural' },
          { name: 'Mulatas', district: 'Paus Branco', zone: 'Rural' },
          { name: 'Pau Ferro', district: 'Paus Branco', zone: 'Rural' },
          { name: 'Poço do Boi', district: 'Paus Branco', zone: 'Rural' },
          { name: 'Quieto (Assentamento 25 de Maio)', district: 'Paus Branco', zone: 'Assentamento', details: 'Assentamento 25 de Maio' },
          { name: 'PA Ouro Branco', district: 'Paus Branco', zone: 'Assentamento', details: 'Projeto de Assentamento' },
          { name: 'PA Umarizeira', district: 'Paus Branco', zone: 'Assentamento', details: 'Projeto de Assentamento' }
        ]
      }
    ]
  },
  {
    id: 'distrito-uniao',
    name: '6. Distrito: União',
    shortName: 'União',
    type: 'Distrito',
    coords: DISTRICT_COORDINATES['União'],
    subgroups: [
      {
        label: 'Vila Principal',
        items: [
          { name: 'União', district: 'União', zone: 'Distrito', details: 'Vila Principal / Sede Distrital' }
        ]
      },
      {
        label: 'Comunidades, Fazendas e Assentamentos de União',
        items: [
          { name: 'Agrovila Umari (Assentamento Isca)', district: 'União', zone: 'Assentamento', details: 'Assentamento Isca' },
          { name: 'Baixa Verde', district: 'União', zone: 'Rural' },
          { name: 'Bom Princípio', district: 'União', zone: 'Rural' },
          { name: 'Fazenda Argentina', district: 'União', zone: 'Rural' },
          { name: 'Juazeiro', district: 'União', zone: 'Rural' },
          { name: 'Santa Rosa', district: 'União', zone: 'Rural' }
        ]
      }
    ]
  },
  {
    id: 'outros-pontos-dispersos',
    name: 'Outros Pontos Mapeados (Dispersos / Sítios)',
    shortName: 'Dispersos / Sítios',
    type: 'Disperso',
    coords: DISTRICT_COORDINATES['Outros Pontos / Dispersos'],
    subgroups: [
      {
        label: 'Sítios e Localidades Mapeadas',
        items: [
          { name: 'Anafuê', district: 'Outros Pontos / Dispersos', zone: 'Disperso' },
          { name: 'Areias', district: 'Outros Pontos / Dispersos', zone: 'Disperso' },
          { name: 'Boqueirão', district: 'Outros Pontos / Dispersos', zone: 'Disperso' },
          { name: 'Caieiras', district: 'Outros Pontos / Dispersos', zone: 'Disperso' },
          { name: 'Carnaubinha', district: 'Outros Pontos / Dispersos', zone: 'Disperso' },
          { name: 'Cruzeiro', district: 'Outros Pontos / Dispersos', zone: 'Disperso' },
          { name: 'Guajeru', district: 'Outros Pontos / Dispersos', zone: 'Disperso' },
          { name: 'Lajes dos Facundo', district: 'Outros Pontos / Dispersos', zone: 'Disperso' },
          { name: 'Lajes dos Lessas', district: 'Outros Pontos / Dispersos', zone: 'Disperso' },
          { name: 'Massapê', district: 'Outros Pontos / Dispersos', zone: 'Disperso' },
          { name: 'Várzea Redonda', district: 'Outros Pontos / Dispersos', zone: 'Disperso' }
        ]
      }
    ]
  }
];

/**
 * Lista plana consolidada de todas as localidades de Madalena
 */
export const ALL_MADALENA_LOCALITIES: MadalenaLocality[] = MADALENA_DISTRICT_GROUPS.flatMap(
  group => group.subgroups.flatMap(subgroup => subgroup.items)
);

/**
 * Lista retrocompatível DistrictNeighborhood com tipagem e metadados
 */
export const MADALENA_NEIGHBORHOODS: DistrictNeighborhood[] = ALL_MADALENA_LOCALITIES.map(loc => ({
  name: loc.name,
  district: loc.district,
  type: loc.zone,
  details: loc.details
}));

/**
 * Lista de nomes dos distritos oficiais
 */
export const MADALENA_DISTRICT_NAMES: string[] = [
  'Madalena (Sede)',
  'Macaoca',
  'Cajazeiras',
  'Cacimba Nova',
  'Paus Branco',
  'União',
  'Outros Pontos / Dispersos'
];

/**
 * Busca os dados de uma localidade pelo nome exato ou aproximado
 */
export function findLocality(name: string): MadalenaLocality | undefined {
  if (!name) return undefined;
  const clean = name.trim().toLowerCase();
  return ALL_MADALENA_LOCALITIES.find(loc => loc.name.toLowerCase() === clean);
}

/**
 * Retorna as coordenadas do distrito de uma dada localidade
 */
export function getCoordinatesForLocality(localityName: string): { lat: number; lng: number } {
  const loc = findLocality(localityName);
  if (loc && DISTRICT_COORDINATES[loc.district]) {
    return DISTRICT_COORDINATES[loc.district];
  }
  return DISTRICT_COORDINATES['Madalena (Sede)'];
}
