import React from 'react';
import { PlusCircle, FileText, Search, Building2, HelpCircle, Newspaper, ChevronRight, Bell, ShieldCheck, Mail, Megaphone, Presentation } from 'lucide-react';
import { SECRETARIATS } from '../data/mockData';
import { VozLogo } from './VozLogo';

interface HomeQuickMenuProps {
  onNewComplaint: () => void;
  onNavigate: (view: 'home' | 'wizard' | 'lookup' | 'transparency' | 'admin' | 'presentation') => void;
}

export const HomeQuickMenu: React.FC<HomeQuickMenuProps> = ({
  onNewComplaint,
  onNavigate
}) => {
  return (
    <div className="max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto my-6 sm:my-8 px-4 space-y-4 sm:space-y-6">
      
      {/* Mobile App Header (Screen 1 in layout image) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-md border border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <VozLogo size="md" variant="emblem" className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" />
          <div>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-900 leading-tight">
              Olá, cidadão!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Madalena melhora com a sua participação.
            </p>
          </div>
        </div>

        <button 
          onClick={() => onNavigate('transparency')}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors relative shrink-0"
          title="Notificações e Avisos"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF8C00]" />
        </button>
      </div>

      {/* Primary Big CTA Button (Screen 1 in layout image) */}
      <button
        onClick={onNewComplaint}
        className="w-full bg-[#0F8A43] hover:bg-[#0b6b33] text-white p-4 sm:p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-between group transform active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <PlusCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              Nova denúncia
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              Envie um problema para a secretaria responsável
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors shrink-0">
          <ChevronRight className="w-5 h-5 text-white" />
        </div>
      </button>

      {/* List of Option Cards - Responsive 1 col on mobile, 2 cols on tablet/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Minhas Denúncias / Transparência */}
        <button
          onClick={() => onNavigate('transparency')}
          className="w-full p-4 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-md transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F8A43] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-[#0F8A43] transition-colors">
                Minhas denúncias
              </h4>
              <p className="text-xs text-slate-500">
                Acompanhe o andamento das demandas
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0F8A43] transition-colors shrink-0" />
        </button>

        {/* Consultar denúncia */}
        <button
          onClick={() => onNavigate('lookup')}
          className="w-full p-4 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-amber-500/50 hover:shadow-md transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#FF8C00] flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-[#FF8C00] transition-colors">
                Consultar denúncia
              </h4>
              <p className="text-xs text-slate-500">
                Acompanhe com seu protocolo
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#FF8C00] transition-colors shrink-0" />
        </button>

        {/* Secretarias */}
        <a
          href="#secretarias"
          className="w-full p-4 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-blue-500/50 hover:shadow-md transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                Secretarias
              </h4>
              <p className="text-xs text-slate-500">
                Conheça os órgãos e responsáveis
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
        </a>

        {/* Como funciona */}
        <a
          href="#como-funciona"
          className="w-full p-4 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-purple-500/50 hover:shadow-md transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-purple-600 transition-colors">
                Como funciona
              </h4>
              <p className="text-xs text-slate-500">
                Entenda o passo a passo da ouvidoria
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors shrink-0" />
        </a>

        {/* Apresentação do Projeto na Câmara de Madalena */}
        <button
          onClick={() => onNavigate('presentation')}
          className="sm:col-span-2 w-full p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl shadow-md border border-slate-700/80 hover:border-emerald-500/50 hover:shadow-xl transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Presentation className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors">
                  Apresentação na Câmara Municipal
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-[#FF8C00]/20 text-[#FF8C00] border border-[#FF8C00]/40 text-[10px] font-bold uppercase">
                  Slides
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Veja a apresentação institucional com dados, benefícios para os vereadores e fluxo do projeto
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
        </button>

        {/* Notícias da Prefeitura */}
        <a
          href="https://www.madalena.ce.gov.br"
          target="_blank"
          rel="noreferrer"
          className="sm:col-span-2 w-full p-4 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-teal-500/50 hover:shadow-md transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-teal-600 transition-colors">
                Notícias da Prefeitura de Madalena
              </h4>
              <p className="text-xs text-slate-500">
                Fique por dentro das ações e obras oficiais
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors shrink-0" />
        </a>

      </div>

      {/* Footer Banner Info Box (Screen 1 bottom in layout image) */}
      <div className="bg-[#0F8A43] text-white rounded-2xl p-4 text-center space-y-2 shadow-md">
        <div className="flex items-center justify-center gap-2">
          <Megaphone className="w-5 h-5 text-[#FF8C00] shrink-0" />
          <p className="text-xs sm:text-sm font-bold">
            Sua denúncia vai direto para a secretaria responsável.
          </p>
        </div>
        <h4 className="text-sm sm:text-base font-extrabold text-amber-200">
          Madalena melhora com você!
        </h4>
      </div>

    </div>
  );
};
