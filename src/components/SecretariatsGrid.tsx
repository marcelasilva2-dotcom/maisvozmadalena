import React from 'react';
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
  FileText, 
  Lightbulb, 
  Trash2, 
  Megaphone,
  ArrowRight,
  Plus,
  Droplets,
  Hammer,
  Briefcase,
  Shield
} from 'lucide-react';
import { SECRETARIATS } from '../data/mockData';
import { SecretariatId, SecretariatInfo } from '../types';

interface SecretariatsGridProps {
  onSelectSecretariat: (id: SecretariatId) => void;
  reportCountsBySecretariat?: Record<string, number>;
  secretariats?: SecretariatInfo[];
}

export const SecretariatsGrid: React.FC<SecretariatsGridProps> = ({ 
  onSelectSecretariat,
  reportCountsBySecretariat = {},
  secretariats = SECRETARIATS
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-6 h-6" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6" />;
      case 'Trees': return <Trees className="w-6 h-6" />;
      case 'Users': return <Users className="w-6 h-6" />;
      case 'Tractor': return <Tractor className="w-6 h-6" />;
      case 'Palette': return <Palette className="w-6 h-6" />;
      case 'Trophy': return <Trophy className="w-6 h-6" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6" />;
      case 'FileText': return <FileText className="w-6 h-6" />;
      case 'Lightbulb': return <Lightbulb className="w-6 h-6" />;
      case 'Trash2': return <Trash2 className="w-6 h-6" />;
      case 'Droplets': return <Droplets className="w-6 h-6" />;
      case 'Hammer': return <Hammer className="w-6 h-6" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6" />;
      case 'Shield': return <Shield className="w-6 h-6" />;
      case 'Megaphone': default: return <Megaphone className="w-6 h-6" />;
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F8A43] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Encaminhamento Direto
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Escolha a Secretaria Responsável
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Sua solicitação é direcionada imediatamente para a equipe do setor encarregado pela solução no município de Madalena.
          </p>
        </div>

        {/* Grid of Secretariats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {secretariats.filter(s => s.active !== false).map((sec) => {
            const count = reportCountsBySecretariat[sec.id] || 0;

            return (
              <div
                key={sec.id}
                onClick={() => onSelectSecretariat(sec.id)}
                className="group relative bg-[#F5F5F5] hover:bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-[#0F8A43] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between transform hover:-translate-y-1"
              >
                <div>
                  {/* Top Header inside card */}
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110"
                      style={{ backgroundColor: sec.color }}
                    >
                      {getIcon(sec.iconName)}
                    </div>

                    {count > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-[#0F8A43] border border-emerald-200">
                        {count} atendimentos
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0F8A43] transition-colors line-clamp-1">
                    {sec.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                    {sec.description}
                  </p>
                </div>

                {/* Footer Action inside card */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-[#0F8A43] group-hover:text-[#0b6b33]">
                  <span className="flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    Registrar Denúncia
                  </span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
