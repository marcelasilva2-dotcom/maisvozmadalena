import React, { useState } from 'react';
import { 
  PlusCircle, 
  FileText, 
  Search, 
  Building2, 
  HelpCircle, 
  Newspaper, 
  ChevronRight, 
  Bell, 
  ShieldCheck, 
  Megaphone, 
  Presentation,
  Shield,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { VozLogo } from './VozLogo';

interface HomeQuickMenuProps {
  onNewComplaint: () => void;
  onNavigate: (view: 'home' | 'wizard' | 'lookup' | 'transparency' | 'admin' | 'presentation') => void;
}

export const HomeQuickMenu: React.FC<HomeQuickMenuProps> = ({
  onNewComplaint,
  onNavigate
}) => {
  const [quickProtocol, setQuickProtocol] = useState('');
  const [showLgpdModal, setShowLgpdModal] = useState(false);

  const handleQuickLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickProtocol.trim()) {
      sessionStorage.setItem('pending_lookup_protocol', quickProtocol.trim().toUpperCase());
      onNavigate('lookup');
    } else {
      onNavigate('lookup');
    }
  };

  return (
    <div className="max-w-7xl mx-auto my-6 sm:my-8 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      
      {/* Top Welcome Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <VozLogo size="md" variant="emblem" className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                Olá, Cidadão de Madalena!
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0F8A43] text-[11px] font-bold">
                Ouvidoria Ativa 24h
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5 truncate">
              Participe da melhoria dos serviços públicos da nossa cidade com total segurança.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={() => setShowLgpdModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Garantias de Privacidade e Sigilo LGPD"
          >
            <ShieldCheck className="w-4 h-4 text-[#0F8A43]" />
            <span className="hidden sm:inline">Sigilo LGPD</span>
          </button>

          <button 
            onClick={() => onNavigate('transparency')}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors relative"
            title="Avisos e Transparência"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF8C00]" />
          </button>
        </div>
      </div>

      {/* Hero Actions Row: Big CTA + Quick Protocol Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        
        {/* Main CTA: Nova Denúncia (Takes 7 cols on desktop) */}
        <div 
          onClick={onNewComplaint}
          className="lg:col-span-7 bg-gradient-to-br from-[#0a5228] via-[#0F8A43] to-[#128a44] text-white rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
        >
          {/* Subtle decorative circles */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none blur-2xl group-hover:scale-110 transition-transform" />
          
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-extrabold tracking-wide uppercase flex items-center gap-1 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Canal Oficial de Ouvidoria
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-200 text-[10px] font-semibold">
                Anônima ou Identificada
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Registrar Nova Denúncia ou Solicitação
            </h3>
            
            <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed max-w-xl">
              Relate buracos, falta d'água, iluminação queimada, entulho ou qualquer demanda municipal. Anexe fotos, áudios e conte com triagem inteligente.
            </p>
          </div>

          <div className="pt-6 relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#0F8A43] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <PlusCircle className="w-7 h-7" />
              </div>
              <span className="font-extrabold text-sm sm:text-base text-white underline-offset-4 group-hover:underline">
                Iniciar Formulário Rápido →
              </span>
            </div>

            <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
              <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Secondary Box: Consulta Direta por Protocolo (Takes 5 cols on desktop) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 shadow-md border border-slate-200/90 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF8C00] bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                Acompanhamento Rápido
              </span>
              <Search className="w-4 h-4 text-slate-400" />
            </div>

            <h4 className="text-base sm:text-lg font-black text-slate-900">
              Já possui um Protocolo?
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Consulte o status do seu chamado, despachos da secretaria e as fotos da solução do serviço.
            </p>
          </div>

          <form onSubmit={handleQuickLookup} className="space-y-3 pt-2">
            <div className="relative">
              <input
                type="text"
                value={quickProtocol}
                onChange={(e) => setQuickProtocol(e.target.value.toUpperCase())}
                placeholder="Ex: MVM-2026-123456"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F8A43] focus:border-transparent transition-all bg-slate-50 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Consultar Andamento</span>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

      </div>

      {/* Main Options Grid (Responsive: 1 col on mobile, 2 on tablet, 4 on desktop) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Serviços e Informações da Ouvidoria
            </h3>
            <p className="text-xs text-slate-500">
              Acesso rápido a todas as funcionalidades do sistema municipal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1: Minhas denúncias & Transparência */}
          <button
            onClick={() => onNavigate('transparency')}
            className="w-full p-5 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-[#0F8A43] hover:shadow-lg transition-all duration-200 flex flex-col justify-between text-left group min-h-[160px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0F8A43] border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#0F8A43] text-[10px] font-bold uppercase">
                  Transparência
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#0F8A43] transition-colors leading-snug">
                  Painel de Transparência
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  Acompanhe ocorrências resolvidas, gráficos municipais e mapa interativo.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#0F8A43] pt-3 mt-2 border-t border-slate-100">
              <span>Acessar mural</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Consultar por Protocolo */}
          <button
            onClick={() => onNavigate('lookup')}
            className="w-full p-5 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-amber-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between text-left group min-h-[160px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-[#FF8C00] border border-amber-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-[#FF8C00] text-[10px] font-bold uppercase">
                  Tempo Real
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#FF8C00] transition-colors leading-snug">
                  Consultar Denúncia
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  Veja a linha do tempo com 5 etapas, despacho operacional e avaliação.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#FF8C00] pt-3 mt-2 border-t border-slate-100">
              <span>Rastrear chamado</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Secretarias Municipais */}
          <a
            href="#secretarias"
            className="w-full p-5 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-blue-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between text-left group min-h-[160px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
                  8 Órgãos
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  Secretarias Municipais
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  Conheça os titulares, contatos, endereços e prazos oficiais de SLA.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-blue-600 pt-3 mt-2 border-t border-slate-100">
              <span>Ver secretarias</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* Card 4: Apresentação na Câmara */}
          <button
            onClick={() => onNavigate('presentation')}
            className="w-full p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl shadow-md border border-slate-700/80 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-200 flex flex-col justify-between text-left group min-h-[160px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Presentation className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#FF8C00]/30 text-amber-300 border border-[#FF8C00]/40 text-[10px] font-bold uppercase">
                  Slides
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  Apresentação na Câmara
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                  Slides institucionais com dados pedagógicos e apoio parlamentar.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 pt-3 mt-2 border-t border-slate-700/60">
              <span>Iniciar apresentação</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 5: Como Funciona */}
          <a
            href="#como-funciona"
            className="w-full p-5 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-purple-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between text-left group min-h-[160px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 text-[10px] font-bold uppercase">
                  Passo a Passo
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-purple-600 transition-colors leading-snug">
                  Como Funciona
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  Entenda as 5 fases desde o envio pelo munícipe até o encerramento do chamado.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-purple-600 pt-3 mt-2 border-t border-slate-100">
              <span>Ver fluxo completo</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* Card 6: Garantia de Sigilo & LGPD */}
          <button
            onClick={() => setShowLgpdModal(true)}
            className="w-full p-5 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-emerald-600 hover:shadow-lg transition-all duration-200 flex flex-col justify-between text-left group min-h-[160px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0F8A43] border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#0F8A43] text-[10px] font-bold uppercase">
                  LGPD 13.709
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#0F8A43] transition-colors leading-snug">
                  Segurança & LGPD
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  Proteção integral dos dados, sigilo de fonte garantido e denúncia anônima.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#0F8A43] pt-3 mt-2 border-t border-slate-100">
              <span>Ler garantias legais</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 7: Notícias da Prefeitura */}
          <a
            href="https://www.madalena.ce.gov.br"
            target="_blank"
            rel="noreferrer"
            className="w-full p-5 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-teal-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between text-left group min-h-[160px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Newspaper className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-600 text-[10px] font-bold uppercase">
                  Portal Oficial
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-teal-600 transition-colors leading-snug">
                  Notícias da Prefeitura
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  Acesse comunicados, decretos e notícias oficiais no portal de Madalena.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-teal-600 pt-3 mt-2 border-t border-slate-100">
              <span>Visitar site externo</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* Card 8: Painel Administrativo / Ouvidoria */}
          <button
            onClick={() => onNavigate('admin')}
            className="w-full p-5 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-slate-800 hover:shadow-lg transition-all duration-200 flex flex-col justify-between text-left group min-h-[160px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                  Servidores
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-slate-800 transition-colors leading-snug">
                  Acesso dos Gestores
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  Área protegida para secretários e ouvidores despacharem ordens de serviço.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800 pt-3 mt-2 border-t border-slate-100">
              <span>Entrar no painel</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>
      </div>

      {/* Municipal Civic Message Footer */}
      <div className="bg-gradient-to-r from-[#0F8A43] to-[#128a44] text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Megaphone className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-white">
              Sua denúncia vai direto para a secretaria municipal responsável
            </h4>
            <p className="text-xs text-emerald-100 mt-0.5">
              Madalena avança com a colaboração ativa e fiscalização de todos os cidadãos.
            </p>
          </div>
        </div>

        <button
          onClick={onNewComplaint}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-[#0F8A43] font-black text-xs sm:text-sm shadow-md transition-all shrink-0 active:scale-95"
        >
          Participar Agora
        </button>
      </div>

      {/* LGPD & Citizen Protection Modal */}
      {showLgpdModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F8A43] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Segurança e LGPD no +VOZ Madalena
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Lei Federal nº 13.709/2018 (Lei Geral de Proteção de Dados)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowLgpdModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                <h5 className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#0F8A43]" />
                  1. Opção de Denúncia 100% Anônima
                </h5>
                <p className="text-emerald-900 text-[11px]">
                  O cidadão tem o direito de não se identificar. Ao escolher a modalidade anônima, nenhum nome, CPF, e-mail, telefone ou endereço IP é vinculado ao protocolo público ou armazenado.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <h5 className="font-bold text-slate-900">
                  2. Sigilo de Fonte em Denúncias Identificadas
                </h5>
                <p className="text-slate-600 text-[11px]">
                  Quando o munícipe opta por se identificar, os dados pessoais (nome, CPF, WhatsApp) são restritos exclusivamente ao Ouvidor Municipal e técnicos responsáveis pelo atendimento. Esses dados NUNCA são expostos no Mapa Interativo ou no Mural de Transparência.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <h5 className="font-bold text-slate-900">
                  3. Finalidade Estrita e Não Compartilhamento Comercial
                </h5>
                <p className="text-slate-600 text-[11px]">
                  Os dados coletados têm como única finalidade o encaminhamento administrativo e resolução das demandas públicas municipais de Madalena - CE, vedado qualquer compartilhamento com terceiros privados.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <h5 className="font-bold text-slate-900">
                  4. Direito de Acesso e Retificação
                </h5>
                <p className="text-slate-600 text-[11px]">
                  Em conformidade com o Art. 18 da LGPD, o titular dos dados pode consultar o andamento a qualquer momento por meio do seu código de protocolo e solicitar esclarecimentos à Ouvidoria.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowLgpdModal(false)}
              className="w-full py-3 rounded-xl bg-[#0F8A43] hover:bg-[#0b6b33] text-white font-bold text-xs transition-colors shadow-md"
            >
              Entendido e Ciente
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
