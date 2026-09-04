import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { Report, ReportStatus, SecretariatId, CategoryId, SecretariatInfo } from '../types';
import { INITIAL_REPORTS, SECRETARIATS } from '../data/mockData';

export interface ReportFilterOptions {
  secretariatId?: string;
  status?: string;
  neighborhood?: string;
  query?: string;
}

/**
 * Maps database row (snake_case) to client Report model (camelCase)
 */
export function mapDatabaseRowToReport(row: any): Report {
  return {
    id: String(row.id),
    protocol: row.protocol,
    type: row.type || 'anonima',
    secretariatId: row.secretariat_id as SecretariatId,
    category: row.category as CategoryId,
    customCategory: row.custom_category || undefined,
    description: row.description,
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    location: row.location || {
      address: 'Madalena - CE',
      neighborhood: 'Centro',
      lat: -4.8042,
      lng: -39.5768,
    },
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    status: (row.status || 'recebida') as ReportStatus,
    citizenName: row.citizen_name || undefined,
    citizenCpf: row.citizen_cpf || undefined,
    citizenEmail: row.citizen_email || undefined,
    citizenPhone: row.citizen_phone || undefined,
    timeline: Array.isArray(row.timeline) ? row.timeline : [],
    comments: Array.isArray(row.comments) ? row.comments : [],
    solutionPhotos: Array.isArray(row.solution_photos) ? row.solution_photos : undefined,
    solutionDate: row.solution_date || undefined,
    assignedOfficer: row.assigned_officer || undefined,
    rating: row.rating !== null && row.rating !== undefined ? Number(row.rating) : undefined,
    ratingFeedback: row.rating_feedback || undefined,
  };
}

/**
 * Maps client Report model (camelCase) to database row (snake_case)
 */
export function mapReportToDatabaseRow(report: Partial<Report>): Record<string, any> {
  const row: Record<string, any> = {};

  if (report.protocol) row.protocol = report.protocol;
  if (report.type) row.type = report.type;
  if (report.secretariatId) row.secretariat_id = report.secretariatId;
  if (report.category) row.category = report.category;
  if (report.customCategory !== undefined) row.custom_category = report.customCategory;
  if (report.description) row.description = report.description;
  if (report.attachments) row.attachments = report.attachments;
  if (report.location) row.location = report.location;
  if (report.status) row.status = report.status;
  if (report.citizenName !== undefined) row.citizen_name = report.citizenName;
  if (report.citizenCpf !== undefined) row.citizen_cpf = report.citizenCpf;
  if (report.citizenEmail !== undefined) row.citizen_email = report.citizenEmail;
  if (report.citizenPhone !== undefined) row.citizen_phone = report.citizenPhone;
  if (report.timeline) row.timeline = report.timeline;
  if (report.comments) row.comments = report.comments;
  if (report.solutionPhotos !== undefined) row.solution_photos = report.solutionPhotos;
  if (report.solutionDate !== undefined) row.solution_date = report.solutionDate;
  if (report.assignedOfficer !== undefined) row.assigned_officer = report.assignedOfficer;
  if (report.rating !== undefined) row.rating = report.rating;
  if (report.ratingFeedback !== undefined) row.rating_feedback = report.ratingFeedback;

  return row;
}

/**
 * Fetch all reports from Supabase (or fallback to /api/reports / mock data)
 */
export async function getReports(filters?: ReportFilterOptions): Promise<Report[]> {
  const client = getSupabase();

  if (client) {
    try {
      let query = client
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.secretariatId && filters.secretariatId !== 'todas') {
        query = query.eq('secretariat_id', filters.secretariatId);
      }
      if (filters?.status && filters.status !== 'todos') {
        query = query.eq('status', filters.status);
      }
      if (filters?.query) {
        query = query.or(`protocol.ilike.%${filters.query}%,description.ilike.%${filters.query}%,citizen_name.ilike.%${filters.query}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Erro ao consultar Supabase:', error.message);
      } else if (data) {
        // Se a tabela existe e retornou dados (mesmo que vazia []), retorne os dados reais do Supabase
        if (data.length === 0) {
          return [];
        }
        return data.map(mapDatabaseRowToReport);
      }
    } catch (err) {
      console.warn('Falha na comunicação direta com Supabase:', err);
    }
  }

  // Fallback to Express backend API
  try {
    const res = await fetch('/api/reports');
    if (res.ok) {
      const json = await res.json();
      if (json.reports && Array.isArray(json.reports)) {
        return json.reports;
      }
    }
  } catch (apiErr) {
    console.warn('API local offline, utilizando dados mock:', apiErr);
  }

  return INITIAL_REPORTS;
}

/**
 * Fetch a single report by protocol from Supabase
 */
export async function getReportByProtocol(protocol: string): Promise<Report | null> {
  const cleanProtocol = protocol.trim().toUpperCase();
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await client
        .from('reports')
        .select('*')
        .ilike('protocol', cleanProtocol)
        .maybeSingle();

      if (error) {
        console.warn('Erro ao buscar protocolo no Supabase:', error.message);
      } else if (data) {
        return mapDatabaseRowToReport(data);
      }
    } catch (err) {
      console.warn('Falha ao consultar protocolo no Supabase:', err);
    }
  }

  // Fallback to Express backend API
  try {
    const res = await fetch(`/api/reports/protocol/${encodeURIComponent(cleanProtocol)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.report) {
        return json.report;
      }
    }
  } catch (apiErr) {
    console.warn('Erro na busca de protocolo via API:', apiErr);
  }

  return null;
}

/**
 * Create a new report in Supabase
 */
export async function createReport(reportPayload: any): Promise<Report> {
  const currentYear = new Date().getFullYear();
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
  const protocol = `MVM-${currentYear}-${randomSixDigits}`;
  const nowISO = new Date().toISOString();

  const reportData: Report = {
    id: `rep-${Date.now()}`,
    protocol,
    type: reportPayload.type || 'anonima',
    secretariatId: reportPayload.secretariatId,
    category: reportPayload.category || 'outro',
    customCategory: reportPayload.customCategory,
    description: reportPayload.description,
    attachments: reportPayload.attachments || [],
    location: reportPayload.location || {
      address: 'Madalena - CE',
      neighborhood: 'Centro',
      lat: -4.8042,
      lng: -39.5768,
    },
    createdAt: nowISO,
    updatedAt: nowISO,
    status: 'recebida',
    citizenName: reportPayload.citizenName,
    citizenCpf: reportPayload.citizenCpf,
    citizenEmail: reportPayload.citizenEmail,
    citizenPhone: reportPayload.citizenPhone,
    timeline: [
      {
        id: `t-${Date.now()}-1`,
        status: 'recebida',
        date: nowISO,
        title: 'Denúncia Registrada',
        description: reportPayload.type === 'anonima'
          ? 'Denúncia anônima cadastrada com sucesso no sistema +VOZ Madalena.'
          : `Denúncia registrada pelo cidadão ${reportPayload.citizenName || ''}.`,
        author: 'Sistema +VOZ',
      },
    ],
    comments: [],
  };

  const client = getSupabase();
  if (client) {
    try {
      const dbRow = mapReportToDatabaseRow(reportData);
      const { data, error } = await client
        .from('reports')
        .insert([dbRow])
        .select()
        .single();

      if (error) {
        console.warn('Erro ao inserir no Supabase:', error.message);
      } else if (data) {
        return mapDatabaseRowToReport(data);
      }
    } catch (err) {
      console.warn('Falha na inserção direta no Supabase:', err);
    }
  }

  // Fallback to Express backend API
  try {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportPayload),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.report) {
        return json.report;
      }
    }
  } catch (err) {
    console.warn('Fallback para inserção local:', err);
  }

  return reportData;
}

/**
 * Update report status / add comments in Supabase
 */
export async function updateReportStatus(
  reportId: string,
  update: {
    status?: ReportStatus;
    comment?: string;
    author?: string;
    role?: string;
    isInternal?: boolean;
    solutionPhotos?: string[];
    assignedOfficer?: string;
  },
  currentReport: Report
): Promise<Report> {
  const nowISO = new Date().toISOString();
  const updatedTimeline = [...currentReport.timeline];
  const updatedComments = [...currentReport.comments];

  if (update.status && update.status !== currentReport.status) {
    const statusTitles: Record<string, string> = {
      recebida: 'Recebida',
      em_analise: 'Em Análise na Secretaria',
      encaminhada: 'Encaminhada ao Setor Operacional',
      em_atendimento: 'Em Atendimento Técnico',
      resolvida: 'Ocorrência Resolvida',
    };

    updatedTimeline.push({
      id: `t-${Date.now()}`,
      status: update.status,
      date: nowISO,
      title: statusTitles[update.status] || 'Atualização de Status',
      description: update.comment || `Status alterado para ${update.status.replace('_', ' ')}.`,
      author: update.author || 'Secretaria Responsável',
      photos: update.solutionPhotos,
    });
  }

  if (update.comment) {
    updatedComments.push({
      id: `c-${Date.now()}`,
      author: update.author || 'Servidor Público',
      role: update.role || 'Gestão +VOZ Madalena',
      text: update.comment,
      date: nowISO,
      isInternal: !!update.isInternal,
    });
  }

  const updatedReport: Report = {
    ...currentReport,
    status: update.status || currentReport.status,
    timeline: updatedTimeline,
    comments: updatedComments,
    solutionPhotos: update.solutionPhotos
      ? [...(currentReport.solutionPhotos || []), ...update.solutionPhotos]
      : currentReport.solutionPhotos,
    assignedOfficer: update.assignedOfficer || currentReport.assignedOfficer,
    solutionDate: update.status === 'resolvida' ? nowISO : currentReport.solutionDate,
    updatedAt: nowISO,
  };

  const client = getSupabase();
  if (client) {
    try {
      const dbRow = mapReportToDatabaseRow(updatedReport);
      const { data, error } = await client
        .from('reports')
        .update(dbRow)
        .eq('id', reportId)
        .select()
        .single();

      if (error) {
        console.warn('Erro ao atualizar no Supabase:', error.message);
      } else if (data) {
        return mapDatabaseRowToReport(data);
      }
    } catch (err) {
      console.warn('Falha na atualização direta do Supabase:', err);
    }
  }

  // Fallback to Express backend API
  try {
    const res = await fetch(`/api/reports/${reportId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.report) {
        return json.report;
      }
    }
  } catch (err) {
    console.warn('Falha na atualização via API:', err);
  }

  return updatedReport;
}

/**
 * Rate a resolved report
 */
export async function rateReport(
  reportId: string,
  rating: number,
  feedback?: string
): Promise<boolean> {
  const client = getSupabase();
  if (client) {
    try {
      const { error } = await client
        .from('reports')
        .update({
          rating,
          rating_feedback: feedback || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (!error) return true;
    } catch (err) {
      console.warn('Erro ao avaliar no Supabase:', err);
    }
  }

  try {
    const res = await fetch(`/api/reports/${reportId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, feedback }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Erro ao registrar avaliação:', err);
    return false;
  }
}

/**
 * Upload an attachment file or audio blob to Supabase Storage bucket ('complaint-attachments')
 */
export async function uploadAttachment(file: File | Blob, customFileName?: string): Promise<string | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    let fileName: string;
    if (customFileName) {
      fileName = customFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    } else if ('name' in file && typeof (file as File).name === 'string') {
      const originalName = (file as File).name;
      const fileExt = originalName.split('.').pop() || 'bin';
      const cleanBase = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
      fileName = `${Date.now()}_${cleanBase}.${fileExt}`;
    } else {
      const mimeType = file.type || '';
      const ext = mimeType.includes('audio') ? 'webm' : (mimeType.includes('png') ? 'png' : 'jpg');
      fileName = `anexo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    }

    const filePath = `reports/${fileName}`;

    const { error: uploadError } = await client.storage
      .from('complaint-attachments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.warn('Erro no upload para Supabase Storage:', uploadError.message);
      return null;
    }

    const { data } = client.storage
      .from('complaint-attachments')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.warn('Erro ao enviar anexo para Supabase Storage:', err);
    return null;
  }
}

/**
 * Upload solution photo for resolved complaints in Supabase Storage
 */
export async function uploadSolutionPhoto(file: File | Blob, customFileName?: string): Promise<string | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    let fileName: string;
    if (customFileName) {
      fileName = customFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    } else if ('name' in file && typeof (file as File).name === 'string') {
      const originalName = (file as File).name;
      const fileExt = originalName.split('.').pop() || 'jpg';
      fileName = `solucao_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    } else {
      fileName = `solucao_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;
    }

    const filePath = `solutions/${fileName}`;

    const { error: uploadError } = await client.storage
      .from('complaint-attachments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.warn('Erro ao enviar foto da solução para Supabase Storage:', uploadError.message);
      return null;
    }

    const { data } = client.storage
      .from('complaint-attachments')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.warn('Erro ao enviar foto de solução:', err);
    return null;
  }
}

/**
 * Check if the Supabase Storage bucket 'complaint-attachments' is reachable
 */
export async function checkSupabaseStorage(): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { data, error } = await client.storage.getBucket('complaint-attachments');
    return !error && !!data;
  } catch {
    return false;
  }
}

/**
 * Subscribe to realtime updates on reports
 */
export function subscribeToReportsRealtime(onUpdate: (payload: any) => void): () => void {
  const client = getSupabase();
  if (!client) {
    return () => {};
  }

  try {
    const channel = client
      .channel('public:reports')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Falha ao assinar realtime:', err);
    return () => {};
  }
}

// ==============================================================================
// SECRETARIATS (SECRETARIAS MUNICIPAIS) CRUD METHODS
// ==============================================================================

/**
 * Maps database row (snake_case) to client SecretariatInfo model (camelCase)
 */
export function mapDatabaseRowToSecretariat(row: any): SecretariatInfo {
  return {
    id: row.id as SecretariatId,
    name: row.name || 'Secretaria Municipal',
    description: row.description || '',
    iconName: row.icon_name || 'Building2',
    color: row.color || '#0F8A43',
    responsibleName: row.responsible_name || '',
    email: row.email || '',
    phone: row.phone || '',
    active: row.active !== undefined ? Boolean(row.active) : true,
    address: row.address || '',
    slaDays: typeof row.sla_days === 'number' ? row.sla_days : 5,
  };
}

/**
 * Maps client SecretariatInfo model (camelCase) to database row (snake_case)
 */
export function mapSecretariatToDatabaseRow(sec: Partial<SecretariatInfo>): Record<string, any> {
  const row: Record<string, any> = {};
  if (sec.id) row.id = sec.id;
  if (sec.name !== undefined) row.name = sec.name;
  if (sec.description !== undefined) row.description = sec.description;
  if (sec.iconName !== undefined) row.icon_name = sec.iconName;
  if (sec.color !== undefined) row.color = sec.color;
  if (sec.responsibleName !== undefined) row.responsible_name = sec.responsibleName;
  if (sec.email !== undefined) row.email = sec.email;
  if (sec.phone !== undefined) row.phone = sec.phone;
  if (sec.active !== undefined) row.active = sec.active;
  if (sec.address !== undefined) row.address = sec.address;
  if (sec.slaDays !== undefined) row.sla_days = sec.slaDays;
  return row;
}

/**
 * Fetch all secretariats from Supabase or fallback to API / mock
 */
export async function getSecretariats(): Promise<SecretariatInfo[]> {
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await client
        .from('secretariats')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.warn('Erro ao consultar secretarias no Supabase:', error.message);
      } else if (data && data.length > 0) {
        return data.map(mapDatabaseRowToSecretariat);
      }
    } catch (err) {
      console.warn('Falha na comunicação direta com Supabase (secretarias):', err);
    }
  }

  // Fallback to Express backend API
  try {
    const res = await fetch('/api/secretariats');
    if (res.ok) {
      const json = await res.json();
      if (json.secretariats && Array.isArray(json.secretariats)) {
        return json.secretariats;
      }
    }
  } catch (apiErr) {
    console.warn('API local de secretarias indisponível, usando dados mock:', apiErr);
  }

  return SECRETARIATS;
}

/**
 * Update an existing secretariat in Supabase / API backend
 */
export async function updateSecretariat(
  id: string, 
  updates: Partial<SecretariatInfo>, 
  currentList: SecretariatInfo[]
): Promise<SecretariatInfo[]> {
  const current = currentList.find(s => s.id === id);
  const updatedItem: SecretariatInfo = {
    ...(current || {
      id: id as SecretariatId,
      name: updates.name || 'Secretaria Municipal',
      description: '',
      iconName: 'Building2',
      color: '#0F8A43',
      responsibleName: '',
      email: '',
      phone: '',
      active: true,
      address: '',
      slaDays: 5,
    }),
    ...updates,
  };

  const client = getSupabase();
  if (client) {
    try {
      const dbRow = mapSecretariatToDatabaseRow(updatedItem);
      const { error } = await client
        .from('secretariats')
        .update(dbRow)
        .eq('id', id);

      if (error) {
        console.warn('Erro ao atualizar secretaria no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('Falha ao salvar secretaria no Supabase:', err);
    }
  }

  // Fallback / sync with backend API
  try {
    await fetch(`/api/secretariats/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  } catch (err) {
    console.warn('Falha ao atualizar secretaria via API:', err);
  }

  return currentList.map(s => (s.id === id ? updatedItem : s));
}

/**
 * Create a new secretariat in Supabase / API backend
 */
export async function createSecretariat(
  newSec: SecretariatInfo, 
  currentList: SecretariatInfo[]
): Promise<SecretariatInfo[]> {
  const client = getSupabase();
  if (client) {
    try {
      const dbRow = mapSecretariatToDatabaseRow(newSec);
      const { error } = await client
        .from('secretariats')
        .insert([dbRow]);

      if (error) {
        console.warn('Erro ao criar secretaria no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('Falha ao inserir secretaria no Supabase:', err);
    }
  }

  // Fallback / sync with backend API
  try {
    await fetch('/api/secretariats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSec),
    });
  } catch (err) {
    console.warn('Falha ao criar secretaria via API:', err);
  }

  return [...currentList, newSec];
}

/**
 * Delete a secretariat in Supabase / API backend
 */
export async function deleteSecretariat(
  id: string, 
  currentList: SecretariatInfo[]
): Promise<SecretariatInfo[]> {
  const client = getSupabase();
  if (client) {
    try {
      const { error } = await client
        .from('secretariats')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Erro ao excluir secretaria no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('Falha ao excluir secretaria no Supabase:', err);
    }
  }

  // Fallback / sync with backend API
  try {
    await fetch(`/api/secretariats/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Falha ao excluir secretaria via API:', err);
  }

  return currentList.filter(s => s.id !== id);
}

/**
 * Subscribe to realtime updates on secretariats
 */
export function subscribeToSecretariatsRealtime(onUpdate: () => void): () => void {
  const client = getSupabase();
  if (!client) {
    return () => {};
  }

  try {
    const channel = client
      .channel('public:secretariats')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'secretariats' },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Falha ao assinar realtime de secretarias:', err);
    return () => {};
  }
}
