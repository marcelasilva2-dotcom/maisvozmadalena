import React, { useState } from 'react';
import { FileText, Clock, CheckCircle2, AlertCircle, MapPin, Filter } from 'lucide-react';
import { Report } from '../types';
import { InteractiveMap } from './InteractiveMap';

interface StatsAndMapProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
}

export const StatsAndMap: React.FC<StatsAndMapProps> = ({ reports, onSelectReport }) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('todos');

  const totalReports = reports.length;
  const inProgressReports = reports.filter(r => r.status === 'em_analise' || r.status === 'encaminhada' || r.status === 'em_atendimento' || r.status === 'recebida').length;
  const resolvedReports = reports.filter(r => r.status === 'resolvida').length;
  
  // Calculate avg response time mock / calculated
  const avgResponseTime = '3.8 dias';

  const filteredReports = selectedNeighborhood === 'todos' 
    ? reports 
    : reports.filter(r => r.location.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase()));

  const uniqueNeighborhoods = Array.from(new Set(reports.map(r => r.location.neighborhood)));

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F8A43] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Painel Geral de Atendimentos
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Estatísticas & Mapa de Ocorrências
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Acompanhamento transparente das demandas recebidas nos bairros e distritos de Madalena - CE.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-[#F5F5F5] rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Denúncias</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalReports}</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">100% catalogadas</p>
            </div>
          </div>

          <div className="bg-[#F5F5F5] rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#FF8C00] flex items-center justify-center font-bold">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Em Andamento</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{inProgressReports}</h3>
              <p className="text-[11px] text-amber-600 font-medium mt-0.5">Em atendimento técnico</p>
            </div>
          </div>

          <div className="bg-[#F5F5F5] rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#0F8A43] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Resolvidas</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{resolvedReports}</h3>
              <p className="text-[11px] text-[#0F8A43] font-medium mt-0.5">Solução concluída</p>
            </div>
          </div>

          <div className="bg-[#F5F5F5] rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Tempo Médio</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{avgResponseTime}</h3>
              <p className="text-[11px] text-purple-600 font-medium mt-0.5">Agilidade municipal</p>
            </div>
          </div>

        </div>

        {/* Map Header Controls */}
        <div className="bg-[#F5F5F5] rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#0F8A43]" />
                Mapa Interativo de Ocorrências em Madalena
              </h3>
              <p className="text-xs text-slate-600">
                Clique nos marcadores do mapa para visualizar o status do atendimento do bairro.
              </p>
            </div>

            {/* Neighborhood Filter dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0F8A43]"
              >
                <option value="todos">Todos os Bairros & Distritos ({reports.length})</option>
                {uniqueNeighborhoods.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Map Component */}
          <InteractiveMap
            reports={filteredReports}
            height="380px"
            onSelectReport={onSelectReport}
          />

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#3182CE]" />
              <span>Recebida</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#DD6B20]" />
              <span>Em Análise / Encaminhada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF8C00]" />
              <span>Em Atendimento</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#0F8A43]" />
              <span>Resolvida</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
