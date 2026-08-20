import React, { useState } from 'react';
import { Search, ShieldCheck, BarChart2, Menu, X, Home, HelpCircle, PlusCircle, Lock, Building2 } from 'lucide-react';
import { VozLogo } from './VozLogo';

interface NavbarProps {
  onNavigate: (view: 'home' | 'wizard' | 'lookup' | 'transparency' | 'admin' | 'presentation') => void;
  activeView: string;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeView, isAdminLoggedIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: 'home' | 'wizard' | 'lookup' | 'transparency' | 'admin' | 'presentation') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Notice Bar */}
      <div className="bg-[#0F8A43] text-white text-xs py-1.5 px-4 font-medium flex justify-between items-center">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#45B649] animate-pulse"></span>
            <span>Prefeitura Municipal de Madalena – CE • Portal Oficial da População</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-emerald-100 text-[11px]">
            <span>Atendimento: Seg à Sex - 07:30 às 13:30</span>
            <span>•</span>
            <span>Ouvidoria: (88) 3442-1200</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & City Identity */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <VozLogo size="md" variant="emblem" className="w-12 h-12 shrink-0 group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-[#0F8A43]">
                  +VOZ
                </span>
                <span className="text-lg font-bold text-slate-700 border-l-2 border-[#f8ab05] pl-1.5 leading-none">
                  Madalena
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-1 tracking-wide">
                OUVIDORIA E DENÚNCIAS PÚBLICAS
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeView === 'home'
                  ? 'bg-emerald-50 text-[#0F8A43] font-semibold'
                  : 'text-slate-600 hover:text-[#0F8A43] hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              Início
            </button>

            <button
              onClick={() => handleNav('lookup')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeView === 'lookup'
                  ? 'bg-emerald-50 text-[#0F8A43] font-semibold'
                  : 'text-slate-600 hover:text-[#0F8A43] hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              Consultar Protocolo
            </button>

            <button
              onClick={() => handleNav('transparency')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeView === 'transparency'
                  ? 'bg-emerald-50 text-[#0F8A43] font-semibold'
                  : 'text-slate-600 hover:text-[#0F8A43] hover:bg-slate-50'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Transparência
            </button>

            <button
              onClick={() => handleNav('presentation')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeView === 'presentation'
                  ? 'bg-amber-50 text-[#FF8C00] font-semibold border border-amber-200'
                  : 'text-amber-700 bg-amber-50/70 hover:bg-amber-100/80 hover:text-amber-800'
              }`}
              title="Apresentação do Projeto na Câmara Municipal de Madalena"
            >
              <Building2 className="w-4 h-4 text-[#FF8C00]" />
              <span>Apresentação Câmara</span>
            </button>

            {/* Minimalist Gestor Icon Button */}
            <div className="relative group ml-1">
              <button
                onClick={() => handleNav('admin')}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center relative ${
                  activeView === 'admin'
                    ? 'bg-slate-900 text-amber-400 shadow-md ring-2 ring-amber-400/30'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={isAdminLoggedIn ? 'Painel do Gestor (Conectado)' : 'Acesso do Gestor Público'}
                aria-label="Painel do Gestor"
              >
                <Lock className="w-4 h-4" />
                {isAdminLoggedIn && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </button>

              {/* Minimalist Tooltip on Hover */}
              <div className="absolute right-0 -bottom-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-semibold py-1 px-2.5 rounded-md whitespace-nowrap shadow-lg z-50">
                {isAdminLoggedIn ? 'Painel Gestor (Online)' : 'Área do Gestor'}
              </div>
            </div>
          </nav>

          {/* Primary Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNav('wizard')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0F8A43] to-[#45B649] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:brightness-105 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Nova Denúncia
            </button>
          </div>

          {/* Mobile Actions: Minimalist Gestor Icon + New + Menu */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => handleNav('admin')}
              className={`p-2 rounded-xl transition-colors relative ${
                activeView === 'admin'
                  ? 'bg-slate-900 text-amber-400'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Área do Gestor"
              aria-label="Área do Gestor"
            >
              <Lock className="w-4 h-4" />
              {isAdminLoggedIn && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>

            <button
              onClick={() => handleNav('wizard')}
              className="px-3 py-1.5 rounded-lg bg-[#0F8A43] text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Nova
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 ${
              activeView === 'home' ? 'bg-emerald-50 text-[#0F8A43] font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Home className="w-5 h-5 text-[#0F8A43]" />
            Início
          </button>

          <button
            onClick={() => handleNav('wizard')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 bg-[#0F8A43] text-white shadow-sm`}
          >
            <PlusCircle className="w-5 h-5" />
            Nova Denúncia / Reclamação
          </button>

          <button
            onClick={() => handleNav('lookup')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 ${
              activeView === 'lookup' ? 'bg-emerald-50 text-[#0F8A43] font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Search className="w-5 h-5 text-[#FF8C00]" />
            Consultar Protocolo
          </button>

          <button
            onClick={() => handleNav('transparency')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 ${
              activeView === 'transparency' ? 'bg-emerald-50 text-[#0F8A43] font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BarChart2 className="w-5 h-5 text-[#0F8A43]" />
            Painel de Transparência
          </button>

          <button
            onClick={() => handleNav('presentation')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 ${
              activeView === 'presentation' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Building2 className="w-5 h-5 text-[#FF8C00]" />
            Apresentação na Câmara Municipal
          </button>

          <button
            onClick={() => handleNav('admin')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 bg-slate-900 text-white`}
          >
            <Lock className="w-5 h-5 text-[#FF8C00]" />
            Área do Gestor Público / Secretarias
          </button>
        </div>
      )}
    </header>
  );
};
