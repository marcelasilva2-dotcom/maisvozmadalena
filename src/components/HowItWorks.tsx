import React from 'react';
import { Building, MessageSquareText, Camera, Send, FileCheck2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Escolha a Secretaria',
      desc: 'Selecione o órgão municipal responsável pelo assunto (ou deixe a IA sugerir).',
      icon: <Building className="w-6 h-6 text-[#0F8A43]" />,
      color: 'bg-emerald-50 text-[#0F8A43]'
    },
    {
      number: '2',
      title: 'Conte o Problema',
      desc: 'Descreva detalhadamente a situação, categoria e localização em Madalena.',
      icon: <MessageSquareText className="w-6 h-6 text-[#FF8C00]" />,
      color: 'bg-amber-50 text-[#FF8C00]'
    },
    {
      number: '3',
      title: 'Anexe Fotos ou Áudios',
      desc: 'Adicione fotos, vídeos ou grave áudios direto do navegador para comprovar.',
      icon: <Camera className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      number: '4',
      title: 'Envie com Segurança',
      desc: 'Escolha entre denúncia identificada ou anônima e confirme o envio.',
      icon: <Send className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      number: '5',
      title: 'Acompanhe pelo Protocolo',
      desc: 'Receba atualizações em tempo real, respostas da secretaria e foto da solução.',
      icon: <FileCheck2 className="w-6 h-6 text-[#0F8A43]" />,
      color: 'bg-emerald-50 text-[#0F8A43]'
    }
  ];

  return (
    <section id="como-funciona" className="py-12 bg-[#F5F5F5] border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF8C00] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Passo a Passo Simplificado
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Como funciona a Ouvidoria +VOZ?
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Em apenas 5 passos rápidos, sua solicitação chega à equipe técnica da Prefeitura.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => (
            <div key={idx} className={`relative bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between items-center text-center group hover:shadow-md transition-shadow ${idx === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
              
              {/* Step Number Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#0F8A43] text-white text-xs font-bold flex items-center justify-center shadow-md border-2 border-white">
                {step.number}
              </div>

              <div className="pt-3 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Arrow connector for desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-300 font-bold text-lg">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
