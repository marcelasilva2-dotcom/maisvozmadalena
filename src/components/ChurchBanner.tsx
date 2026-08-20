import React, { useState } from 'react';
import { PlusCircle, Search, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { MadalenaChurchIllustration } from './MadalenaChurchIllustration';

interface ChurchBannerProps {
  onNewComplaint: () => void;
  onSearchProtocol: (protocol: string) => void;
}

export const ChurchBanner: React.FC<ChurchBannerProps> = ({ onNewComplaint, onSearchProtocol }) => {
  const [protocolInput, setProtocolInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (protocolInput.trim()) {
      onSearchProtocol(protocolInput.trim());
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a5228] via-[#0F8A43] to-[#128a44] text-white py-12 md:py-20 shadow-lg">
      {/* Background Decorative Pattern & Gradients */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF8C00] rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#45B649] rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-100 text-xs font-medium shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF8C00]" />
              <span>Ouvidoria Digital Unificada de Madalena – Ceará</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-xs">
              Sua voz transforma <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-emerald-200">
                Madalena.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-emerald-50 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Registre denúncias, solicitações de serviços, sugestões e reclamações diretamente para as secretarias municipais com total transparência e acompanhamento por protocolo em tempo real.
            </p>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onNewComplaint}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FF8C00] hover:bg-[#e07b00] text-white text-base font-bold shadow-xl hover:shadow-2xl hover:brightness-110 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <PlusCircle className="w-6 h-6" />
                Nova Denúncia
              </button>

              <a
                href="#como-funciona"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
              >
                <span>Como funciona?</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Protocol Track Input */}
            <div className="pt-2 max-w-md mx-auto lg:mx-0">
              <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0">
                <input
                  type="text"
                  value={protocolInput}
                  onChange={(e) => setProtocolInput(e.target.value)}
                  placeholder="Já tem protocolo? Ex: MVM-2026-894120"
                  className="w-full pl-4 pr-4 sm:pr-28 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400 text-sm font-medium shadow-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
                />
                <button
                  type="submit"
                  className="sm:absolute sm:right-1.5 sm:top-1.5 sm:bottom-1.5 py-2.5 px-4 rounded-lg bg-[#0F8A43] hover:bg-[#0b6b33] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  Buscar
                </button>
              </form>
            </div>

            {/* Security Guarantee Note */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-emerald-100/90 pt-1">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Opção de denúncia 100% anônima ou identificada • Protegido por LGPD</span>
            </div>

          </div>

          {/* Right Column: Handcrafted Outline Illustration of Igreja Matriz de Madalena - CE */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-sm sm:max-w-md bg-emerald-950/40 p-4 sm:p-6 rounded-3xl border border-white/20 backdrop-blur-md shadow-2xl flex flex-col items-center text-center">
              
              {/* Aerial Architectural Line-Art Illustration of Igreja Matriz & Madalena */}
              <div className="w-full aspect-square max-h-80 flex items-center justify-center">
                <MadalenaChurchIllustration className="w-full h-full shadow-inner" />
              </div>

              {/* Caption */}
              <div className="mt-3">
                <p className="text-xs font-bold tracking-wider text-amber-300 uppercase">
                  Igreja Matriz de Nossa Senhora da Conceição
                </p>
                <p className="text-[11px] text-emerald-100/90 font-medium mt-0.5">
                  Praça Matriz de Madalena - Ceará
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
