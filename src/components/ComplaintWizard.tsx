import React, { useState, useRef } from 'react';
import { 
  UserCheck, 
  ShieldOff, 
  Building2, 
  Tag, 
  FileText, 
  Upload, 
  MapPin, 
  CheckSquare, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Mic, 
  Square, 
  Trash2, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Check, 
  Loader2, 
  AlertCircle,
  Compass
} from 'lucide-react';
import { SECRETARIATS, CATEGORIES, MADALENA_NEIGHBORHOODS, MADALENA_COORDS } from '../data/mockData';
import { SecretariatId, CategoryId, ReportType, Attachment, SecretariatInfo } from '../types';
import { InteractiveMap } from './InteractiveMap';

interface ComplaintWizardProps {
  initialSecretariatId?: SecretariatId;
  onSubmitReport: (reportData: any) => Promise<string>;
  onCancel: () => void;
  secretariats?: SecretariatInfo[];
}

export const ComplaintWizard: React.FC<ComplaintWizardProps> = ({
  initialSecretariatId,
  onSubmitReport,
  onCancel,
  secretariats = SECRETARIATS
}) => {
  // Choice step 0: Type selection
  const [reportType, setReportType] = useState<ReportType | null>(null);
  
  // Wizard active step 1..6
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [secretariatId, setSecretariatId] = useState<SecretariatId>(initialSecretariatId || 'infraestrutura');
  const [category, setCategory] = useState<CategoryId>('buraco');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  // Audio recorder state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Location Fields
  const [street, setStreet] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [complement, setComplement] = useState<string>('');
  const [neighborhood, setNeighborhood] = useState<string>('Centro');
  const [cep, setCep] = useState<string>('63860-000');
  const [reference, setReference] = useState<string>('');
  const [markerLat, setMarkerLat] = useState<number>(MADALENA_COORDS.lat);
  const [markerLng, setMarkerLng] = useState<number>(MADALENA_COORDS.lng);

  // Citizen identification fields
  const [citizenName, setCitizenName] = useState<string>('');
  const [citizenCpf, setCitizenCpf] = useState<string>('');
  const [citizenEmail, setCitizenEmail] = useState<string>('');
  const [citizenPhone, setCitizenPhone] = useState<string>('');

  // Confirmation Checkbox
  const [isTruthConfirmed, setIsTruthConfirmed] = useState<boolean>(false);

  // UI Loaders & Errors
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter secretariats search
  const [secSearch, setSecSearch] = useState<string>('');

  // ----------------------------------------------------
  // AI Classification Trigger
  // ----------------------------------------------------
  const handleAiClassify = async () => {
    if (!description.trim() || description.length < 10) {
      setErrorMessage('Por favor, escreva uma breve descrição do problema antes de acionar a Inteligência Artificial.');
      return;
    }

    setIsAiLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          locationAddress: `${street}, ${neighborhood}, Madalena - CE`
        })
      });

      const data = await res.json();
      if (data.classification) {
        const { secretariatId: aiSec, category: aiCat, summary, urgency } = data.classification;
        if (aiSec) setSecretariatId(aiSec);
        if (aiCat) setCategory(aiCat);
        setAiSuggestion(`IA +VOZ: Identificado como "${aiSec.toUpperCase()}" (Urgência ${urgency.toUpperCase()}). ${summary}`);
      }
    } catch (err) {
      console.error('Erro na IA:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // ----------------------------------------------------
  // Geolocation Handler
  // ----------------------------------------------------
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Navegador não possui suporte à geolocalização.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMarkerLat(pos.coords.latitude);
        setMarkerLng(pos.coords.longitude);
        setStreet('Minha Localização GPS Atual');
        setReference('Coordenadas capturadas via GPS');
      },
      (err) => {
        alert('Não foi possível obter sua localização exata. Favor informar no mapa ou campo abaixo.');
      }
    );
  };

  // ----------------------------------------------------
  // Media Recorder (Audio)
  // ----------------------------------------------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newAttachment: Attachment = {
          id: `att-audio-${Date.now()}`,
          name: `depoimento_voz_${attachments.length + 1}.webm`,
          type: 'audio',
          url: audioUrl,
          size: '1.2 MB'
        };
        setAttachments(prev => [...prev, newAttachment]);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Acesso ao microfone negado ou indisponível.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // ----------------------------------------------------
  // File Upload Handling
  // ----------------------------------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (attachments.length + files.length > 10) {
      alert('Limite máximo de 10 arquivos excedido.');
      return;
    }

    Array.from(files).forEach((file: File) => {
      const fileUrl = URL.createObjectURL(file);
      let fileType: 'image' | 'video' | 'audio' = 'image';
      if (file.type.startsWith('video/')) fileType = 'video';
      if (file.type.startsWith('audio/')) fileType = 'audio';

      const newAtt: Attachment = {
        id: `att-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: fileType,
        url: fileUrl,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };

      setAttachments(prev => [...prev, newAtt]);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  // ----------------------------------------------------
  // Final Form Submission
  // ----------------------------------------------------
  const handleFinalSubmit = async () => {
    if (!isTruthConfirmed) {
      setErrorMessage('Você deve declarar que as informações prestadas são verdadeiras para continuar.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const fullAddress = `${street ? street + ', ' : ''}${number ? 'Nº ' + number + ', ' : ''}${neighborhood}, Madalena - CE, CEP: ${cep}`;

      const reportPayload = {
        type: reportType,
        secretariatId,
        category,
        customCategory: category === 'outro' ? customCategory : undefined,
        description,
        attachments,
        location: {
          address: fullAddress,
          street,
          number,
          complement,
          neighborhood,
          cep,
          reference,
          lat: markerLat,
          lng: markerLng
        },
        citizenName: reportType === 'identificada' ? citizenName : undefined,
        citizenCpf: reportType === 'identificada' ? citizenCpf : undefined,
        citizenEmail: reportType === 'identificada' ? citizenEmail : undefined,
        citizenPhone: reportType === 'identificada' ? citizenPhone : undefined
      };

      await onSubmitReport(reportPayload);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao registrar denúncia. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // RENDER TYPE CHOICE MODAL (Screen 2 of image)
  // ----------------------------------------------------
  if (!reportType) {
    return (
      <div className="max-w-md mx-auto my-6 px-4">
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200/90 text-center space-y-5">
          
          {/* Header with Back Arrow */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <button
              onClick={onCancel}
              className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-slate-400">Modalidade</span>

            <div className="w-5" />
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
              Como deseja realizar sua denúncia?
            </h2>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
              Sua identidade é protegida. Escolha uma das opções abaixo:
            </p>
          </div>

          <div className="space-y-4 text-left">
            
            {/* Option 1: Denúncia Identificada (Green Theme) */}
            <div className="bg-emerald-50/40 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#0F8A43] flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Denúncia Identificada
                </h3>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-700 font-medium pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-[#0F8A43] font-bold">✓</span>
                  <span>Permite acompanhar a denúncia.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0F8A43] font-bold">✓</span>
                  <span>Receber notificações sobre o andamento.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0F8A43] font-bold">✓</span>
                  <span>Possibilita que a secretaria entre em contato caso precise de mais informações.</span>
                </li>
              </ul>

              <button
                onClick={() => setReportType('identificada')}
                className="w-full py-2.5 rounded-xl bg-[#0F8A43] hover:bg-[#0b6b33] text-white font-bold text-xs shadow-md transition-colors"
              >
                Continuar identificado
              </button>
            </div>

            {/* Option 2: Denúncia Anônima (Orange Theme) */}
            <div className="bg-amber-50/40 rounded-2xl p-4 sm:p-5 border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-[#FF8C00] flex items-center justify-center shrink-0">
                  <ShieldOff className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Denúncia Anônima
                </h3>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-700 font-medium pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF8C00] font-bold">✓</span>
                  <span>Não é necessário informar nome, CPF ou e-mail.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF8C00] font-bold">✓</span>
                  <span>Nenhuma informação pessoal será enviada à secretaria.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF8C00] font-bold">✓</span>
                  <span>Você receberá apenas um código de protocolo para consultar o andamento da denúncia.</span>
                </li>
              </ul>

              <button
                onClick={() => setReportType('anonima')}
                className="w-full py-2.5 rounded-xl bg-[#FF8C00] hover:bg-[#e07b00] text-white font-bold text-xs shadow-md transition-colors"
              >
                Continuar anonimamente
              </button>
            </div>

          </div>

          {/* Privacy Note */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <Compass className="w-3.5 h-3.5 text-[#0F8A43]" />
            <span>Sua identidade e dados são protegidos conforme nossa Política de Privacidade.</span>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // STEPPER HEADER
  // ----------------------------------------------------
  const stepTitles = [
    'Escolha a secretaria',
    'Descreva o problema',
    'Localização',
    'Revise e envie'
  ];

  return (
    <div className="max-w-xl mx-auto my-4 sm:my-8 px-4">
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200/90 space-y-5">
        
        {/* Top Header with Back Arrow and Title */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <button
            onClick={() => {
              if (currentStep > 1) setCurrentStep(currentStep - 1);
              else setReportType(null);
            }}
            className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 text-center">
            Nova denúncia
          </h2>

          <button
            onClick={onCancel}
            className="text-xs font-bold text-slate-400 hover:text-slate-800"
          >
            Sair
          </button>
        </div>

        {/* Circular Step Number Indicators (Matching Screens 3, 4, 5, 6 in image) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 py-1">
          {[1, 2, 3, 4, 5].map((stepNum) => {
            const isCurrent = currentStep === stepNum || (currentStep > 4 && stepNum === 5);
            const isCompleted = currentStep > stepNum;

            return (
              <div key={stepNum} className="flex items-center gap-2">
                <div 
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                    isCurrent
                      ? 'bg-[#0F8A43] text-white shadow-md scale-105 ring-4 ring-emerald-100'
                      : isCompleted
                      ? 'bg-[#0F8A43] text-white opacity-80'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 5 && (
                  <div className={`w-3 sm:w-6 h-0.5 rounded-full ${isCompleted ? 'bg-[#0F8A43]' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        <h3 className="text-sm font-bold text-slate-800 text-center">
          {currentStep === 1 && '1. Escolha a secretaria'}
          {currentStep === 2 && '2. Categoria e Urgência'}
          {currentStep === 3 && '3. Descreva o problema'}
          {currentStep === 4 && '4. Localização'}
          {currentStep >= 5 && '5. Revise e envie'}
        </h3>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* PASSO 1: Escolher Secretaria */}
        {/* ------------------------------------------------------------------- */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-600 font-medium">
                Selecione qual secretaria deve receber e resolver a sua ocorrência:
              </p>
              <input
                type="text"
                value={secSearch}
                onChange={(e) => setSecSearch(e.target.value)}
                placeholder="Buscar secretaria..."
                className="w-full sm:w-64 px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F8A43]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
              {secretariats
                .filter(s => s.name.toLowerCase().includes(secSearch.toLowerCase()) || s.description.toLowerCase().includes(secSearch.toLowerCase()))
                .map((sec) => (
                  <div
                    key={sec.id}
                    onClick={() => setSecretariatId(sec.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      secretariatId === sec.id
                        ? 'border-[#0F8A43] bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 font-bold"
                      style={{ backgroundColor: sec.color }}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{sec.name}</h4>
                      <p className="text-[11px] text-slate-600 leading-tight mt-1 line-clamp-2">{sec.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* PASSO 2: Categoria */}
        {/* ------------------------------------------------------------------- */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 font-medium">
              Selecione o tipo exato de problema para agilizar o direcionamento interno:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left text-xs font-bold transition-all flex flex-col justify-between h-24 ${
                    category === cat.id
                      ? 'border-[#FF8C00] bg-amber-50 text-slate-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  <Tag className={`w-4 h-4 ${category === cat.id ? 'text-[#FF8C00]' : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {category === 'outro' && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Especifique a categoria personalizada:
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Ex: Ponto de ônibus sem cobertura"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#0F8A43]"
                />
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* PASSO 3: Descrição + IA */}
        {/* ------------------------------------------------------------------- */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Descrição do Problema (Máximo 500 caracteres)
              </label>
              <span className={`text-xs font-bold ${description.length > 480 ? 'text-rose-600' : 'text-slate-500'}`}>
                {description.length} / 500
              </span>
            </div>

            <textarea
              rows={5}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que está acontecendo, desde quando e pontos importantes..."
              className="w-full p-4 rounded-2xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F8A43] shadow-inner"
            />

            {/* AI Assistant Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 p-4 rounded-2xl border border-emerald-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF8C00] animate-pulse shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Classificador Inteligente IA +VOZ</span>
                  <span className="text-slate-600">A IA analisa o texto e sugere automaticamente a secretaria e urgência.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAiClassify}
                disabled={isAiLoading || !description.trim()}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Classificar com IA
                  </>
                )}
              </button>
            </div>

            {aiSuggestion && (
              <div className="p-3 bg-emerald-100/80 rounded-xl border border-emerald-300 text-xs font-medium text-emerald-900">
                {aiSuggestion}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* PASSO 4: Anexos (Fotos, Vídeos, Gravador de Áudio) */}
        {/* ------------------------------------------------------------------- */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Anexos e Evidências (Fotos, Vídeos ou Áudio - Máximo 10 arquivos)
              </label>
              <p className="text-xs text-slate-500">
                Anexe fotos do local ou grave um relato de voz para comprovar sua solicitação.
              </p>
            </div>

            {/* Action Bar: File upload + Audio recorder */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Upload Input Box */}
              <label className="border-2 border-dashed border-slate-300 hover:border-[#0F8A43] bg-slate-50 hover:bg-emerald-50/50 p-6 rounded-2xl cursor-pointer flex flex-col items-center text-center transition-all">
                <Upload className="w-8 h-8 text-[#0F8A43] mb-2" />
                <span className="text-xs font-bold text-slate-800">Clique para enviar fotos ou vídeos</span>
                <span className="text-[11px] text-slate-500 mt-1">PNG, JPG, MP4 (máx. 10MB cada)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Web Browser Microphone Recorder */}
              <div className="border border-slate-200 bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
                  <Mic className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 mb-2">Gravador de Voz em Tempo Real</span>

                {isRecording ? (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-md animate-pulse"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    Parar e Salvar Gravacao
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
                  >
                    <Mic className="w-4 h-4 text-rose-400" />
                    Iniciar Gravação de Áudio
                  </button>
                )}
              </div>

            </div>

            {/* Attachments Preview List */}
            {attachments.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700">
                  Arquivos selecionados ({attachments.length} / 10):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {attachments.map((att) => (
                    <div key={att.id} className="relative group bg-slate-100 rounded-xl p-2 border border-slate-200 flex flex-col items-center">
                      {att.type === 'image' && (
                        <img src={att.url} alt={att.name} className="w-full h-24 object-cover rounded-lg mb-1" />
                      )}
                      {att.type === 'video' && (
                        <div className="w-full h-24 bg-slate-800 rounded-lg flex items-center justify-center text-white mb-1">
                          <Video className="w-8 h-8" />
                        </div>
                      )}
                      {att.type === 'audio' && (
                        <div className="w-full h-24 bg-indigo-50 rounded-lg flex flex-col items-center justify-center text-indigo-700 p-2 mb-1">
                          <Music className="w-6 h-6 mb-1" />
                          <audio src={att.url} controls className="w-full h-8 scale-90" />
                        </div>
                      )}

                      <span className="text-[10px] font-medium text-slate-700 truncate w-full text-center">
                        {att.name}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-md opacity-90 hover:opacity-100"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* PASSO 5: Localização */}
        {/* ------------------------------------------------------------------- */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Localização da Ocorrência em Madalena - CE
                </label>
                <p className="text-xs text-slate-500">
                  Defina o endereço completo e ajuste o marcador no mapa.
                </p>
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-[#0F8A43] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Compass className="w-4 h-4" />
                Usar localização atual (GPS)
              </button>
            </div>

            {/* Address Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Rua / Avenida / Logradouro</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Ex: Rua Maria do Carmo"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#0F8A43]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Número</label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Ex: 240 ou S/N"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#0F8A43]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Bairro / Distrito</label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#0F8A43]"
                >
                  {MADALENA_NEIGHBORHOODS.map(n => (
                    <option key={n.name} value={n.name}>{n.name} ({n.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">CEP</label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="63860-000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#0F8A43]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Ponto de Referência</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ex: Em frente ao posto de saúde"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#0F8A43]"
                />
              </div>

            </div>

            {/* Interactive Leaflet Picker Map */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Ajuste o pino no mapa para definir as coordenadas exatas:
              </label>
              <InteractiveMap
                isPickerMode
                selectedLat={markerLat}
                selectedLng={markerLng}
                onLocationSelect={(lat, lng) => {
                  setMarkerLat(lat);
                  setMarkerLng(lng);
                }}
                height="280px"
              />
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* PASSO 6: Revisão e Confirmação */}
        {/* ------------------------------------------------------------------- */}
        {currentStep === 6 && (
          <div className="space-y-6">
            
            {/* Identification fields if "Identificada" */}
            {reportType === 'identificada' && (
              <div className="bg-[#F5F5F5] p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Dados de Identificação do Cidadão
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="Seu Nome Completo *"
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#0F8A43]"
                  />
                  <input
                    type="text"
                    value={citizenCpf}
                    onChange={(e) => setCitizenCpf(e.target.value)}
                    placeholder="CPF (ex: 000.000.000-00) *"
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#0F8A43]"
                  />
                  <input
                    type="email"
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                    placeholder="Seu E-mail para notificações *"
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#0F8A43]"
                  />
                  <input
                    type="tel"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="Telefone / WhatsApp *"
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#0F8A43]"
                  />
                </div>
              </div>
            )}

            {/* Summary Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                Resumo da Denúncia
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                <div><span className="font-bold">Modalidade:</span> {reportType === 'anonima' ? 'Anônima' : 'Identificada'}</div>
                <div><span className="font-bold">Secretaria:</span> {secretariats.find(s => s.id === secretariatId)?.name}</div>
                <div><span className="font-bold">Categoria:</span> {category}</div>
                <div><span className="font-bold">Bairro/Distrito:</span> {neighborhood}</div>
                <div className="sm:col-span-2"><span className="font-bold">Endereço:</span> {street || 'Madalena'}, Nº {number || 'S/N'}</div>
                <div className="sm:col-span-2"><span className="font-bold">Descrição:</span> {description}</div>
                <div><span className="font-bold">Arquivos anexados:</span> {attachments.length} arquivo(s)</div>
              </div>
            </div>

            {/* Mandatory Truth Checkbox */}
            <label className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isTruthConfirmed}
                onChange={(e) => setIsTruthConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#0F8A43] focus:ring-[#0F8A43] rounded"
              />
              <span className="text-xs text-slate-800 font-medium leading-relaxed">
                Declaro que as informações prestadas neste formulário são verdadeiras sob as penas da lei e autorizo o encaminhamento do relato à secretaria municipal competente.
              </span>
            </label>

          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* BOTTOM NAVIGATION ACTIONS */}
        {/* ------------------------------------------------------------------- */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
            >
              Anterior
            </button>
          ) : <div />}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 3 && (!description.trim() || description.length < 5)) {
                  setErrorMessage('A descrição precisa conter pelo menos 5 caracteres.');
                  return;
                }
                setErrorMessage(null);
                setCurrentStep(currentStep + 1);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#0F8A43] hover:bg-[#0b6b33] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
            >
              Avançar
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting || !isTruthConfirmed}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#0F8A43] to-[#45B649] disabled:opacity-50 text-white text-sm font-bold transition-all shadow-xl hover:shadow-2xl flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando Ocorrência...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Confirmar e Enviar Denúncia
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
