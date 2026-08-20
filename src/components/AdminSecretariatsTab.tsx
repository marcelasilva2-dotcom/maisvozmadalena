import React, { useState } from 'react';
import { 
  Building2, 
  HeartPulse, 
  GraduationCap, 
  Trees, 
  Users, 
  Tractor, 
  Palette, 
  Trophy, 
  ShieldAlert, 
  Lightbulb, 
  Trash2, 
  Megaphone, 
  Hammer, 
  Flame, 
  Bus, 
  Droplets, 
  Dog, 
  Shield, 
  Briefcase, 
  FileText,
  Search,
  Plus,
  Edit3,
  Mail,
  Phone,
  User,
  Check,
  X,
  Sparkles,
  Layers,
  Save,
  CheckCircle2,
  AlertCircle,
  Inbox,
  Clock,
  MapPin,
  Eye,
  Power,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { SecretariatInfo, SecretariatId, Report } from '../types';

interface AdminSecretariatsTabProps {
  secretariats: SecretariatInfo[];
  reports: Report[];
  onUpdateSecretariat: (id: string, updates: Partial<SecretariatInfo>) => Promise<void>;
  onCreateSecretariat: (newSec: SecretariatInfo) => Promise<void>;
  onDeleteSecretariat?: (id: string) => Promise<void>;
}

// Available standard icons for selection
const AVAILABLE_ICONS = [
  { name: 'Building2', label: 'Administração / Geral', icon: Building2 },
  { name: 'HeartPulse', label: 'Saúde', icon: HeartPulse },
  { name: 'GraduationCap', label: 'Educação', icon: GraduationCap },
  { name: 'Trees', label: 'Meio Ambiente', icon: Trees },
  { name: 'Users', label: 'Ação Social', icon: Users },
  { name: 'Tractor', label: 'Agricultura & Pecuária', icon: Tractor },
  { name: 'Palette', label: 'Cultura & Turismo', icon: Palette },
  { name: 'Trophy', label: 'Esporte & Lazer', icon: Trophy },
  { name: 'ShieldAlert', label: 'Defesa Civil / Urgência', icon: ShieldAlert },
  { name: 'Lightbulb', label: 'Iluminação Pública', icon: Lightbulb },
  { name: 'Trash2', label: 'Limpeza & Coleta', icon: Trash2 },
  { name: 'Hammer', label: 'Obras & Infraestrutura', icon: Hammer },
  { name: 'Bus', label: 'Transporte & Trânsito', icon: Bus },
  { name: 'Droplets', label: 'Recursos Hídricos / Água', icon: Droplets },
  { name: 'Dog', label: 'Zoonoses & Proteção Animal', icon: Dog },
  { name: 'Shield', label: 'Segurança Municipal', icon: Shield },
  { name: 'Briefcase', label: 'Desenvolvimento Econômico', icon: Briefcase },
  { name: 'FileText', label: 'Finanças & Arrecadação', icon: FileText },
  { name: 'Megaphone', label: 'Ouvidoria & Comunicação', icon: Megaphone },
  { name: 'Flame', label: 'Corpo de Bombeiros / Resgate', icon: Flame },
];

// Available color presets
const COLOR_PRESETS = [
  { hex: '#0F8A43', name: 'Verde Madalena' },
  { hex: '#2563EB', name: 'Azul Real' },
  { hex: '#E11D48', name: 'Vermelho Saúde' },
  { hex: '#D97706', name: 'Âmbar Iluminação' },
  { hex: '#059669', name: 'Esmeralda Limpeza' },
  { hex: '#16A34A', name: 'Floresta Agro' },
  { hex: '#9333EA', name: 'Roxo Social' },
  { hex: '#CA8A04', name: 'Dourado Obras' },
  { hex: '#0284C7', name: 'Azul Céu Trânsito' },
  { hex: '#DC2626', name: 'Alerta Defesa Civil' },
  { hex: '#805AD5', name: 'Violeta Cultura' },
  { hex: '#475569', name: 'Ardósia Ouvidoria' },
];

export const AdminSecretariatsTab: React.FC<AdminSecretariatsTabProps> = ({
  secretariats,
  reports,
  onUpdateSecretariat,
  onCreateSecretariat,
  onDeleteSecretariat = async (_id: string) => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativas' | 'inativas'>('todos');
  
  // Modal State for Edit / Create
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewMode, setIsNewMode] = useState(false);
  const [selectedSec, setSelectedSec] = useState<SecretariatInfo | null>(null);

  // Delete Confirmation Modal State
  const [secToDelete, setSecToDelete] = useState<SecretariatInfo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formResponsible, setFormResponsible] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formColor, setFormColor] = useState('#0F8A43');
  const [formIcon, setFormIcon] = useState('Building2');
  const [formActive, setFormActive] = useState(true);
  const [formSlaDays, setFormSlaDays] = useState<number>(5);

  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Open Edit Modal
  const handleOpenEdit = (sec: SecretariatInfo) => {
    setIsNewMode(false);
    setSelectedSec(sec);
    setFormId(sec.id);
    setFormName(sec.name);
    setFormResponsible(sec.responsibleName || '');
    setFormEmail(sec.email || '');
    setFormPhone(sec.phone || '');
    setFormAddress(sec.address || '');
    setFormDescription(sec.description || '');
    setFormColor(sec.color || '#0F8A43');
    setFormIcon(sec.iconName || 'Building2');
    setFormActive(sec.active !== undefined ? sec.active : true);
    setFormSlaDays(sec.slaDays || 5);
    setFeedbackMessage(null);
    setIsModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsNewMode(true);
    setSelectedSec(null);
    setFormId('');
    setFormName('');
    setFormResponsible('');
    setFormEmail('');
    setFormPhone('(88) 3442-');
    setFormAddress('Prefeitura Municipal de Madalena, Av. Antônio Pinho Fraga');
    setFormDescription('');
    setFormColor('#0F8A43');
    setFormIcon('Building2');
    setFormActive(true);
    setFormSlaDays(5);
    setFeedbackMessage(null);
    setIsModalOpen(true);
  };

  // Helper to render icon by name
  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    const found = AVAILABLE_ICONS.find(i => i.name === iconName);
    if (found) {
      const IconComponent = found.icon;
      return <IconComponent className={className} />;
    }
    return <Building2 className={className} />;
  };

  // Handle Quick Toggle Active/Inactive
  const handleToggleActive = async (sec: SecretariatInfo) => {
    const currentActive = sec.active !== undefined ? sec.active : true;
    const newStatus = !currentActive;
    try {
      await onUpdateSecretariat(sec.id, { active: newStatus });
    } catch (err) {
      console.error('Erro ao alternar status da secretaria:', err);
    }
  };

  // Handle Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFeedbackMessage({ type: 'error', text: 'O nome da secretaria é obrigatório.' });
      return;
    }

    if (isNewMode && !formId.trim()) {
      setFeedbackMessage({ type: 'error', text: 'O identificador (slug) da secretaria é obrigatório.' });
      return;
    }

    setIsSaving(true);
    setFeedbackMessage(null);

    try {
      if (isNewMode) {
        // Sanitize ID
        const cleanId = formId.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_') as SecretariatId;
        
        // Check uniqueness
        if (secretariats.some(s => s.id === cleanId)) {
          setFeedbackMessage({ type: 'error', text: `Já existe uma secretaria com o identificador "${cleanId}".` });
          setIsSaving(false);
          return;
        }

        const newSec: SecretariatInfo = {
          id: cleanId,
          name: formName.trim(),
          responsibleName: formResponsible.trim(),
          email: formEmail.trim(),
          phone: formPhone.trim(),
          address: formAddress.trim(),
          description: formDescription.trim(),
          color: formColor,
          iconName: formIcon,
          active: formActive,
          slaDays: formSlaDays || 5,
        };
        await onCreateSecretariat(newSec);
        setFeedbackMessage({ type: 'success', text: 'Secretaria cadastrada com sucesso no banco de dados!' });
      } else if (selectedSec) {
        const updates: Partial<SecretariatInfo> = {
          name: formName.trim(),
          responsibleName: formResponsible.trim(),
          email: formEmail.trim(),
          phone: formPhone.trim(),
          address: formAddress.trim(),
          description: formDescription.trim(),
          color: formColor,
          iconName: formIcon,
          active: formActive,
          slaDays: formSlaDays || 5,
        };
        await onUpdateSecretariat(selectedSec.id, updates);
        setFeedbackMessage({ type: 'success', text: 'Dados da secretaria atualizados com sucesso!' });
      }

      setTimeout(() => {
        setIsModalOpen(false);
        setIsSaving(false);
      }, 700);
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: 'Erro ao salvar: ' + (err?.message || 'Tente novamente.') });
      setIsSaving(false);
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!secToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteSecretariat(secToDelete.id);
      setSecToDelete(null);
    } catch (err) {
      console.error('Erro ao excluir secretaria:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered Secretariats
  const filteredSecretariats = secretariats.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    const isActive = s.active !== undefined ? s.active : true;

    if (statusFilter === 'ativas' && !isActive) return false;
    if (statusFilter === 'inativas' && isActive) return false;

    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      (s.responsibleName && s.responsibleName.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.phone && s.phone.toLowerCase().includes(q)) ||
      (s.address && s.address.toLowerCase().includes(q)) ||
      s.id.toLowerCase().includes(q)
    );
  });

  const activeCount = secretariats.filter(s => s.active !== false).length;
  const inactiveCount = secretariats.filter(s => s.active === false).length;

  return (
    <div className="space-y-6" id="admin-secretariats-container">
      
      {/* Top Banner & Action Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F8A43] uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Gestão Completa de Órgãos (CRUD)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Secretarias Municipais de Madalena / CE
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Cadastre novos órgãos, edite atribuições, titulares responsáveis, contatos institucionais, metas de SLA e ative/desative secretarias em tempo real.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-2xl bg-[#0F8A43] hover:bg-[#0b6b33] text-white text-xs font-extrabold transition-all shadow-md hover:shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Secretaria</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-3.5 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#0F8A43] flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Total Cadastrado</p>
            <h4 className="text-lg sm:text-xl font-black text-slate-900">{secretariats.length} Órgãos</h4>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-3.5 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Secretarias Ativas</p>
            <h4 className="text-lg sm:text-xl font-black text-green-700">{activeCount} Ativas</h4>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-3.5 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Demandas Vinculadas</p>
            <h4 className="text-lg sm:text-xl font-black text-slate-900">{reports.length} Casos</h4>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-3.5 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">SLA Médio Municipal</p>
            <h4 className="text-lg sm:text-xl font-black text-purple-700">3 a 5 Dias Úteis</h4>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, titular, e-mail, slug..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F8A43]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({secretariats.length})
            </button>
            <button
              onClick={() => setStatusFilter('ativas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'ativas' ? 'bg-[#0F8A43] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ativas ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('inativas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'inativas' ? 'bg-slate-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inativas ({inactiveCount})
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 font-medium shrink-0">
          Exibindo <strong>{filteredSecretariats.length}</strong> de <strong>{secretariats.length}</strong> secretarias
        </p>
      </div>

      {/* Secretariats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSecretariats.map((sec) => {
          const secReportCount = reports.filter(r => r.secretariatId === sec.id).length;
          const resolvedCount = reports.filter(r => r.secretariatId === sec.id && r.status === 'resolvida').length;
          const isActive = sec.active !== false;

          return (
            <div
              key={sec.id}
              className={`bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                isActive 
                  ? 'border-slate-200/90 hover:border-slate-300 hover:shadow-xl' 
                  : 'border-slate-300/60 opacity-75 bg-slate-50/60'
              }`}
            >
              <div>
                {/* Header Strip with Color Accent */}
                <div 
                  className="h-3 w-full"
                  style={{ backgroundColor: isActive ? (sec.color || '#0F8A43') : '#94A3B8' }}
                />

                <div className="p-5 space-y-4">
                  {/* Top Row: Icon + ID + Status + Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 font-bold"
                        style={{ backgroundColor: isActive ? (sec.color || '#0F8A43') : '#94A3B8' }}
                      >
                        {renderIcon(sec.iconName, "w-6 h-6")}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] font-bold uppercase border border-slate-200">
                            {sec.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isActive ? 'Ativa' : 'Desativada'}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 leading-tight mt-1">
                          {sec.name}
                        </h4>
                      </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleActive(sec)}
                        title={isActive ? 'Desativar secretaria da Ouvidoria' : 'Ativar secretaria na Ouvidoria'}
                        className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          isActive 
                            ? 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800' 
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(sec)}
                        title="Editar dados da secretaria"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-[#0F8A43] hover:text-white text-slate-600 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSecToDelete(sec)}
                        title="Excluir secretaria"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-400 hover:text-white transition-colors cursor-pointer shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Responsible person & Contacts */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-900">
                        {sec.responsibleName || 'Titular não informado'}
                      </span>
                    </div>

                    {sec.email && (
                      <div className="flex items-center gap-2 text-slate-600 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{sec.email}</span>
                      </div>
                    )}

                    {sec.phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{sec.phone}</span>
                      </div>
                    )}

                    {sec.address && (
                      <div className="flex items-center gap-2 text-slate-500 text-[11px] truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{sec.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {sec.description || 'Sem descrição cadastrada.'}
                  </p>
                </div>
              </div>

              {/* Bottom stats & Edit action footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800">{secReportCount}</span>
                  <span>demandas</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">{resolvedCount} resolvidas</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    SLA: {sec.slaDays || 5}d
                  </span>
                  <button
                    onClick={() => handleOpenEdit(sec)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#0F8A43] hover:text-white text-slate-800 font-extrabold text-[11px] border border-slate-200 hover:border-transparent transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {secToDelete && (
        <div className="fixed inset-0 z-[70] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900">
                Excluir Secretaria?
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Você está prestes a excluir permanentemente a secretaria <strong>"{secToDelete.name}"</strong> (ID: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">{secToDelete.id}</code>).
              </p>
            </div>

            {/* Check for existing reports */}
            {reports.filter(r => r.secretariatId === secToDelete.id).length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  Atenção: Demandas Vinculadas
                </p>
                <p>
                  Existem <strong>{reports.filter(r => r.secretariatId === secToDelete.id).length} ocorrência(s)</strong> no histórico cadastradas nesta secretaria. Elas permanecerão salvas com o registro histórico.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSecToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE SECRETARIAT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8 border border-slate-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md font-bold shrink-0"
                  style={{ backgroundColor: formColor }}
                >
                  {renderIcon(formIcon, "w-6 h-6")}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {isNewMode ? 'Cadastrar Nova Secretaria Municipal' : `Editar: ${formName || 'Secretaria'}`}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {isNewMode ? 'Adicione um novo órgão municipal à ouvidoria' : `Identificador do sistema: ${formId}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Feedback Alert */}
            {feedbackMessage && (
              <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
                feedbackMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}>
                {feedbackMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{feedbackMessage.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              
              {isNewMode && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Identificador Único (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formId}
                    onChange={(e) => setFormId(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                    placeholder="ex: habitacao, saneamento, turismo, defesa_civil"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F8A43]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Usado internamente no banco de dados. Letras minúsculas e sem espaços.</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Nome Oficial do Órgão / Secretaria *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="ex: Secretaria Municipal de Infraestrutura e Obras"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F8A43]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Secretário(a) / Titular Responsável
                  </label>
                  <input
                    type="text"
                    value={formResponsible}
                    onChange={(e) => setFormResponsible(e.target.value)}
                    placeholder="ex: Eng. Francisco Alves"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F8A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Telefone / WhatsApp de Contato
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="ex: (88) 3442-1234 / (88) 99999-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F8A43]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    E-mail Institucional da Secretaria
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="ex: infraestrutura@madalena.ce.gov.br"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F8A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Prazo Médio de Resolução (SLA em Dias Úteis)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={formSlaDays}
                    onChange={(e) => setFormSlaDays(parseInt(e.target.value, 10) || 5)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F8A43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Endereço / Sede Administrativa
                </label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="ex: Av. Antônio Pinho Fraga, 123, Centro - Madalena/CE"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F8A43]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Descrição e Atribuições Principais
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descreva quais serviços e ocorrências este setor é responsável por atender no município de Madalena..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F8A43]"
                />
              </div>

              {/* Status Toggle in Modal */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Status da Secretaria</span>
                  <span className="text-[11px] text-slate-500">
                    {formActive ? 'Visível para os munícipes abrirem chamados e denúncias' : 'Oculta na página inicial para novos chamados'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormActive(!formActive)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    formActive ? 'bg-[#0F8A43] text-white shadow-2xs' : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {formActive ? 'Ativa' : 'Inativa'}
                </button>
              </div>

              {/* Color Palette Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Cor Temática do Órgão
                </label>
                <div className="flex items-center flex-wrap gap-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setFormColor(color.hex)}
                      title={color.name}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        formColor === color.hex ? 'ring-3 ring-offset-2 ring-slate-900 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {formColor === color.hex && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                  <input
                    type="color"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-8 h-8 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                    title="Cor Personalizada"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Ícone Representativo
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200 rounded-2xl">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = formIcon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormIcon(item.name)}
                        className={`p-2.5 rounded-xl flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#0F8A43] text-white shadow-sm font-bold' 
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="text-[9px] truncate w-full">{item.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#0F8A43] hover:bg-[#0b6b33] text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
