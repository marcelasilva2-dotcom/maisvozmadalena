import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Send, 
  User, 
  MapPin, 
  Building2, 
  Star, 
  MessageSquare, 
  FileText, 
  AlertCircle,
  Image as ImageIcon,
  Check,
  ArrowLeft,
  X,
  HelpCircle,
  Home
} from 'lucide-react';
import { Report, ReportStatus } from '../types';
import { SECRETARIATS } from '../data/mockData';

interface ProtocolLookupProps {
  initialProtocol?: string;
  onSearch: (protocol: string) => Promise<Report | null>;
  onRateReport: (reportId: string, rating: number, feedback: string) => Promise<void>;
  onGoHome?: () => void;
}

export const ProtocolLookup: React.FC<ProtocolLookupProps> = ({
  initialProtocol = '',
  onSearch,
  onRateReport,
  onGoHome
}) => {
  const [protocolInput, setProtocolInput] = useState<string>(initialProtocol);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [notFoundError, setNotFoundError] = useState<string | null>(null);

  // Sub-view in lookup: 'input' | 'status' | 'details' | 'rating'
  const [activeTab, setActiveTab] = useState<'input' | 'status' | 'details' | 'rating'>('input');

  // Rating state
  const [userRating, setUserRating] = useState<number>(5);
  const [userFeedback, setUserFeedback] = useState<string>('');
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protocolInput.trim()) return;

    setLoading(true);
    setNotFoundError(null);
    setReport(null);

    try {
      const found = await onSearch(protocolInput.trim());
      if (found) {
        setReport(found);
        setActiveTab('status');
      } else {
        setNotFoundError(`Protocolo "${protocolInput}" não localizado. Verifique se digitou MVM-2026-XXXXXX.`);
      }
    } catch (err: any) {
      setNotFoundError('Não foi possível realizar a consulta no momento.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (!report) return;
    try {
      await onRateReport(report.id, userRating, userFeedback);
      setRatingSubmitted(true);
      alert('Avaliação enviada com sucesso! Obrigado pelo feedback.');
    } catch (err) {
      alert('Erro ao enviar avaliação.');
    }
  };

  const statusSteps: { key: ReportStatus; label: string; desc: string }[] = [
    { key: 'recebida', label: 'Recebida', desc: 'Sua denúncia foi recebida com sucesso.' },
    { key: 'em_analise', label: 'Em análise', desc: 'A secretaria está analisando sua demanda.' },
    { key: 'em_atendimento', label: 'Em andamento', desc: 'A secretaria iniciou as providências necessárias.' },
    { key: 'resolvida', label: 'Resolvida', desc: 'Assim que o problema for resolvido, você será informado.' }
  ];

  const getStatusIndex = (st: ReportStatus) => {
    switch (st) {
      case 'recebida': return 0;
      case 'em_analise': return 1;
      case 'encaminhada': return 1;
      case 'em_atendimento': return 2;
      case 'resolvida': return 3;
      default: return 0;
    }
  };

  const currentStatusIndex = report ? getStatusIndex(report.status) : 0;
  const secretariatName = report ? (SECRETARIATS.find(s => s.id === report.secretariatId)?.name || 'Ouvidoria Geral') : '';

  return (
    <div className="max-w-md mx-auto my-6 px-4 space-y-5">
      
      {/* SCREEN 9: SEARCH INPUT VIEW */}
      {(!report || activeTab === 'input') && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200/90 space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                title="Voltar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 text-center flex-1">
              Consultar denúncia
            </h2>
            <div className="w-5" />
          </div>

          <p className="text-xs text-slate-500 text-center leading-relaxed">
            Informe o protocolo para acompanhar o andamento da sua denúncia.
          </p>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-extrabold text-slate-700">
                Protocolo
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={protocolInput}
                  onChange={(e) => setProtocolInput(e.target.value)}
                  placeholder="Ex: MVM-2026-000154"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm font-black text-[#0F8A43] tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-[#0F8A43] bg-slate-50"
                />
                {protocolInput && (
                  <button
                    type="button"
                    onClick={() => setProtocolInput('')}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !protocolInput.trim()}
              className="w-full py-3 rounded-xl bg-[#0F8A43] hover:bg-[#0b6b33] disabled:bg-slate-300 text-white font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </form>

          {notFoundError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{notFoundError}</span>
            </div>
          )}

          {/* How do I find my protocol? card (Screen 9 layout) */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1.5 text-left">
            <h4 className="text-xs font-extrabold text-slate-800">
              Como encontro meu protocolo?
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Ele é gerado automaticamente ao enviar sua denúncia. Guarde-o com segurança.
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Entenda mais sobre o protocolo</span>
          </div>

        </div>
      )}

      {/* SCREEN 10: ACOMPANHAMENTO (STATUS TIMELINE) */}
      {report && activeTab === 'status' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200/90 space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <button
              onClick={() => setActiveTab('input')}
              className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Acompanhamento
            </h2>
            <div className="w-5" />
          </div>

          {/* Protocol Info Header */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Protocolo
            </span>
            <div className="text-xl font-black text-[#0F8A43] tracking-wider">
              {report.protocol}
            </div>
            <div className="pt-2 text-xs text-slate-700">
              <span className="text-slate-500 font-semibold">Secretaria: </span>
              <span className="font-extrabold text-slate-800">{secretariatName}</span>
            </div>
          </div>

          {/* Vertical Status Timeline (Screen 10 in image) */}
          <div className="space-y-3 text-left">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Status da sua denúncia
            </h3>

            <div className="space-y-4 relative pl-2">
              {statusSteps.map((step, idx) => {
                const isDone = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;

                return (
                  <div key={step.key} className="flex items-start gap-3 relative">
                    {/* Vertical Connecting Line */}
                    {idx < statusSteps.length - 1 && (
                      <div 
                        className={`absolute left-3.5 top-7 bottom-0 w-0.5 -mb-4 ${
                          idx < currentStatusIndex ? 'bg-[#0F8A43]' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                      isDone 
                        ? 'bg-[#0F8A43] text-white shadow-sm' 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      {isDone ? '✓' : idx + 1}
                    </div>

                    <div className="pt-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs font-extrabold ${isCurrent ? 'text-[#0F8A43]' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] bg-emerald-100 text-[#0F8A43] px-2 py-0.5 rounded-full font-bold">
                            Atual
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setActiveTab('details')}
              className="w-full py-3 rounded-xl bg-[#0F8A43] hover:bg-[#0b6b33] text-white font-bold text-xs shadow-md transition-colors"
            >
              Ver detalhes
            </button>

            {report.status === 'resolvida' && (
              <button
                onClick={() => setActiveTab('rating')}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-colors"
              >
                Avaliar atendimento ★
              </button>
            )}
          </div>

        </div>
      )}

      {/* SCREEN 11: DETALHES DA DENÚNCIA */}
      {report && activeTab === 'details' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200/90 space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <button
              onClick={() => setActiveTab('status')}
              className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Detalhes da denúncia
            </h2>
            <div className="w-5" />
          </div>

          <div className="space-y-3 text-left">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Protocolo</span>
              <p className="text-lg font-black text-[#0F8A43]">{report.protocol}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Secretaria</span>
              <p className="text-xs font-bold text-slate-800">{secretariatName}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Descrição</span>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                {report.description}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Localização</span>
              <p className="text-xs text-slate-800 font-medium">{report.location.address}</p>
              <p className="text-[11px] text-slate-500">{report.location.neighborhood}, Madalena - CE</p>
            </div>

            {/* Media Gallery attached by citizen */}
            {report.mediaUrls && report.mediaUrls.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Mídia enviada</span>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {report.mediaUrls.map((url, i) => (
                    <img key={i} src={url} alt="Anexo" className="w-full h-20 object-cover rounded-xl border border-slate-200" />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Service proof photo */}
            {report.solutionPhotos && report.solutionPhotos.length > 0 && (
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 space-y-2">
                <span className="text-[11px] font-extrabold text-[#0F8A43]">
                  Comprovante de Solução Realizada ✓
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {report.solutionPhotos.map((url, i) => (
                    <img key={i} src={url} alt="Solução" className="w-full h-24 object-cover rounded-xl border border-emerald-300" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action to evaluation or return */}
          <div className="space-y-2 pt-2">
            {report.status === 'resolvida' && (
              <button
                onClick={() => setActiveTab('rating')}
                className="w-full py-3 rounded-xl bg-[#0F8A43] hover:bg-[#0b6b33] text-white font-bold text-xs shadow-md transition-colors"
              >
                Avalie o atendimento
              </button>
            )}
            <button
              onClick={() => setActiveTab('status')}
              className="w-full py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Histórico de atualizações
            </button>
          </div>

        </div>
      )}

      {/* SCREEN 12: AVALIE O ATENDIMENTO */}
      {report && activeTab === 'rating' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200/90 space-y-5 text-center">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <button
              onClick={() => setActiveTab('status')}
              className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Avalie o atendimento
            </h2>
            <div className="w-5" />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900">
              Sua denúncia foi resolvida?
            </h3>
            <p className="text-xs text-slate-500">
              Conte pra gente como foi o atendimento.
            </p>
          </div>

          {/* 5 Stars Rating Component (Screen 12 in image) */}
          <div className="flex justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setUserRating(star)}
                className="p-1 text-amber-400 hover:scale-125 transition-transform"
              >
                <Star className={`w-8 h-8 fill-current ${star <= userRating ? 'text-amber-400' : 'text-slate-200'}`} />
              </button>
            ))}
          </div>

          {/* Comment textarea with character counter 73/300 */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-slate-700">
              Deixe seu comentário (opcional)
            </label>
            <textarea
              value={userFeedback}
              onChange={(e) => setUserFeedback(e.target.value.slice(0, 300))}
              placeholder="O problema foi resolvido rapidamente. Obrigado!"
              rows={3}
              className="w-full p-3 rounded-2xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#0F8A43] focus:outline-none"
            />
            <div className="text-right text-[10px] text-slate-400 font-bold">
              {userFeedback.length}/300
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleRatingSubmit}
              className="w-full py-3 rounded-xl bg-[#0F8A43] hover:bg-[#0b6b33] text-white font-bold text-xs shadow-md transition-colors"
            >
              Enviar avaliação
            </button>

            {onGoHome && (
              <button
                onClick={onGoHome}
                className="w-full py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Home className="w-4 h-4 text-slate-500" />
                Voltar ao início
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

