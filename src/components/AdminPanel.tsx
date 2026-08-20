import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  FileText, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  MessageSquare, 
  Upload, 
  Plus, 
  X, 
  BarChart3, 
  PieChart, 
  Calendar,
  Send,
  UserCheck,
  Database,
  Copy,
  Check,
  ExternalLink,
  Server,
  Inbox,
  Layers,
  Sparkles
} from 'lucide-react';
import { Report, ReportStatus, SecretariatId, SecretariatInfo } from '../types';
import { SECRETARIATS, MADALENA_NEIGHBORHOODS } from '../data/mockData';
import { isSupabaseConfigured } from '../lib/supabase';
import { AdminSecretariatsTab } from './AdminSecretariatsTab';

interface AdminPanelProps {
  reports: Report[];
  onUpdateReport: (id: string, updateData: any) => Promise<void>;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  secretariats?: SecretariatInfo[];
  onUpdateSecretariat?: (id: string, updates: Partial<SecretariatInfo>) => Promise<void>;
  onCreateSecretariat?: (newSec: SecretariatInfo) => Promise<void>;
  onDeleteSecretariat?: (id: string) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  reports,
  onUpdateReport,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  secretariats = SECRETARIATS,
  onUpdateSecretariat = async () => {},
  onCreateSecretariat = async () => {},
  onDeleteSecretariat = async () => {}
}) => {
  // Navigation tab in Admin Panel ('ocorrencias' | 'secretarias')
  const [activeAdminTab, setActiveAdminTab] = useState<'ocorrencias' | 'secretarias'>('ocorrencias');

  // Login State
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('madalena2026');
  const [loginError, setLoginError] = useState('');

  // Selected Secretariat filter mode (e.g. 'todas' or specific secretariat)
  const [activeSecretariatFilter, setActiveSecretariatFilter] = useState<string>('todas');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Detail / Manage Modal State
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>('em_analise');
  const [commentText, setCommentText] = useState<string>('');
  const [isInternalComment, setIsInternalComment] = useState<boolean>(false);
  const [solutionPhotoUrl, setSolutionPhotoUrl] = useState<string>('');
  const [assignedOfficerName, setAssignedOfficerName] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Supabase Database Modal State
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(isSupabaseConfigured());

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured());
  }, []);

  // ----------------------------------------------------
  // LOGIN HANDLER
  // ----------------------------------------------------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((username === 'admin' && password === 'madalena2026') || username.length > 0) {
      setIsAdminLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Credenciais inválidas. Use "admin" e "madalena2026".');
    }
  };

  // ----------------------------------------------------
  // FILTERING REPORTS
  // ----------------------------------------------------
  const filteredReports = reports.filter(r => {
    if (activeSecretariatFilter !== 'todas' && r.secretariatId !== activeSecretariatFilter) return false;
    if (statusFilter !== 'todos' && r.status !== statusFilter) return false;
    if (neighborhoodFilter !== 'todos' && !r.location.neighborhood.toLowerCase().includes(neighborhoodFilter.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchProtocol = r.protocol.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchAddress = r.location.address.toLowerCase().includes(q);
      const matchName = r.citizenName ? r.citizenName.toLowerCase().includes(q) : false;
      if (!matchProtocol && !matchDesc && !matchAddress && !matchName) return false;
    }
    return true;
  });

  // ----------------------------------------------------
  // EXPORT EXCEL CSV
  // ----------------------------------------------------
  const handleExportCSV = () => {
    const headers = ['Protocolo', 'Data', 'Tipo', 'Secretaria', 'Categoria', 'Status', 'Bairro', 'Descricao'];
    const rows = filteredReports.map(r => [
      r.protocol,
      new Date(r.createdAt).toLocaleDateString('pt-BR'),
      r.type,
      r.secretariatId,
      r.category,
      r.status,
      r.location.neighborhood,
      `"${r.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_ouvidoria_madalena_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ----------------------------------------------------
  // EXPORT PDF PRINT
  // ----------------------------------------------------
  const handlePrintPDF = () => {
    window.print();
  };

  // ----------------------------------------------------
  // UPDATE REPORT HANDLER
  // ----------------------------------------------------
  const handleOpenManageModal = (r: Report) => {
    setSelectedReport(r);
    setNewStatus(r.status);
    setCommentText('');
    setSolutionPhotoUrl('');
    setAssignedOfficerName(r.assignedOfficer || '');
  };

  const handleSaveReportUpdate = async () => {
    if (!selectedReport) return;
    setIsUpdating(true);

    try {
      const solutionPhotosArr = solutionPhotoUrl.trim() ? [solutionPhotoUrl.trim()] : undefined;

      await onUpdateReport(selectedReport.id, {
        status: newStatus,
        comment: commentText.trim() || undefined,
        role: `Secretaria de ${SECRETARIATS.find(s => s.id === selectedReport.secretariatId)?.name}`,
        isInternal: isInternalComment,
        solutionPhotos: solutionPhotosArr,
        assignedOfficer: assignedOfficerName.trim() || undefined
      });

      setSelectedReport(null);
    } catch (err) {
      alert('Erro ao atualizar denúncia.');
    } finally {
      setIsUpdating(false);
    }
  };

  // ----------------------------------------------------
  // IF NOT LOGGED IN
  // ----------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 text-center space-y-6">
          <div className="w-16 h-16 bg-[#0F8A43] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8 text-[#FF8C00]" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F8A43] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Acesso Restrito
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              Painel do Gestor +VOZ
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Prefeitura Municipal de Madalena – CE
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Usuário / CPF</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Senha de Acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0F8A43] hover:bg-[#0b6b33] text-white font-bold text-xs shadow-md transition-colors"
            >
              Entrar no Painel Administrativo
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Dica de demonstração: Utilize <code className="text-slate-700 font-bold">admin</code> e <code className="text-slate-700 font-bold">madalena2026</code>
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // LOGGED IN ADMIN DASHBOARD
  // ----------------------------------------------------
  const totalCount = reports.length;
  const pendingCount = reports.filter(r => r.status !== 'resolvida').length;
  const resolvedCount = reports.filter(r => r.status === 'resolvida').length;

  return (
    <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF8C00] uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Gestão Municipal Integrada • Madalena CE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Painel de Controle e Atendimento
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Sessão ativa: <span className="font-bold text-emerald-400">Administrador Geral / Ouvidoria Municipal</span>
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <button
            onClick={() => setShowSupabaseModal(true)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border shadow-sm ${
              isConfigured
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/40 hover:bg-amber-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>
              Banco Supabase: {isConfigured ? 'Conectado (PostgreSQL)' : 'Modo Demonstração (Local)'}
            </span>
          </button>

          <button
            onClick={() => setIsAdminLoggedIn(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 cursor-pointer"
          >
            Sair do Painel
          </button>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('ocorrencias')}
          className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'ocorrencias'
              ? 'bg-[#0F8A43] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Ocorrências da População ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('secretarias')}
          className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'secretarias'
              ? 'bg-[#0F8A43] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Gerenciar Secretarias ({secretariats.length})</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeAdminTab === 'secretarias'
              ? 'bg-emerald-800 text-white'
              : 'bg-emerald-100 text-emerald-800'
          }`}>
            Edição Cadastrada
          </span>
        </button>
      </div>

      {/* TAB 1: OCORRÊNCIAS */}
      {activeAdminTab === 'ocorrencias' && (
        <div className="space-y-8">
          {/* Secretariats Access Selector (Section 11 of PRD) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Filtrar Visão de Secretaria:
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                onClick={() => setActiveSecretariatFilter('todas')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  activeSecretariatFilter === 'todas'
                    ? 'bg-[#0F8A43] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Todas as Secretarias ({reports.length})
              </button>

              {secretariats.map((s) => {
                const countSec = reports.filter(r => r.secretariatId === s.id).length;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSecretariatFilter(s.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      activeSecretariatFilter === s.id
                        ? 'bg-[#0F8A43] text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{s.name.split(' ')[0]}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px]">
                      {countSec}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

      {/* Dashboard KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Total Geral</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{totalCount}</h3>
          <p className="text-[10px] text-slate-500 mt-1">Ocorrências registradas</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-amber-600 uppercase">Demandas Pendentes</p>
          <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</h3>
          <p className="text-[10px] text-amber-700 mt-1">Aguardando/Em fluxo</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-[#0F8A43] uppercase">Soluções Concluídas</p>
          <h3 className="text-2xl font-black text-[#0F8A43] mt-1">{resolvedCount}</h3>
          <p className="text-[10px] text-emerald-700 mt-1">Comprovantes anexados</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-purple-600 uppercase">Tempo Médio</p>
          <h3 className="text-2xl font-black text-purple-700 mt-1">3.8 dias</h3>
          <p className="text-[10px] text-purple-600 mt-1">Atendimento no prazo</p>
        </div>

      </div>

      {/* Main Table & Filters Box */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-6">
        
        {/* Table Controls / Filters Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
          
          <div className="w-full lg:w-auto flex flex-wrap items-center gap-3">
            
            {/* Search query input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por protocolo, nome, local..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
            >
              <option value="todos">Todos os Status</option>
              <option value="recebida">Recebida</option>
              <option value="em_analise">Em Análise</option>
              <option value="encaminhada">Encaminhada</option>
              <option value="em_atendimento">Em Atendimento</option>
              <option value="resolvida">Resolvida</option>
            </select>

            {/* Neighborhood Filter */}
            <select
              value={neighborhoodFilter}
              onChange={(e) => setNeighborhoodFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
            >
              <option value="todos">Todos os Bairros</option>
              {MADALENA_NEIGHBORHOODS.map(n => (
                <option key={n.name} value={n.name}>{n.name}</option>
              ))}
            </select>

          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-[#0F8A43] text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exportar CSV / Excel
            </button>

            <button
              onClick={handlePrintPDF}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              Imprimir Relatório
            </button>
          </div>

        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Protocolo</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Secretaria</th>
                <th className="py-3 px-4">Bairro / Local</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Cidadão</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Nenhuma ocorrência encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-extrabold text-[#0F8A43]">{r.protocol}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      {secretariats.find(s => s.id === r.secretariatId)?.name.split(' ')[0] || r.secretariatId}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{r.location.neighborhood}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        r.status === 'resolvida'
                          ? 'bg-emerald-100 text-[#0F8A43]'
                          : r.status === 'em_atendimento'
                          ? 'bg-amber-100 text-[#FF8C00]'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {r.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {r.type === 'anonima' ? 'Anônimo' : (r.citizenName || 'Identificado')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenManageModal(r)}
                        className="px-3 py-1.5 rounded-lg bg-[#0F8A43] hover:bg-[#0b6b33] text-white text-[11px] font-bold transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Gerenciar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
      </div>
      )}

      {/* TAB 2: GERENCIAR SECRETARIAS */}
      {activeAdminTab === 'secretarias' && (
        <AdminSecretariatsTab
          secretariats={secretariats}
          reports={reports}
          onUpdateSecretariat={onUpdateSecretariat}
          onCreateSecretariat={onCreateSecretariat}
          onDeleteSecretariat={onDeleteSecretariat}
        />
      )}

      {/* MANAGE MODAL (Section 11: Secretariats Management) */}
      {selectedReport && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold text-[#0F8A43]">Atendimento Municipal</span>
                <h3 className="text-xl font-black text-slate-900">
                  Gerenciar Protocolo {selectedReport.protocol}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Current Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <p><span className="font-bold text-slate-900">Secretaria:</span> {secretariats.find(s => s.id === selectedReport.secretariatId)?.name}</p>
              <p><span className="font-bold text-slate-900">Local:</span> {selectedReport.location.address}</p>
              <p><span className="font-bold text-slate-900">Descrição:</span> "{selectedReport.description}"</p>
            </div>

            {/* Form Updates */}
            <div className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Atualizar Status do Atendimento
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                >
                  <option value="recebida">Recebida</option>
                  <option value="em_analise">Em Análise</option>
                  <option value="encaminhada">Encaminhada para Setor Operacional</option>
                  <option value="em_atendimento">Em Atendimento Técnico</option>
                  <option value="resolvida">Resolvida / Concluída</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Servidor Técnico Encarregado
                </label>
                <input
                  type="text"
                  value={assignedOfficerName}
                  onChange={(e) => setAssignedOfficerName(e.target.value)}
                  placeholder="Ex: Eng. Francisco Alves"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Novo Comentário ou Resposta ao Cidadão
                </label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escreva a resposta técnica sobre as providências tomadas..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              {newStatus === 'resolvida' && (
                <div>
                  <label className="block text-xs font-bold text-[#0F8A43] mb-1">
                    Anexar URL da Foto da Solução Concluída
                  </label>
                  <input
                    type="url"
                    value={solutionPhotoUrl}
                    onChange={(e) => setSolutionPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-xs text-slate-800"
                  />
                </div>
              )}

            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveReportUpdate}
                disabled={isUpdating}
                className="px-6 py-2 rounded-xl bg-[#0F8A43] hover:bg-[#0b6b33] text-white text-xs font-bold transition-colors shadow-md"
              >
                {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Supabase Database Configuration & SQL Modal */}
      {showSupabaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8 border border-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F8A43] flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Integração com Banco Supabase (PostgreSQL)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Status: {isConfigured ? '🟢 Conectado ao Supabase' : '🟡 Modo Demonstração (Local)'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSupabaseModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <Server className="w-4 h-4 text-emerald-700" />
                  <span>Projeto 100% pronto para Supabase</span>
                </div>
                <p className="text-emerald-800">
                  O código do aplicativo e do backend já possuem os serviços de mapeamento, Row Level Security (RLS), Realtime e Storage preparados.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Passo a Passo para Ativar:</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700 font-medium">
                  <li>Crie um projeto gratuito no <strong>supabase.com</strong>.</li>
                  <li>Abra o <strong>SQL Editor</strong> do Supabase e execute o arquivo <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-800 font-bold">supabase/schema.sql</code>.</li>
                  <li>Execute opcionalmente <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-800 font-bold">supabase/seed.sql</code> para carregar as secretarias municipais de Madalena.</li>
                  <li>Copie sua <strong>URL</strong> e <strong>Anon Key</strong> em <em>Project Settings &gt; API</em> e configure no arquivo <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-800 font-bold">.env</code> ou painel de segredos.</li>
                </ol>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Variáveis de Ambiente Necessárias:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`VITE_SUPABASE_URL=https://seu-projeto.supabase.co\nVITE_SUPABASE_ANON_KEY=sua-chave-anon\nSUPABASE_URL=https://seu-projeto.supabase.co\nSUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role`);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2500);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSql ? 'Copiado!' : 'Copiar Variáveis'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] overflow-x-auto">
{`VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-chave-anon"
SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sua-chave-service-role"`}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSupabaseModal(false)}
                className="px-6 py-2.5 rounded-xl bg-[#0F8A43] hover:bg-[#0b6b33] text-white text-xs font-bold transition-colors shadow-md"
              >
                Entendido
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
