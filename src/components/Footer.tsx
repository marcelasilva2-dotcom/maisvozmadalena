import React, { useState } from 'react';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, X } from 'lucide-react';
import { VozLogo } from './VozLogo';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'lgpd' | 'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t-4 border-[#0F8A43]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Identity */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <VozLogo size="sm" variant="emblem" className="w-10 h-10 shrink-0" />
              <div>
                <span className="text-xl font-extrabold text-white">+VOZ <span className="text-[#45B649]">Madalena</span></span>
                <p className="text-[10px] text-slate-400 font-medium">Prefeitura Municipal de Madalena - CE</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma digital oficial de ouvidoria e denúncias públicas para aproximação entre o cidadão e a gestão municipal.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#FF8C00]" />
              <span>Protegido por Criptografia & LGPD</span>
            </div>
          </div>

          {/* Col 2: Contato e Endereço */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Atendimento e Ouvidoria
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#0F8A43] shrink-0 mt-0.5" />
                <span>Rua Maria do Carmo, Centro, Madalena – CE, CEP: 63860-000</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0F8A43] shrink-0" />
                <span>(88) 3442-1200 / (88) 3442-1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0F8A43] shrink-0" />
                <span>ouvidoria@madalena.ce.gov.br</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Links Institucionais & LGPD */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Transparência & Direitos
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setModalType('lgpd')} className="hover:text-emerald-400 transition-colors">
                  LGPD - Proteção de Dados
                </button>
              </li>
              <li>
                <button onClick={() => setModalType('privacy')} className="hover:text-emerald-400 transition-colors">
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button onClick={() => setModalType('terms')} className="hover:text-emerald-400 transition-colors">
                  Termos de Uso
                </button>
              </li>
              <li>
                <a href="https://www.madalena.ce.gov.br" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  Portal da Prefeitura de Madalena
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Redes Sociais & Horários */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Redes Oficiais
            </h4>
            <div className="flex gap-3 text-xs">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                Instagram
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                Facebook
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                YouTube
              </a>
            </div>

            <div className="pt-2 text-[11px] text-slate-500">
              <p className="font-semibold text-slate-400">Horário de Atendimento Presencial:</p>
              <p>Segunda a Sexta: 07h30 às 13h30</p>
            </div>
          </div>

        </div>

        {/* Infographic Summary Panels (Matching bottom of reference layout image) */}
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Funcionalidades principais */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0F8A43]" />
                Funcionalidades principais
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-[#0F8A43] font-bold">✓</span>
                  <span>Envio de fotos, vídeos e áudios</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0F8A43] font-bold">✓</span>
                  <span>Geolocalização automática ou manual</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0F8A43] font-bold">✓</span>
                  <span>Seleção da secretaria responsável</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0F8A43] font-bold">✓</span>
                  <span>Acompanhamento em tempo real</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0F8A43] font-bold">✓</span>
                  <span>Denúncia identificada e anônima</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0F8A43] font-bold">✓</span>
                  <span>Protocolo e histórico de denúncias</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0F8A43] font-bold">✓</span>
                  <span>Notificações de atualizações</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0F8A43] font-bold">✓</span>
                  <span>Avaliação do atendimento</span>
                </div>
              </div>
            </div>

            {/* Secretarias disponíveis */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF8C00]" />
                Secretarias disponíveis
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-300">
                <span>🔧 Infraestrutura</span>
                <span>🛡️ Segurança</span>
                <span>🌿 Meio Ambiente</span>
                <span>🤝 Assistência Social</span>
                <span>💡 Iluminação Pública</span>
                <span>🏛️ Administração</span>
                <span>💧 SAAE</span>
                <span>🚜 Agricultura</span>
                <span>🧹 Limpeza Urbana</span>
                <span>🎨 Cultura e Turismo</span>
                <span>🏥 Saúde</span>
                <span>🏆 Esporte e Juventude</span>
                <span>🎓 Educação</span>
                <span>📢 Ouvidoria Geral</span>
              </div>
            </div>

          </div>

          {/* Banner de apoio e prefeitura */}
          <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F8A43] text-white flex items-center justify-center font-black">
                M
              </div>
              <div>
                <p className="text-xs font-bold text-white">Prefeitura de Madalena - CE</p>
                <p className="text-[10px] text-slate-400">Construindo o futuro juntos</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              Versão 1.0.0 • © 2025/2026 Prefeitura de Madalena - CE
            </div>
          </div>

        </div>

        {/* Bottom Legal Row */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Prefeitura Municipal de Madalena – Ceará. Todos os direitos reservados.</p>
          <p>Plataforma Digital +VOZ Madalena v1.0 • Desenvolvido para o cidadão madalenense</p>
        </div>

      </div>

      {/* LGPD / Terms Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {modalType === 'lgpd' && 'Direitos de Privacidade e LGPD'}
                {modalType === 'privacy' && 'Política de Privacidade +VOZ'}
                {modalType === 'terms' && 'Termos de Uso do Portal'}
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed space-y-2 max-h-64 overflow-y-auto">
              <p>
                A Prefeitura Municipal de Madalena garante total conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
              </p>
              <p>
                As informações fornecidas em denúncias identificadas são mantidas em sigilo funcional e utilizadas estritamente para o processamento administrativo da sua solicitação junto à secretaria competente.
              </p>
              <p>
                Denúncias anônimas não armazenam qualquer dado pessoal ou endereço IP associado à identidade do usuário.
              </p>
            </div>

            <div className="text-right pt-2 border-t">
              <button
                onClick={() => setModalType(null)}
                className="px-5 py-2 rounded-xl bg-[#0F8A43] text-white text-xs font-bold"
              >
                Compreendido
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
