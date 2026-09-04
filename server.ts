import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { INITIAL_REPORTS, SECRETARIATS, ALL_MADALENA_LOCALITIES } from "./src/data/mockData";
import { Report, SecretariatId, CategoryId } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Supabase Server Client safely
function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("your-project") || url.includes("SEU_PROJETO") || !url.startsWith("http")) {
    return null;
  }

  try {
    return createClient(url, key);
  } catch (err) {
    console.warn("Falha ao inicializar Supabase no backend:", err);
    return null;
  }
}

// Store in-memory reports initialized with mock data as fallback
let reportsDatabase: Report[] = [...INITIAL_REPORTS];
let secretariatsDatabase = [...SECRETARIATS];

// Helper to get Gemini AI instance safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// =====================================
// API ROUTES
// =====================================

// Health check and Supabase status
app.get("/api/health", (_req, res) => {
  const isSupabaseActive = !!getSupabaseServerClient();
  res.json({ 
    status: "ok", 
    app: "+VOZ Madalena", 
    supabaseConnected: isSupabaseActive,
    storageEngine: isSupabaseActive ? "Supabase (PostgreSQL)" : "Local In-Memory / Demo Store",
    timestamp: new Date().toISOString() 
  });
});

app.get("/api/supabase-status", async (_req, res) => {
  const supabase = getSupabaseServerClient();
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

  if (!supabase) {
    return res.json({
      configured: false,
      urlConfigured: Boolean(url && !url.includes("your-project")),
      keyConfigured: Boolean(key && !key.includes("your-anon")),
      error: "Variáveis de ambiente do Supabase não encontradas ou inválidas."
    });
  }

  try {
    // Check 'reports' table
    const reportsQuery = await supabase.from('reports').select('id, protocol, status', { count: 'exact' }).limit(5);
    
    // Check 'secretariats' table
    const secretariatsQuery = await supabase.from('secretariats').select('id, name', { count: 'exact' }).limit(15);

    // Check 'localities' table
    const localitiesQuery = await supabase.from('localities').select('id, name, district', { count: 'exact' }).limit(10);

    // Check 'complaint-attachments' storage bucket
    let storageStatus = { exists: false, error: null as string | null };
    try {
      const bucketQuery = await supabase.storage.getBucket('complaint-attachments');
      storageStatus = {
        exists: !bucketQuery.error,
        error: bucketQuery.error ? bucketQuery.error.message : null
      };
    } catch (sErr: any) {
      storageStatus = { exists: false, error: sErr?.message || String(sErr) };
    }

    res.json({
      configured: true,
      connection: "success",
      tables: {
        reports: {
          exists: !reportsQuery.error,
          count: reportsQuery.count ?? (reportsQuery.data ? reportsQuery.data.length : 0),
          error: reportsQuery.error ? reportsQuery.error.message : null,
          sample: reportsQuery.data || []
        },
        secretariats: {
          exists: !secretariatsQuery.error,
          count: secretariatsQuery.count ?? (secretariatsQuery.data ? secretariatsQuery.data.length : 0),
          error: secretariatsQuery.error ? secretariatsQuery.error.message : null,
          sample: secretariatsQuery.data || []
        },
        localities: {
          exists: !localitiesQuery.error,
          count: localitiesQuery.count ?? (localitiesQuery.data ? localitiesQuery.data.length : 0),
          error: localitiesQuery.error ? localitiesQuery.error.message : null,
          sample: localitiesQuery.data || []
        }
      },
      storage: {
        bucket: 'complaint-attachments',
        exists: storageStatus.exists,
        error: storageStatus.error
      },
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.json({
      configured: true,
      connection: "failed",
      error: err?.message || String(err)
    });
  }
});

// Helper to sanitize report data for public endpoints under LGPD (Lei 13.709/2018)
function sanitizeReportForPublic(report: Report): Report {
  if (report.type === 'anonima') {
    return {
      ...report,
      citizenName: undefined,
      citizenCpf: undefined,
      citizenEmail: undefined,
      citizenPhone: undefined
    };
  }

  // If identified: mask personal data for public queries
  const maskedName = report.citizenName
    ? `${report.citizenName.split(' ')[0]} ${report.citizenName.split(' ')[1]?.[0] || ''}*** (Identidade protegida sob sigilo LGPD)`
    : 'Cidadão Identificado';

  return {
    ...report,
    citizenName: maskedName,
    citizenCpf: undefined, // Nunca expor CPF em rota pública
    citizenEmail: undefined, // Nunca expor e-mail em rota pública
    citizenPhone: undefined // Nunca expor telefone em rota pública
  };
}

// GET all reports
app.get("/api/reports", async (req, res) => {
  const { secretariat, status, query, neighborhood } = req.query;
  const isAdmin = req.headers['x-admin-token'] === 'madalena-ouvidoria-2026';

  let reportsToReturn = [...reportsDatabase];

  // Try to load fresh reports from Supabase if connected
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      let sbQuery = supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (secretariat && secretariat !== 'todas') sbQuery = sbQuery.eq('secretariat_id', secretariat);
      if (status && status !== 'todos') sbQuery = sbQuery.eq('status', status);
      
      const { data, error } = await sbQuery;
      if (!error && data && data.length > 0) {
        reportsToReturn = data.map(row => ({
          id: String(row.id),
          protocol: row.protocol,
          type: row.type || 'anonima',
          secretariatId: row.secretariat_id,
          category: row.category,
          customCategory: row.custom_category,
          description: row.description,
          attachments: row.attachments || [],
          location: row.location || { address: 'Madalena - CE', neighborhood: 'Centro', lat: -4.8042, lng: -39.5768 },
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          status: row.status,
          citizenName: row.citizen_name,
          citizenCpf: row.citizen_cpf,
          citizenEmail: row.citizen_email,
          citizenPhone: row.citizen_phone,
          timeline: row.timeline || [],
          comments: row.comments || [],
          solutionPhotos: row.solution_photos,
          solutionDate: row.solution_date,
          assignedOfficer: row.assigned_officer,
          rating: row.rating,
          ratingFeedback: row.rating_feedback
        }));
      }
    } catch (err) {
      console.warn("Consulta Supabase falhou, usando base em memória:", err);
    }
  }

  let filtered = [...reportsToReturn];

  if (secretariat && typeof secretariat === "string" && secretariat !== "todas") {
    filtered = filtered.filter(r => r.secretariatId === secretariat);
  }
  if (status && typeof status === "string" && status !== "todos") {
    filtered = filtered.filter(r => r.status === status);
  }
  if (neighborhood && typeof neighborhood === "string" && neighborhood !== "todos") {
    filtered = filtered.filter(r => r.location.neighborhood.toLowerCase().includes(neighborhood.toLowerCase()));
  }
  if (query && typeof query === "string") {
    const q = query.toLowerCase();
    filtered = filtered.filter(r => 
      r.protocol.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.location.address.toLowerCase().includes(q) ||
      (r.citizenName && r.citizenName.toLowerCase().includes(q))
    );
  }

  // Sort by latest
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Enforce LGPD: if not admin, sanitize citizen personal data
  const finalReports = isAdmin ? filtered : filtered.map(sanitizeReportForPublic);

  res.json({ reports: finalReports });
});

// GET report by protocol
app.get("/api/reports/protocol/:protocol", async (req, res) => {
  const protocolInput = req.params.protocol.trim().toUpperCase();
  const isAdmin = req.headers['x-admin-token'] === 'madalena-ouvidoria-2026';

  let report = reportsDatabase.find(r => r.protocol.toUpperCase() === protocolInput);

  // Check Supabase if connected
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('reports').select('*').ilike('protocol', protocolInput).maybeSingle();
      if (!error && data) {
        report = {
          id: String(data.id),
          protocol: data.protocol,
          type: data.type || 'anonima',
          secretariatId: data.secretariat_id,
          category: data.category,
          customCategory: data.custom_category,
          description: data.description,
          attachments: data.attachments || [],
          location: data.location || { address: 'Madalena - CE', neighborhood: 'Centro', lat: -4.8042, lng: -39.5768 },
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          status: data.status,
          citizenName: data.citizen_name,
          citizenCpf: data.citizen_cpf,
          citizenEmail: data.citizen_email,
          citizenPhone: data.citizen_phone,
          timeline: data.timeline || [],
          comments: data.comments || [],
          solutionPhotos: data.solution_photos,
          solutionDate: data.solution_date,
          assignedOfficer: data.assigned_officer,
          rating: data.rating,
          ratingFeedback: data.rating_feedback
        };
      }
    } catch (err) {
      console.warn("Erro ao buscar protocolo no Supabase:", err);
    }
  }

  if (!report) {
    return res.status(404).json({ error: "Protocolo não encontrado no sistema +VOZ Madalena." });
  }

  const finalReport = isAdmin ? report : sanitizeReportForPublic(report);
  res.json({ report: finalReport });
});

// POST create new report
app.post("/api/reports", async (req, res) => {
  const body = req.body;
  if (!body.description || !body.secretariatId) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes (descrição e secretaria)." });
  }

  const currentYear = new Date().getFullYear();
  const protocol = `MVM-${currentYear}-${String(Math.floor(100000 + Math.random() * 900000))}`;
  const nowISO = new Date().toISOString();

  // If anonymous, ensure no personal data is stored
  const isAnonymous = body.type === 'anonima';

  const newReport: Report = {
    id: `rep-${Date.now()}`,
    protocol,
    type: isAnonymous ? 'anonima' : 'identificada',
    secretariatId: body.secretariatId,
    category: body.category || 'outro',
    customCategory: body.customCategory,
    description: body.description,
    attachments: body.attachments || [],
    location: body.location || {
      address: 'Madalena - CE',
      neighborhood: 'Centro',
      lat: -4.8042,
      lng: -39.5768
    },
    createdAt: nowISO,
    updatedAt: nowISO,
    status: 'recebida',
    citizenName: isAnonymous ? undefined : body.citizenName,
    citizenCpf: isAnonymous ? undefined : body.citizenCpf,
    citizenEmail: isAnonymous ? undefined : body.citizenEmail,
    citizenPhone: isAnonymous ? undefined : body.citizenPhone,
    timeline: [
      {
        id: `t-${Date.now()}-1`,
        status: 'recebida',
        date: nowISO,
        title: 'Denúncia Registrada',
        description: isAnonymous 
          ? 'Denúncia anônima cadastrada com sucesso. Protocolo gerado para acompanhamento.'
          : `Denúncia registrada por ${body.citizenName || 'Cidadão'}.`,
        author: 'Sistema +VOZ'
      }
    ],
    comments: []
  };

  // Sync to Supabase if connected
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const dbRow = {
        protocol: newReport.protocol,
        type: newReport.type,
        secretariat_id: newReport.secretariatId,
        category: newReport.category,
        custom_category: newReport.customCategory,
        description: newReport.description,
        attachments: newReport.attachments,
        location: newReport.location,
        status: newReport.status,
        citizen_name: newReport.citizenName,
        citizen_cpf: newReport.citizenCpf,
        citizen_email: newReport.citizenEmail,
        citizen_phone: newReport.citizenPhone,
        timeline: newReport.timeline,
        comments: newReport.comments
      };

      const { data, error } = await supabase.from('reports').insert([dbRow]).select().single();
      if (!error && data) {
        newReport.id = String(data.id);
      }
    } catch (sbErr) {
      console.warn("Erro ao sincronizar relatório com Supabase:", sbErr);
    }
  }

  reportsDatabase.unshift(newReport);
  res.status(201).json({ success: true, report: newReport });
});

// PATCH update report status / add comment (Admin/Secretariat action)
app.patch("/api/reports/:id", async (req, res) => {
  const { id } = req.params;
  const { status, comment, author, role, isInternal, solutionPhotos, assignedOfficer } = req.body;

  const reportIndex = reportsDatabase.findIndex(r => r.id === id);
  const nowISO = new Date().toISOString();

  let report = reportIndex !== -1 ? reportsDatabase[reportIndex] : null;

  if (report) {
    let updatedStatus = report.status;
    if (status && status !== report.status) {
      updatedStatus = status;
      const statusTitles: Record<string, string> = {
        recebida: 'Recebida',
        em_analise: 'Em Análise na Secretaria',
        encaminhada: 'Encaminhada ao Setor Operacional',
        em_atendimento: 'Em Atendimento Técnico',
        resolvida: 'Ocorrência Resolvida'
      };

      report.timeline.push({
        id: `t-${Date.now()}`,
        status,
        date: nowISO,
        title: statusTitles[status] || 'Atualização de Status',
        description: comment || `Status alterado para ${status.replace('_', ' ')}.`,
        author: author || 'Secretaria Responsável',
        photos: solutionPhotos
      });
    }

    if (comment) {
      report.comments.push({
        id: `c-${Date.now()}`,
        author: author || 'Servidor Público',
        role: role || 'Gestão +VOZ Madalena',
        text: comment,
        date: nowISO,
        isInternal: !!isInternal
      });
    }

    if (solutionPhotos && solutionPhotos.length > 0) {
      report.solutionPhotos = [...(report.solutionPhotos || []), ...solutionPhotos];
    }

    if (assignedOfficer) {
      report.assignedOfficer = assignedOfficer;
    }

    if (status === 'resolvida') {
      report.solutionDate = nowISO;
    }

    report.status = updatedStatus;
    report.updatedAt = nowISO;
    reportsDatabase[reportIndex] = report;
  }

  // Sync to Supabase if connected
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const updateData: Record<string, any> = { updated_at: nowISO };
      if (status) updateData.status = status;
      if (solutionPhotos) updateData.solution_photos = solutionPhotos;
      if (assignedOfficer) updateData.assigned_officer = assignedOfficer;
      if (status === 'resolvida') updateData.solution_date = nowISO;
      if (report) {
        updateData.timeline = report.timeline;
        updateData.comments = report.comments;
      }

      await supabase.from('reports').update(updateData).eq('id', id);
    } catch (sbErr) {
      console.warn("Erro ao atualizar denúncia no Supabase:", sbErr);
    }
  }

  if (!report) {
    return res.status(404).json({ error: "Denúncia não encontrada." });
  }

  res.json({ success: true, report });
});

// POST Rate solved report
app.post("/api/reports/:id/rate", async (req, res) => {
  const { id } = req.params;
  const { rating, feedback } = req.body;

  const report = reportsDatabase.find(r => r.id === id);
  if (report) {
    report.rating = rating;
    report.ratingFeedback = feedback;
    report.updatedAt = new Date().toISOString();
  }

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      await supabase.from('reports').update({
        rating,
        rating_feedback: feedback,
        updated_at: new Date().toISOString()
      }).eq('id', id);
    } catch (sbErr) {
      console.warn("Erro ao gravar avaliação no Supabase:", sbErr);
    }
  }

  if (!report) {
    return res.status(404).json({ error: "Denúncia não encontrada." });
  }

  res.json({ success: true, report });
});

// =====================================
// SECRETARIATS API ROUTES
// =====================================

// GET all secretariats
app.get("/api/secretariats", async (_req, res) => {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('secretariats').select('*').order('name', { ascending: true });
      if (!error && data && data.length > 0) {
        const formatted = data.map(row => ({
          id: row.id,
          name: row.name,
          description: row.description || '',
          iconName: row.icon_name || 'Building2',
          color: row.color || '#0F8A43',
          responsibleName: row.responsible_name || '',
          email: row.email || '',
          phone: row.phone || '',
          active: row.active !== undefined ? Boolean(row.active) : true,
          address: row.address || '',
          slaDays: typeof row.sla_days === 'number' ? row.sla_days : 5,
        }));
        return res.json({ secretariats: formatted });
      }
    } catch (err) {
      console.warn("Erro ao buscar secretarias do Supabase:", err);
    }
  }

  res.json({ secretariats: secretariatsDatabase });
});

// PATCH / PUT update a secretariat
app.patch("/api/secretariats/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const dbRow: Record<string, any> = {};
      if (updates.name !== undefined) dbRow.name = updates.name;
      if (updates.description !== undefined) dbRow.description = updates.description;
      if (updates.iconName !== undefined) dbRow.icon_name = updates.iconName;
      if (updates.color !== undefined) dbRow.color = updates.color;
      if (updates.responsibleName !== undefined) dbRow.responsible_name = updates.responsibleName;
      if (updates.email !== undefined) dbRow.email = updates.email;
      if (updates.phone !== undefined) dbRow.phone = updates.phone;
      if (updates.active !== undefined) dbRow.active = updates.active;
      if (updates.address !== undefined) dbRow.address = updates.address;
      if (updates.slaDays !== undefined) dbRow.sla_days = updates.slaDays;

      const { error } = await supabase.from('secretariats').update(dbRow).eq('id', id);
      if (error) {
        console.warn("Aviso update Supabase secretarias:", error.message);
      }
    } catch (err) {
      console.warn("Erro ao atualizar secretaria no Supabase:", err);
    }
  }

  // Update memory database
  const index = secretariatsDatabase.findIndex(s => s.id === id);
  if (index !== -1) {
    secretariatsDatabase[index] = {
      ...secretariatsDatabase[index],
      ...updates
    };
    return res.json({ success: true, secretariat: secretariatsDatabase[index] });
  } else {
    const newSec = {
      id: id as any,
      name: updates.name || 'Secretaria',
      description: updates.description || '',
      iconName: updates.iconName || 'Building2',
      color: updates.color || '#0F8A43',
      responsibleName: updates.responsibleName || '',
      email: updates.email || '',
      phone: updates.phone || '',
      active: updates.active !== undefined ? updates.active : true,
      address: updates.address || '',
      slaDays: updates.slaDays || 5
    };
    secretariatsDatabase.push(newSec);
    return res.json({ success: true, secretariat: newSec });
  }
});

// POST create a secretariat
app.post("/api/secretariats", async (req, res) => {
  const newSec = req.body;
  if (!newSec.id || !newSec.name) {
    return res.status(400).json({ error: "ID e Nome são obrigatórios para a secretaria." });
  }

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const dbRow = {
        id: newSec.id,
        name: newSec.name,
        description: newSec.description || '',
        icon_name: newSec.iconName || 'Building2',
        color: newSec.color || '#0F8A43',
        responsible_name: newSec.responsibleName || '',
        email: newSec.email || '',
        phone: newSec.phone || '',
        active: newSec.active !== undefined ? newSec.active : true,
        address: newSec.address || '',
        sla_days: newSec.slaDays || 5
      };
      await supabase.from('secretariats').insert([dbRow]);
    } catch (err) {
      console.warn("Erro ao inserir secretaria no Supabase:", err);
    }
  }

  secretariatsDatabase.push(newSec);
  res.status(201).json({ success: true, secretariat: newSec });
});

// DELETE a secretariat
app.delete("/api/secretariats/:id", async (req, res) => {
  const { id } = req.params;

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('secretariats').delete().eq('id', id);
      if (error) {
        console.warn("Erro ao deletar secretaria no Supabase:", error.message);
      }
    } catch (err) {
      console.warn("Erro ao excluir secretaria no Supabase:", err);
    }
  }

  secretariatsDatabase = secretariatsDatabase.filter(s => s.id !== id);
  res.json({ success: true, message: "Secretaria excluída com sucesso." });
});

// =====================================
// LOCALITIES API ROUTES
// =====================================

// GET all localities (from Supabase, or fallback to memory / IPECE)
app.get("/api/localities", async (_req, res) => {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('localities')
        .select('*')
        .order('district', { ascending: true })
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        const formatted = data.map(row => ({
          id: row.id,
          name: row.name,
          district: row.district,
          zone: row.zone,
          details: row.details || '',
          subgroup: row.subgroup || '',
          lat: row.lat,
          lng: row.lng
        }));
        return res.json({ localities: formatted, source: 'supabase' });
      }
    } catch (err) {
      console.warn("Erro ao buscar localidades do Supabase:", err);
    }
  }

  res.json({ localities: ALL_MADALENA_LOCALITIES, source: 'fallback' });
});

// POST seed / sync default localities to Supabase
app.post("/api/localities/seed", async (_req, res) => {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return res.status(503).json({ error: "Supabase não conectado." });
  }

  try {
    const rowsToInsert = ALL_MADALENA_LOCALITIES.map(loc => ({
      name: loc.name,
      district: loc.district,
      zone: loc.zone,
      details: loc.details || null,
      subgroup: loc.subgroup || null,
      lat: loc.lat || null,
      lng: loc.lng || null
    }));

    const { data, error } = await supabase
      .from('localities')
      .upsert(rowsToInsert, { onConflict: 'name' })
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, count: data?.length || rowsToInsert.length });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || String(err) });
  }
});

// AI Classify endpoint using Gemini
app.post("/api/classify", async (req, res) => {
  const { description, locationAddress } = req.body;
  if (!description || typeof description !== "string") {
    return res.status(400).json({ error: "Texto da denúncia é obrigatório para classificação por IA." });
  }

  const gemini = getGeminiClient();

  if (!gemini) {
    // Smart heuristic fallback
    return res.json({
      classification: fallbackClassify(description)
    });
  }

  try {
    const prompt = `Você é o assistente virtual de inteligência artificial da Prefeitura Municipal de Madalena - Ceará (+VOZ Madalena).
Analise a seguinte descrição de denúncia/reclamação de um cidadão e classifique-a no órgão/secretaria municipal responsável.

Descrição do Cidadão:
"${description}"
Localização fornecida: "${locationAddress || 'Madalena - CE'}"

Secretarias disponíveis:
- educacao: Escolas municipais, creches, transporte escolar, merenda, vagas escolares (Secretária: Juliana Maria Fernandes Pinheiro)
- assistencia_social: CRAS, CREAS, Cadastro Único, Bolsa Família, vulnerabilidade social, apoio comunitário (Secretário: Valdemiro Júnior)
- governo: Articulação institucional e política com a Câmara Municipal e distritos (Secretário: Benocélio da Silva Carneiro)
- infraestrutura: Secretaria de Obras, pavimentação asfáltica, calçamento, estradas vicinais, galerias, drenagem pluvial, prédios públicos (Secretário: Cristiano Barros Uchôa)
- agricultura: Apoio ao homem do campo, corte de terra, agricultura familiar, produção agrícola (Secretário: Antônio Ribeiro Barros)
- cultura: Secretaria de Cultura, Esporte, Turismo e Juventude, eventos, campeonatos, apoio à juventude (Secretário: Adauto Maciel Barros)
- saude: Postos de saúde (UBS), Hospital e Maternidade Mãe Tetê, remédios, vacinas, atendimento médico, SAMU 192, vigilância sanitária (Secretária: Crislene Barros Uchôa)
- saae: SAAE - Serviço Autônomo de Água e Esgoto, água tratada, saneamento básico, vazamentos, ligação de água, desobstrução de esgoto (Responsável: Fcº Evaldo Alves Dias)
- administracao: Concursos, folha de pagamento, tributos municipais (IPTU/ISS), compras e licitações
- planejamento: Projetos estruturantes, convênios estaduais e federais (SEPLAG)
- ouvidoria: Denúncias de conduta, elogios, reclamações sobre atendimento e pedidos de informação (e-SIC)
- controladoria: Auditoria interna, transparência e controle fiscal
- procuradoria: Questões jurídicas e legais do município
- gabinete: Assuntos diretos do Gabinete do Prefeito
- iluminacao_publica: Lâmpadas queimadas, postes apagados, troca de luminárias LED
- limpeza_urbana: Entulhos, lixo doméstico, mato alto, capinação e varrição
- meio_ambiente: Poda de árvores em risco, queimadas não autorizadas, preservação ambiental e mananciais

Categorias possíveis:
'buraco', 'entulho', 'arvore', 'iluminacao', 'falta_agua', 'queimada', 'animal', 'predio_publico', 'transporte_escolar', 'medicamentos', 'violencia', 'atendimento', 'outro'

Responda ESTRITAMENTE em formato JSON com as chaves:
{
  "secretariatId": "<id_da_secretaria>",
  "category": "<id_da_categoria>",
  "urgency": "baixa" | "media" | "alta" | "urgente",
  "summary": "<resumo da demanda em 1 frase clara>",
  "recommendedAction": "<recomendação direta de ação para o servidor>"
}`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text || "";
    const parsed = JSON.parse(responseText);

    res.json({ classification: parsed });
  } catch (err: any) {
    console.error("Erro na chamada Gemini AI:", err?.message || err);
    res.json({
      classification: fallbackClassify(description)
    });
  }
});

function fallbackClassify(text: string) {
  const lower = text.toLowerCase();

  let secretariatId: SecretariatId = 'ouvidoria';
  let category: CategoryId = 'outro';
  let urgency: 'baixa' | 'media' | 'alta' | 'urgente' = 'media';

  if (lower.includes('lâmpada') || lower.includes('lampada') || lower.includes('poste') || lower.includes('escuro') || lower.includes('luz')) {
    secretariatId = 'iluminacao_publica';
    category = 'iluminacao';
  } else if (lower.includes('água') || lower.includes('agua') || lower.includes('esgoto') || lower.includes('vazamento') || lower.includes('saae') || lower.includes('cano quebrado') || lower.includes('falta de água')) {
    secretariatId = 'saae';
    category = 'falta_agua';
  } else if (lower.includes('buraco') || lower.includes('calçamento') || lower.includes('asfalto') || lower.includes('rua estragada')) {
    secretariatId = 'infraestrutura';
    category = 'buraco';
  } else if (lower.includes('lixo') || lower.includes('entulho') || lower.includes('capinação') || lower.includes('sujeira') || lower.includes('varrição')) {
    secretariatId = 'limpeza_urbana';
    category = 'entulho';
  } else if (lower.includes('remédio') || lower.includes('remedio') || lower.includes('médico') || lower.includes('posto de saúde') || lower.includes('hospital') || lower.includes('vacina')) {
    secretariatId = 'saude';
    category = 'medicamentos';
  } else if (lower.includes('árvore') || lower.includes('arvore') || lower.includes('poda') || lower.includes('queimada')) {
    secretariatId = 'meio_ambiente';
    category = lower.includes('queimada') ? 'queimada' : 'arvore';
  } else if (lower.includes('ônibus') || lower.includes('onibus') || lower.includes('escola') || lower.includes('creche') || lower.includes('aluno') || lower.includes('merenda')) {
    secretariatId = 'educacao';
    category = 'transporte_escolar';
  } else if (lower.includes('bolsa família') || lower.includes('bolsa familia') || lower.includes('cras') || lower.includes('creas') || lower.includes('social') || lower.includes('vulnerabilidade')) {
    secretariatId = 'assistencia_social';
    category = 'atendimento';
  } else if (lower.includes('estrada') || lower.includes('patrol') || lower.includes('campo') || lower.includes('açude') || lower.includes('corte de terra') || lower.includes('agricultura')) {
    secretariatId = 'agricultura';
    category = 'outro';
  }

  return {
    secretariatId,
    category,
    urgency,
    summary: `Solicitação identificada referente a ${category.replace('_', ' ')}.`,
    recommendedAction: 'Encaminhar para triagem e vistoria no endereço indicado.'
  };
}

// =====================================
// VITE MIDDLEWARE & STATIC SERVING
// =====================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`+VOZ Madalena Server running on http://localhost:${PORT}`);
  });
}

startServer();
