import { MadalenaLocality, DistrictGroup } from '../types';
import { 
  ALL_MADALENA_LOCALITIES, 
  DISTRICT_COORDINATES, 
  MADALENA_DISTRICT_NAMES 
} from '../data/localitiesData';

const LOCAL_STORAGE_KEY = 'mvm_madalena_localities_v2';

/**
 * Carrega a lista de localidades do localStorage ou usa a lista oficial do IPECE 2023 como padrão
 */
export function getStoredLocalities(): MadalenaLocality[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Erro ao ler localidades do localStorage:', err);
  }

  // Se não existir, salva o padrão do IPECE e retorna
  saveStoredLocalities(ALL_MADALENA_LOCALITIES);
  return ALL_MADALENA_LOCALITIES;
}

/**
 * Salva a lista de localidades no localStorage
 */
export function saveStoredLocalities(localities: MadalenaLocality[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localities));
  } catch (err) {
    console.error('Erro ao salvar localidades no localStorage:', err);
  }
}

/**
 * Cadastra uma nova localidade
 */
export function createStoredLocality(
  newLocality: MadalenaLocality,
  currentList: MadalenaLocality[]
): MadalenaLocality[] {
  // Evitar nomes duplicados exatos
  const exists = currentList.some(
    l => l.name.trim().toLowerCase() === newLocality.name.trim().toLowerCase()
  );
  if (exists) {
    throw new Error(`A localidade "${newLocality.name}" já está cadastrada.`);
  }

  const updated = [...currentList, { ...newLocality, name: newLocality.name.trim() }];
  saveStoredLocalities(updated);
  return updated;
}

/**
 * Atualiza uma localidade existente
 */
export function updateStoredLocality(
  originalName: string,
  updatedData: MadalenaLocality,
  currentList: MadalenaLocality[]
): MadalenaLocality[] {
  const index = currentList.findIndex(
    l => l.name.trim().toLowerCase() === originalName.trim().toLowerCase()
  );
  if (index === -1) {
    throw new Error(`Localidade "${originalName}" não encontrada para atualização.`);
  }

  // Se alterou o nome, checar duplicatas com outras
  const newNameLower = updatedData.name.trim().toLowerCase();
  const origNameLower = originalName.trim().toLowerCase();
  if (newNameLower !== origNameLower) {
    const nameInUse = currentList.some(
      (l, idx) => idx !== index && l.name.trim().toLowerCase() === newNameLower
    );
    if (nameInUse) {
      throw new Error(`O nome "${updatedData.name}" já está sendo usado por outra localidade.`);
    }
  }

  const updated = [...currentList];
  updated[index] = { ...updatedData, name: updatedData.name.trim() };
  saveStoredLocalities(updated);
  return updated;
}

/**
 * Exclui uma localidade pelo nome
 */
export function deleteStoredLocality(
  name: string,
  currentList: MadalenaLocality[]
): MadalenaLocality[] {
  const targetLower = name.trim().toLowerCase();
  const updated = currentList.filter(l => l.name.trim().toLowerCase() !== targetLower);
  saveStoredLocalities(updated);
  return updated;
}

/**
 * Restaura todas as localidades para a lista oficial padrão IPECE 2023 / Câmara
 */
export function resetStoredLocalitiesToDefault(): MadalenaLocality[] {
  saveStoredLocalities(ALL_MADALENA_LOCALITIES);
  return ALL_MADALENA_LOCALITIES;
}

/**
 * Constrói dinamicamente os grupos de distritos a partir da lista atualizada de localidades
 */
export function buildDynamicDistrictGroups(localities: MadalenaLocality[]): DistrictGroup[] {
  // Distritos padrão com metadados
  const districtConfigs: {
    id: string;
    name: string;
    shortName: string;
    type: 'Sede' | 'Distrito' | 'Disperso';
    defaultCoords: { lat: number; lng: number };
  }[] = [
    {
      id: 'distrito-madalena-sede',
      name: '1. Distrito: Madalena (Sede)',
      shortName: 'Madalena (Sede)',
      type: 'Sede',
      defaultCoords: DISTRICT_COORDINATES['Madalena (Sede)'] || { lat: -4.8042, lng: -39.5768 }
    },
    {
      id: 'distrito-macaoca',
      name: '2. Distrito: Macaoca',
      shortName: 'Macaoca',
      type: 'Distrito',
      defaultCoords: DISTRICT_COORDINATES['Macaoca'] || { lat: -4.8950, lng: -39.5420 }
    },
    {
      id: 'distrito-cajazeiras',
      name: '3. Distrito: Cajazeiras',
      shortName: 'Cajazeiras',
      type: 'Distrito',
      defaultCoords: DISTRICT_COORDINATES['Cajazeiras'] || { lat: -4.7350, lng: -39.5250 }
    },
    {
      id: 'distrito-cacimba-nova',
      name: '4. Distrito: Cacimba Nova',
      shortName: 'Cacimba Nova',
      type: 'Distrito',
      defaultCoords: DISTRICT_COORDINATES['Cacimba Nova'] || { lat: -4.8450, lng: -39.6900 }
    },
    {
      id: 'distrito-paus-branco',
      name: '5. Distrito: Paus Branco',
      shortName: 'Paus Branco',
      type: 'Distrito',
      defaultCoords: DISTRICT_COORDINATES['Paus Branco'] || { lat: -4.9500, lng: -39.6200 }
    },
    {
      id: 'distrito-uniao',
      name: '6. Distrito: União',
      shortName: 'União',
      type: 'Distrito',
      defaultCoords: DISTRICT_COORDINATES['União'] || { lat: -4.7200, lng: -39.6500 }
    },
    {
      id: 'outros-pontos-dispersos',
      name: 'Outros Pontos Mapeados (Dispersos / Sítios)',
      shortName: 'Dispersos / Sítios',
      type: 'Disperso',
      defaultCoords: DISTRICT_COORDINATES['Outros Pontos / Dispersos'] || { lat: -4.8100, lng: -39.6000 }
    }
  ];

  // Agrupar itens
  const groups: DistrictGroup[] = [];

  for (const cfg of districtConfigs) {
    const itemsInDistrict = localities.filter(l => {
      if (cfg.shortName === 'Dispersos / Sítios') {
        return l.district === 'Outros Pontos / Dispersos' || l.district === 'Dispersos / Sítios';
      }
      return l.district.toLowerCase() === cfg.shortName.toLowerCase();
    });

    if (itemsInDistrict.length === 0) continue;

    // Criar subgrupos baseados nas zonas
    const subgroupsMap = new Map<string, MadalenaLocality[]>();

    for (const item of itemsInDistrict) {
      let subLabel = item.subgroup;
      if (!subLabel) {
        if (cfg.shortName === 'Madalena (Sede)') {
          subLabel = item.zone === 'Urbano' ? 'Área Urbana (Bairros da Sede)' : 'Área Rural do Distrito-Sede';
        } else if (item.zone === 'Distrito') {
          subLabel = 'Vila Principal';
        } else if (item.zone === 'Assentamento') {
          subLabel = 'Assentamentos';
        } else {
          subLabel = 'Comunidades e Fazendas';
        }
      }

      if (!subgroupsMap.has(subLabel)) {
        subgroupsMap.set(subLabel, []);
      }
      subgroupsMap.get(subLabel)!.push(item);
    }

    const subgroups = Array.from(subgroupsMap.entries()).map(([label, items]) => ({
      label,
      items: items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    }));

    groups.push({
      id: cfg.id,
      name: cfg.name,
      shortName: cfg.shortName,
      type: cfg.type,
      coords: cfg.defaultCoords,
      subgroups
    });
  }

  // Checar se há distritos personalizados não cadastrados nos configs padrão
  const knownDistricts = new Set(districtConfigs.map(c => c.shortName.toLowerCase()));
  knownDistricts.add('outros pontos / dispersos');

  const customDistricts = Array.from(
    new Set(
      localities
        .map(l => l.district)
        .filter(d => !knownDistricts.has(d.toLowerCase()))
    )
  );

  for (const customName of customDistricts) {
    const items = localities.filter(l => l.district.toLowerCase() === customName.toLowerCase());
    if (items.length > 0) {
      groups.push({
        id: `custom-distrito-${customName.toLowerCase().replace(/\s+/g, '-')}`,
        name: `Distrito: ${customName}`,
        shortName: customName,
        type: 'Distrito',
        coords: { lat: -4.8042, lng: -39.5768 },
        subgroups: [
          {
            label: 'Localidades Cadastradas',
            items: items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
          }
        ]
      });
    }
  }

  return groups;
}

/**
 * Busca uma localidade na lista dinâmica
 */
export function findLocalityInList(name: string, list: MadalenaLocality[]): MadalenaLocality | undefined {
  if (!name) return undefined;
  const clean = name.trim().toLowerCase();
  return list.find(l => l.name.toLowerCase() === clean);
}

/**
 * Obtém as coordenadas para uma localidade da lista dinâmica
 */
export function getCoordinatesFromList(
  name: string,
  list: MadalenaLocality[]
): { lat: number; lng: number } {
  const loc = findLocalityInList(name, list);
  if (loc) {
    if (loc.lat && loc.lng) {
      return { lat: loc.lat, lng: loc.lng };
    }
    if (DISTRICT_COORDINATES[loc.district]) {
      return DISTRICT_COORDINATES[loc.district];
    }
  }
  return DISTRICT_COORDINATES['Madalena (Sede)'] || { lat: -4.8042, lng: -39.5768 };
}
