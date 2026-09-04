import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  RotateCcw, 
  FileSpreadsheet, 
  Check, 
  X, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Building, 
  Home, 
  Compass, 
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { MadalenaLocality, Report } from '../types';
import { MADALENA_DISTRICT_NAMES, DISTRICT_COORDINATES } from '../data/localitiesData';

interface AdminLocalitiesTabProps {
  localities: MadalenaLocality[];
  reports: Report[];
  onCreateLocality: (newLoc: MadalenaLocality) => Promise<void> | void;
  onUpdateLocality: (oldName: string, updatedLoc: MadalenaLocality) => Promise<void> | void;
  onDeleteLocality: (name: string) => Promise<void> | void;
  onResetLocalities: () => Promise<void> | void;
}

const ZONE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Urbano: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  Rural: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  Distrito: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  Assentamento: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  Povoado: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
  Disperso: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' }
};

const DISTRICT_BADGE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Madalena (Sede)': { bg: 'bg-emerald-100', text: 'text-emerald-900', dot: 'bg-emerald-500' },
  'Macaoca': { bg: 'bg-purple-100', text: 'text-purple-900', dot: 'bg-purple-500' },
  'Cajazeiras': { bg: 'bg-amber-100', text: 'text-amber-900', dot: 'bg-amber-500' },
  'Cacimba Nova': { bg: 'bg-blue-100', text: 'text-blue-900', dot: 'bg-blue-500' },
  'Paus Branco': { bg: 'bg-cyan-100', text: 'text-cyan-900', dot: 'bg-cyan-500' },
  'União': { bg: 'bg-rose-100', text: 'text-rose-900', dot: 'bg-rose-500' },
  'Outros Pontos / Dispersos': { bg: 'bg-slate-200', text: 'text-slate-800', dot: 'bg-slate-500' }
};

export const AdminLocalitiesTab: React.FC<AdminLocalitiesTabProps> = ({
  localities,
  reports,
  onCreateLocality,
  onUpdateLocality,
  onDeleteLocality,
  onResetLocalities
}) => {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('todos');
  const [selectedZone, setSelectedZone] = useState<string>('todas');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLocality, setEditingLocality] = useState<MadalenaLocality | null>(null);
  const [deletingLocality, setDeletingLocality] = useState<MadalenaLocality | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Form State (for both Create & Edit)
  const [formName, setFormName] = useState('');
  const [formDistrict, setFormDistrict] = useState('Madalena (Sede)');
  const [formCustomDistrict, setFormCustomDistrict] = useState('');
  const [formZone, setFormZone] = useState<MadalenaLocality['zone']>('Rural');
  const [formDetails, setFormDetails] = useState('');
  const [formSubgroup, setFormSubgroup] = useState('');
  const [formLat, setFormLat] = useState<string>('');
  const [formLng, setFormLng] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Feedback Notification banner
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // -------------------------------------------------------------------------
  // KPI CALCULATIONS
  // -------------------------------------------------------------------------
  const totalCount = localities.length;
  const urbanCount = localities.filter(l => l.zone === 'Urbano').length;
  const ruralCount = localities.filter(l => l.zone === 'Rural' || l.zone === 'Povoado').length;
  const districtHeadCount = localities.filter(l => l.zone === 'Distrito').length;
  const settlementCount = localities.filter(l => l.zone === 'Assentamento').length;

  // Counts of reports mapped to localities
  const reportsPerLocality = useMemo(() => {
    const map = new Map<string, number>();
    for (const rep of reports) {
      const neigh = rep.location.neighborhood.trim().toLowerCase();
      map.set(neigh, (map.get(neigh) || 0) + 1);
    }
    return map;
  }, [reports]);

  // -------------------------------------------------------------------------
  // FILTERED LOCALITIES
  // -------------------------------------------------------------------------
  const filteredLocalities = useMemo(() => {
    return localities.filter(loc => {
      // District filter
      if (selectedDistrict !== 'todos') {
        if (selectedDistrict === 'Outros Pontos / Dispersos') {
          if (loc.district !== 'Outros Pontos / Dispersos' && loc.district !== 'Dispersos / Sítios') {
            return false;
          }
        } else if (loc.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
          return false;
        }
      }

      // Zone filter
      if (selectedZone !== 'todas' && loc.zone.toLowerCase() !== selectedZone.toLowerCase()) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.trim().toLowerCase();
        const matchName = loc.name.toLowerCase().includes(q);
        const matchDistrict = loc.district.toLowerCase().includes(q);
        const matchZone = loc.zone.toLowerCase().includes(q);
        const matchDetails = loc.details ? loc.details.toLowerCase().includes(q) : false;
        if (!matchName && !matchDistrict && !matchZone && !matchDetails) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort by district then by name
      const distComp = a.district.localeCompare(b.district, 'pt-BR');
      if (distComp !== 0) return distComp;
      return a.name.localeCompare(b.name, 'pt-BR');
    });
  }, [localities, selectedDistrict, selectedZone, searchTerm]);

  // -------------------------------------------------------------------------
  // OPEN CREATE MODAL
  // -------------------------------------------------------------------------
  const openCreateModal = () => {
    setFormName('');
    setFormDistrict('Madalena (Sede)');
    setFormCustomDistrict('');
    setFormZone('Rural');
    setFormDetails('');
    setFormSubgroup('Comunidades e Fazendas');
    const coords = DISTRICT_COORDINATES['Madalena (Sede)'] || { lat: -4.8042, lng: -39.5768 };
    setFormLat(coords.lat.toString());
    setFormLng(coords.lng.toString());
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  // -------------------------------------------------------------------------
  // OPEN EDIT MODAL
  // -------------------------------------------------------------------------
  const openEditModal = (loc: MadalenaLocality) => {
    setEditingLocality(loc);
    setFormName(loc.name);
    
    const isStandardDistrict = MADALENA_DISTRICT_NAMES.includes(loc.district);
    if (isStandardDistrict) {
      setFormDistrict(loc.district);
      setFormCustomDistrict('');
    } else {
      setFormDistrict('CUSTOM');
      setFormCustomDistrict(loc.district);
    }

    setFormZone(loc.zone);
    setFormDetails(loc.details || '');
    setFormSubgroup(loc.subgroup || '');
    
    if (loc.lat && loc.lng) {
      setFormLat(loc.lat.toString());
      setFormLng(loc.lng.toString());
    } else {
      const fallback = DISTRICT_COORDINATES[loc.district] || { lat: -4.8042, lng: -39.5768 };
      setFormLat(fallback.lat.toString());
      setFormLng(fallback.lng.toString());
    }

    setFormError(null);
  };

  // -------------------------------------------------------------------------
  // FILL DISTRICT COORDINATES
  // -------------------------------------------------------------------------
  const handleFillDistrictCoords = () => {
    const dist = formDistrict === 'CUSTOM' ? formCustomDistrict : formDistrict;
    const coords = DISTRICT_COORDINATES[dist] || DISTRICT_COORDINATES['Madalena (Sede)'];
    if (coords) {
      setFormLat(coords.lat.toString());
      setFormLng(coords.lng.toString());
    }
  };

  // -------------------------------------------------------------------------
  // SAVE CREATE
  // -------------------------------------------------------------------------
  const handleSaveCreate = async () => {
    if (!formName.trim()) {
      setFormError('Por favor, informe o nome da localidade.');
      return;
    }

    const finalDistrict = formDistrict === 'CUSTOM' ? formCustomDistrict.trim() : formDistrict;
    if (!finalDistrict) {
      setFormError('Por favor, defina o distrito da localidade.');
      return;
    }

    // Check duplicate
    const exists = localities.some(
      l => l.name.trim().toLowerCase() === formName.trim().toLowerCase()
    );
    if (exists) {
      setFormError(`Já existe uma localidade cadastrada com o nome "${formName.trim()}".`);
      return;
    }

    const newLoc: MadalenaLocality = {
      name: formName.trim(),
      district: finalDistrict,
      zone: formZone,
      details: formDetails.trim() || undefined,
      subgroup: formSubgroup.trim() || undefined,
      lat: formLat ? parseFloat(formLat) : undefined,
      lng: formLng ? parseFloat(formLng) : undefined
    };

    try {
      await onCreateLocality(newLoc);
      setIsCreateModalOpen(false);
      showToast(`Localidade "${newLoc.name}" cadastrada com sucesso no distrito ${newLoc.district}!`);
    } catch (err: any) {
      setFormError(err.message || 'Erro ao cadastrar localidade.');
    }
  };

  // -------------------------------------------------------------------------
  // SAVE UPDATE
  // -------------------------------------------------------------------------
  const handleSaveUpdate = async () => {
    if (!editingLocality) return;

    if (!formName.trim()) {
      setFormError('O nome da localidade não pode ficar vazio.');
      return;
    }

    const finalDistrict = formDistrict === 'CUSTOM' ? formCustomDistrict.trim() : formDistrict;
    if (!finalDistrict) {
      setFormError('Por favor, defina o distrito da localidade.');
      return;
    }

    const updatedLoc: MadalenaLocality = {
      name: formName.trim(),
      district: finalDistrict,
      zone: formZone,
      details: formDetails.trim() || undefined,
      subgroup: formSubgroup.trim() || undefined,
      lat: formLat ? parseFloat(formLat) : undefined,
      lng: formLng ? parseFloat(formLng) : undefined
    };

    try {
      await onUpdateLocality(editingLocality.name, updatedLoc);
      setEditingLocality(null);
      showToast(`Localidade "${updatedLoc.name}" atualizada com sucesso!`);
    } catch (err: any) {
      setFormError(err.message || 'Erro ao atualizar localidade.');
    }
  };

  // -------------------------------------------------------------------------
  // CONFIRM DELETE
  // -------------------------------------------------------------------------
  const handleConfirmDelete = async () => {
    if (!deletingLocality) return;
    try {
      await onDeleteLocality(deletingLocality.name);
      showToast(`Localidade "${deletingLocality.name}" excluída com sucesso!`, 'success');
      setDeletingLocality(null);
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir localidade.', 'error');
    }
  };

  // -------------------------------------------------------------------------
  // CONFIRM RESET TO DEFAULT
  // -------------------------------------------------------------------------
  const handleConfirmReset = async () => {
    try {
      await onResetLocalities();
      setIsResetConfirmOpen(false);
      showToast('Lista oficial de localidades restaurada com sucesso para o padrão IPECE 2023!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erro ao restaurar localidades.', 'error');
    }
  };

  // -------------------------------------------------------------------------
  // EXPORT CSV
  // -------------------------------------------------------------------------
  const handleExportCSV = () => {
    const headers = ['Nome', 'Distrito', 'Zona', 'Detalhes', 'Subgrupo', 'Denuncias Registradas'];
    const rows = filteredLocalities.map(loc => {
      const repCount = reportsPerLocality.get(loc.name.toLowerCase()) || 0;
      return [
        `"${loc.name.replace(/"/g, '""')}"`,
        `"${loc.district.replace(/"/g, '""')}"`,
        `"${loc.zone.replace(/"/g, '""')}"`,
        `"${(loc.details || '').replace(/"/g, '""')}"`,
        `"${(loc.subgroup || '').replace(/"/g, '""')}"`,
        repCount
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `localidades_madalena_ce_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-slideIn ${
          toastMessage.type === 'success' ? 'bg-[#0F8A43] text-white' : 'bg-red-600 text-white'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-xs font-bold">{toastMessage.text}</span>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Mapeado</span>
            <MapPin className="w-4 h-4 text-[#0F8A43]" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{totalCount}</h3>
          <p className="text-[10px] text-emerald-700 font-medium">98%+ do território</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Bairros Urbanos</span>
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-2xl font-black text-blue-900 mt-1">{urbanCount}</h3>
          <p className="text-[10px] text-slate-500">Sede de Madalena</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Vilas Distritais</span>
            <Home className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-2xl font-black text-purple-900 mt-1">{districtHeadCount}</h3>
          <p className="text-[10px] text-slate-500">Sedes dos 6 distritos</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Comunidades</span>
            <Compass className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-emerald-900 mt-1">{ruralCount}</h3>
          <p className="text-[10px] text-slate-500">Sítios e fazendas</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Assentamentos</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-2xl font-black text-amber-900 mt-1">{settlementCount}</h3>
          <p className="text-[10px] text-slate-500">PAs e agrovilas</p>
        </div>
      </div>

      {/* Main Management Box */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200 space-y-5">
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0F8A43] shrink-0" />
              <span>Gestão Oficial de Localidades (CRUD)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Adicione novos povoados, edite nomes e detalhes de comunidades ou corrija coordenadas de qualquer localidade de Madalena.
            </p>
          </div>

          <div className="flex flex-row flex-nowrap items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 shrink-0">
            <button
              type="button"
              onClick={openCreateModal}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#0F8A43] hover:bg-[#0c7036] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Nova Localidade</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200 whitespace-nowrap shrink-0"
              title="Exportar dados das localidades em formato CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Exportar</span>
            </button>

            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-amber-200 whitespace-nowrap shrink-0"
              title="Restaura a lista oficial padrão IPECE 2023"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Restaurar Padrão</span>
            </button>
          </div>
        </div>

        {/* Filters Controls */}
        <div className="space-y-3">
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar localidade (ex: Treme, Brejo, Santana, Grossos, Macaoca, Quieto...)"
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#0F8A43] focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ×
                </button>
              )}
            </div>

            {/* Zone Selector */}
            <div className="w-full sm:w-48">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#0F8A43]"
              >
                <option value="todas">Todas as Zonas / Tipos</option>
                <option value="Urbano">Apenas Bairros Urbanos</option>
                <option value="Rural">Apenas Comunidades Rurais</option>
                <option value="Distrito">Apenas Sedes Distritais</option>
                <option value="Assentamento">Apenas Assentamentos</option>
                <option value="Povoado">Apenas Povoados</option>
                <option value="Disperso">Apenas Pontos Dispersos</option>
              </select>
            </div>
          </div>

          {/* District Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[11px] font-bold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Distrito:
            </span>
            <button
              type="button"
              onClick={() => setSelectedDistrict('todos')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedDistrict === 'todos'
                  ? 'bg-[#0F8A43] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Todos ({totalCount})
            </button>
            {MADALENA_DISTRICT_NAMES.map(dName => {
              const countInDist = localities.filter(l => {
                if (dName === 'Outros Pontos / Dispersos') {
                  return l.district === 'Outros Pontos / Dispersos' || l.district === 'Dispersos / Sítios';
                }
                return l.district.toLowerCase() === dName.toLowerCase();
              }).length;

              return (
                <button
                  key={dName}
                  type="button"
                  onClick={() => setSelectedDistrict(dName)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedDistrict === dName
                      ? 'bg-[#0F8A43] text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{dName.replace('1. Distrito: ', '').replace('2. Distrito: ', '')}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedDistrict === dName ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {countInDist}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Results Info Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Exibindo <strong>{filteredLocalities.length}</strong> de {totalCount} localidades cadastradas
          </span>
          {(searchTerm || selectedDistrict !== 'todos' || selectedZone !== 'todas') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDistrict('todos');
                setSelectedZone('todas');
              }}
              className="text-[#0F8A43] font-bold hover:underline cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Table of Localities */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Localidade</th>
                <th className="py-3 px-4">Distrito Pertencente</th>
                <th className="py-3 px-4">Zona / Categoria</th>
                <th className="py-3 px-4">Observações / Detalhes</th>
                <th className="py-3 px-4 text-center">Denúncias</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLocalities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-600">Nenhuma localidade encontrada</p>
                    <p className="text-xs text-slate-400 mt-1">Tente ajustar a busca ou os filtros de distrito e categoria.</p>
                  </td>
                </tr>
              ) : (
                filteredLocalities.map((loc) => {
                  const repCount = reportsPerLocality.get(loc.name.toLowerCase()) || 0;
                  const zoneStyle = ZONE_COLORS[loc.zone] || ZONE_COLORS.Disperso;
                  const distBadge = DISTRICT_BADGE_COLORS[loc.district] || { bg: 'bg-slate-100', text: 'text-slate-800', dot: 'bg-slate-400' };

                  return (
                    <tr key={`${loc.district}-${loc.name}`} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#0F8A43] shrink-0" />
                          <span>{loc.name}</span>
                        </div>
                        {loc.subgroup && (
                          <span className="text-[10px] text-slate-400 block ml-5">
                            {loc.subgroup}
                          </span>
                        )}
                      </td>

                      {/* District */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${distBadge.bg} ${distBadge.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${distBadge.dot}`} />
                          {loc.district}
                        </span>
                      </td>

                      {/* Zone */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${zoneStyle.bg} ${zoneStyle.text} ${zoneStyle.border}`}>
                          {loc.zone}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="py-3 px-4 text-slate-600">
                        {loc.details ? (
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                            {loc.details}
                          </span>
                        ) : (
                          <span className="text-slate-300 italic text-[11px]">—</span>
                        )}
                      </td>

                      {/* Reports count */}
                      <td className="py-3 px-4 text-center">
                        {repCount > 0 ? (
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                            {repCount} {repCount === 1 ? 'chamado' : 'chamados'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">0</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(loc)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                            title={`Editar ${loc.name}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingLocality(loc)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                            title={`Excluir ${loc.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ------------------------------------------------------------------- */}
      {/* MODAL: CRIAR OU EDITAR LOCALIDADE */}
      {/* ------------------------------------------------------------------- */}
      {(isCreateModalOpen || editingLocality) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0F8A43] flex items-center justify-center font-bold">
                  {editingLocality ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingLocality ? `Editar Localidade: ${editingLocality.name}` : 'Cadastrar Nova Localidade'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Prefeitura Municipal de Madalena - CE
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingLocality(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              
              {/* Nome */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nome da Localidade <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Treme, Fazenda Brejo, Sítio Novo, Bairro Esperança..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-[#0F8A43] focus:outline-none"
                />
              </div>

              {/* Distrito */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Distrito Pertencente <span className="text-red-500">*</span>
                </label>
                <select
                  value={formDistrict}
                  onChange={(e) => setFormDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-[#0F8A43] focus:outline-none"
                >
                  <option value="Madalena (Sede)">1. Distrito: Madalena (Sede)</option>
                  <option value="Macaoca">2. Distrito: Macaoca</option>
                  <option value="Cajazeiras">3. Distrito: Cajazeiras</option>
                  <option value="Cacimba Nova">4. Distrito: Cacimba Nova</option>
                  <option value="Paus Branco">5. Distrito: Paus Branco</option>
                  <option value="União">6. Distrito: União</option>
                  <option value="Outros Pontos / Dispersos">Outros Pontos Mapeados (Dispersos / Sítios)</option>
                  <option value="CUSTOM">➕ Outro Distrito Personalizado</option>
                </select>

                {formDistrict === 'CUSTOM' && (
                  <input
                    type="text"
                    value={formCustomDistrict}
                    onChange={(e) => setFormCustomDistrict(e.target.value)}
                    placeholder="Digite o nome do novo distrito..."
                    className="mt-2 w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500"
                  />
                )}
              </div>

              {/* Zona / Categoria */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Zona / Categoria
                  </label>
                  <select
                    value={formZone}
                    onChange={(e) => setFormZone(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:ring-2 focus:ring-[#0F8A43]"
                  >
                    <option value="Rural">Rural (Comunidade / Sítio / Fazenda)</option>
                    <option value="Urbano">Urbano (Bairro da Sede)</option>
                    <option value="Distrito">Distrito (Vila Principal)</option>
                    <option value="Assentamento">Assentamento / PA / Agrovila</option>
                    <option value="Povoado">Povoado</option>
                    <option value="Disperso">Disperso / Ponto Isolado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Subgrupo de Agrupamento
                  </label>
                  <input
                    type="text"
                    value={formSubgroup}
                    onChange={(e) => setFormSubgroup(e.target.value)}
                    placeholder="Ex: Comunidades e Fazendas"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-[#0F8A43]"
                  />
                </div>
              </div>

              {/* Detalhes / Observação */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Detalhes / Observações (Opcional)
                </label>
                <input
                  type="text"
                  value={formDetails}
                  onChange={(e) => setFormDetails(e.target.value)}
                  placeholder="Ex: Posto de Saúde e Escola, Fazenda Brejo, Região do Açude Umari..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-[#0F8A43]"
                />
              </div>

              {/* Coordenadas GPS (Lat / Lng) */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#0F8A43]" />
                    Coordenadas de Referência do Mapa (GPS)
                  </span>
                  <button
                    type="button"
                    onClick={handleFillDistrictCoords}
                    className="text-[11px] font-bold text-[#0F8A43] hover:underline cursor-pointer"
                  >
                    Usar padrão do distrito
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Latitude</label>
                    <input
                      type="text"
                      value={formLat}
                      onChange={(e) => setFormLat(e.target.value)}
                      placeholder="-4.8042"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Longitude</label>
                    <input
                      type="text"
                      value={formLng}
                      onChange={(e) => setFormLng(e.target.value)}
                      placeholder="-39.5768"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingLocality(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={editingLocality ? handleSaveUpdate : handleSaveCreate}
                className="px-5 py-2.5 rounded-xl bg-[#0F8A43] hover:bg-[#0c7036] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingLocality ? 'Salvar Alterações' : 'Cadastrar Localidade'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL: CONFIRMAR EXCLUSÃO */}
      {/* ------------------------------------------------------------------- */}
      {deletingLocality && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-black text-slate-900">
                Excluir Localidade "{deletingLocality.name}"?
              </h3>
              <p className="text-xs text-slate-600">
                Esta ação removerá a localidade do formulário de preenchimento de novas denúncias e dos filtros do sistema.
              </p>

              {(reportsPerLocality.get(deletingLocality.name.toLowerCase()) || 0) > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left flex items-start gap-2 mt-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    <strong>Atenção:</strong> Existem <strong>{reportsPerLocality.get(deletingLocality.name.toLowerCase())}</strong> ocorrências já registradas com esta localidade. O histórico de denúncias passadas continuará preservado.
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingLocality(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir Localidade</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL: CONFIRMAR RESTAURAÇÃO DO PADRÃO IPECE */}
      {/* ------------------------------------------------------------------- */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-black text-slate-900">
                Restaurar Lista Padrão do IPECE 2023?
              </h3>
              <p className="text-xs text-slate-600">
                Esta ação recarregará a listagem oficial consolidada de mais de 70 localidades, incluindo todos os bairros urbanos e comunidades rurais (Brejo, Treme, Grossos, etc.).
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Confirmar Restauração</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
