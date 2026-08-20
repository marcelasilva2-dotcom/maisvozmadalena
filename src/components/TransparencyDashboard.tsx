import React from 'react';
import { CheckCircle2, BarChart2, ShieldCheck, ThumbsUp, Building2, MapPin } from 'lucide-react';
import { Report } from '../types';
import { SECRETARIATS } from '../data/mockData';

interface TransparencyDashboardProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
}

export const TransparencyDashboard: React.FC<TransparencyDashboardProps> = ({
  reports,
  onSelectReport
}) => {
  const solvedReports = reports.filter(r => r.status === 'resolvida');
  const resolutionRate = reports.length > 0 ? Math.round((solvedReports.length / reports.length) * 100) : 100;

  return (
    <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F8A43] to-[#45B649] text-white rounded-3xl p-6 sm:p-10 shadow-xl text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3.5 py-1 rounded-full border border-white/30">
          Transparência & Prestação de Contas
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold">
          Painel Público de Transparência
        </h2>
        <p className="text-emerald-100 text-sm max-w-2xl mx-auto">
          Acompanhe os resultados das ações da Prefeitura de Madalena a partir das demandas registradas pela população no +VOZ.
        </p>
      </div>

      {/* Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#0F8A43] flex items-center justify-center font-extrabold text-xl">
            {resolutionRate}%
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Taxa de Resolutividade</h3>
            <p className="text-xs text-slate-500 mt-0.5">Ocorrências atendidas e concluídas</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#FF8C00] flex items-center justify-center font-extrabold text-xl">
            3.8d
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Tempo Médio de Atendimento</h3>
            <p className="text-xs text-slate-500 mt-0.5">Desde o envio até a solução final</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold text-xl">
            4.9★
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Satisfação do Cidadão</h3>
            <p className="text-xs text-slate-500 mt-0.5">Média das avaliações pós-serviço</p>
          </div>
        </div>

      </div>

      {/* Solved Cases Showcase Wall */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
        <div>
          <span className="text-xs font-bold text-[#0F8A43] uppercase tracking-wider">Ações Concluídas</span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">
            Mural de Ocorrências Resolvidas
          </h3>
          <p className="text-xs text-slate-500">
            Veja exemplos de serviços executados recentemente nos bairros de Madalena:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solvedReports.map((report) => (
            <div 
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="bg-[#F5F5F5] rounded-2xl overflow-hidden border border-slate-200 hover:border-[#0F8A43] hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Solution Photo Header */}
                {report.solutionPhotos && report.solutionPhotos.length > 0 ? (
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={report.solutionPhotos[0]} 
                      alt="Solução" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-[#0F8A43] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      CONCLUÍDO
                    </div>
                  </div>
                ) : (
                  <div className="h-32 bg-emerald-800 text-white p-4 flex items-center justify-center text-center font-bold text-sm">
                    {SECRETARIATS.find(s => s.id === report.secretariatId)?.name}
                  </div>
                )}

                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-[11px] font-bold text-[#0F8A43]">
                    <span>{report.protocol}</span>
                    <span className="text-slate-500">{new Date(report.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                    {report.location.neighborhood}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    "{report.description}"
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-[#0F8A43] font-bold">
                <span>Ver histórico do protocolo</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
