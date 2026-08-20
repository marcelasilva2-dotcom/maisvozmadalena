import React, { useEffect, useState } from 'react';
import { Check, Copy, Search, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConfirmationModalProps {
  protocol: string;
  onConsultProtocol: (protocol: string) => void;
  onNewComplaint: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  protocol,
  onConsultProtocol,
  onNewComplaint
}) => {
  const [copied, setCopied] = useState(false);
  const nowFormatted = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0F8A43', '#45B649', '#FF8C00']
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(protocol);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-md mx-auto my-8 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-6">
        
        {/* Big Green Badge with Radial Glow */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full bg-emerald-200/50 animate-ping opacity-75" />
          <div className="relative w-20 h-20 bg-[#0F8A43] text-white rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
            Sua denúncia foi enviada com sucesso!
          </h2>
          <p className="text-slate-600 text-xs leading-relaxed max-w-xs mx-auto">
            Guarde este código. Ele será necessário para acompanhar o andamento da sua denúncia.
          </p>
        </div>

        {/* Protocol Box (Screen 7 layout) */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Protocolo
          </span>
          <div className="text-2xl sm:text-3xl font-black tracking-widest text-[#0F8A43]">
            {protocol}
          </div>
          <p className="text-[11px] text-slate-400 font-medium pt-1">
            {nowFormatted}
          </p>
        </div>

        {/* Action Buttons: Copiar, Consultar, Voltar ao início */}
        <div className="space-y-2.5">
          
          <button
            onClick={handleCopy}
            className="w-full py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#0F8A43]" />
                Protocolo copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                Copiar protocolo
              </>
            )}
          </button>

          <button
            onClick={() => onConsultProtocol(protocol)}
            className="w-full py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Search className="w-4 h-4 text-slate-500" />
            Consultar denúncia
          </button>

          <button
            onClick={onNewComplaint}
            className="w-full py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Home className="w-4 h-4 text-slate-500" />
            Voltar ao início
          </button>

        </div>

      </div>
    </div>
  );
};

