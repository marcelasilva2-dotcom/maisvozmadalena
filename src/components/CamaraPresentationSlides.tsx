import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Printer, 
  Play, 
  Home, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  MapPin, 
  Sparkles, 
  FileText, 
  Clock, 
  Smartphone, 
  BarChart2, 
  Award, 
  Cpu, 
  AlertTriangle, 
  Info,
  ChevronDown,
  GraduationCap,
  Mic,
  Video,
  Layers,
  HeartHandshake,
  Lightbulb
} from 'lucide-react';
import { VozLogo } from './VozLogo';
import { MadalenaChurchIllustration } from './MadalenaChurchIllustration';

interface CamaraPresentationSlidesProps {
  onGoHome: () => void;
  onStartLiveDemo: () => void;
}

export const CamaraPresentationSlides: React.FC<CamaraPresentationSlidesProps> = ({
  onGoHome,
  onStartLiveDemo
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const [slideMenuOpen, setSlideMenuOpen] = useState(false);

  const totalSlides = 8;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'n' || e.key === 'N') {
        setShowSpeakerNotes((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          if (document.exitFullscreen) document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const slidesData = [
    {
      title: 'Apresentação Oficial',
      badge: 'Câmara Municipal de Madalena / CE',
      speakerNote: 'Cumprimentar o Presidente da Mesa, os nobres Vereadores e a população presente. Explicar que o Mais Voz Madalena é um aplicativo criado para aproximar a população da Prefeitura de Madalena, nascido da reflexão sobre como a ciência, a tecnologia e o conhecimento podem ajudar o nosso município.'
    },
    {
      title: 'Origem no NTPPS & Diagnóstico',
      badge: 'Educação, Ciência e Realidade Local',
      speakerNote: 'Explicar a origem do projeto: A ideia surgiu durante nossas aulas de NTPPS, quando estávamos discutindo sobre como a ciência, a tecnologia e o conhecimento podem ajudar a população. Notamos que muitas pessoas, principalmente da zona rural e distritos, têm dificuldades para comunicar problemas e solicitar serviços públicos.'
    },
    {
      title: 'A Ferramenta Multimídia',
      badge: 'Registros Completos & Encaminhamento',
      speakerNote: 'Destacar as funcionalidades: Os cidadãos podem registrar demandas como problemas de iluminação, lixo, estradas, saúde e outros serviços municipais enviando textos, fotos, vídeos, áudios e a localização exata. A solicitação é encaminhada automaticamente para a secretaria responsável para acompanhamento em tempo real.'
    },
    {
      title: 'Secretarias & SAAE Integrados',
      badge: 'Eficiência Administrativa & SLAs',
      speakerNote: 'Apresentar os titulares e canais das secretarias municipais e do SAAE integrados ao sistema, com prazos públicos de resposta e triagem inteligente para cada demanda.'
    },
    {
      title: 'Etapas de Desenvolvimento',
      badge: 'Metodologia e Próximos Passos',
      speakerNote: 'Explicar a trajetória: O projeto foi desenvolvido em etapas — começando pelo levantamento das necessidades da população, seguido pelo planejamento, criação do aplicativo, e os próximos passos serão os testes práticos e a implementação oficial no município.'
    },
    {
      title: 'Objetivos & Impacto Esperado',
      badge: 'Participação, Agilidade e Transparência',
      speakerNote: 'Enfatizar os ganhos para Madalena: Com essa ferramenta, esperamos aumentar a participação da população nas decisões do município, melhorar a comunicação entre cidadãos e gestão pública, tornar os serviços mais eficientes e fortalecer a transparência.'
    },
    {
      title: 'Inclusão Digital & Cidadania',
      badge: 'Inovação Social e Qualidade de Vida',
      speakerNote: 'Ressaltar o valor social: Além disso, o projeto incentiva a inclusão digital, a inovação social e o exercício da cidadania, utilizando a tecnologia para melhorar a qualidade de vida da população de Madalena.'
    },
    {
      title: 'Conclusão & Demonstração',
      badge: 'O App do Cidadão Madalenense',
      speakerNote: 'Finalizar com entusiasmo convidando todos os vereadores e munícipes: "Vamos conhecer o nosso aplicativo, o app do cidadão madalenense!" e iniciar a navegação interativa na plataforma.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* Top Slide Control Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onGoHome}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Voltar ao Portal Principal"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Voltar ao Portal</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <VozLogo size="sm" variant="emblem" className="w-7 h-7" />
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Câmara Municipal</span>
              <span className="text-xs text-slate-400 ml-1.5">• Sessão Legislativa 2026</span>
            </div>
          </div>
        </div>

        {/* Slide Selector & Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Slide dropdown selector */}
          <div className="relative">
            <button
              onClick={() => setSlideMenuOpen(!slideMenuOpen)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <span>Slide {currentSlide + 1} de {totalSlides}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {slideMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Navegar pelos Slides
                </div>
                {slidesData.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentSlide(idx);
                      setSlideMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      currentSlide === idx ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span className="truncate">{idx + 1}. {s.title}</span>
                    {currentSlide === idx && <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">Atual</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Toggle Speaker Notes */}
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              showSpeakerNotes 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Exibir/Ocultar Roteiro de Fala do Apresentador (Atalho: N)"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Roteiro de Fala</span>
          </button>

          {/* Print / PDF button */}
          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Imprimir ou Salvar em PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Alternar Tela Cheia (Atalho: F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Slide Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        
        {/* Ambient Decorative Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Slide Card Container (16:9 Aspect Ratio Frame) */}
        <div className="w-full max-w-6xl aspect-[16/9] max-h-[80vh] min-h-[500px] bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
          
          {/* Subtle Grid Texture */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* =======================================================
              SLIDE 1: CAPA OFICIAL DA APRESENTAÇÃO
             ======================================================= */}
          {currentSlide === 0 && (
            <div className="flex-1 flex flex-col justify-between animate-fadeIn">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide uppercase">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Câmara Municipal de Madalena – Estado do Ceará</span>
                </div>
                <div className="text-xs text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Projeto Cidadão • Aulas de NTPPS</span>
                </div>
              </div>

              {/* Center Content: Title & Visual Illustration */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <VozLogo size="lg" variant="emblem" className="w-16 h-16 shadow-xl" />
                    <div>
                      <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                        +VOZ <span className="text-emerald-400">Madalena</span>
                      </h1>
                      <p className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">
                        O Aplicativo do Cidadão Madalenense
                      </p>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed pt-2">
                    Aproximando a população da Prefeitura de Madalena através da ciência, da tecnologia e do exercício pleno da cidadania.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                      Iniciativa NTPPS
                    </span>
                    <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      Inclusão Zona Rural & Sede
                    </span>
                    <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Inovação Social & Transparência
                    </span>
                  </div>
                </div>

                {/* Right Artwork Box */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative w-full max-w-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800 shadow-2xl text-center">
                    <div className="w-full aspect-square rounded-xl overflow-hidden shadow-inner">
                      <MadalenaChurchIllustration className="w-full h-full object-cover" />
                    </div>
                    <div className="mt-2 text-[11px] text-slate-400 font-medium">
                      Igreja Matriz & Identidade +VOZ Madalena
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>Desenvolvido para transformar a comunicação municipal</span>
                <span>Poder Executivo & Poder Legislativo Integrados</span>
              </div>
            </div>
          )}

          {/* =======================================================
              SLIDE 2: ORIGEM NO NTPPS & O DESAFIO SOCIAL
             ======================================================= */}
          {currentSlide === 1 && (
            <div className="flex-1 flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase mb-3">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Origem da Ideia • Aulas de NTPPS</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">
                  Ciência, Tecnologia e Conhecimento a Serviço do Povo
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Como os debates em sala de aula se transformaram em uma solução prática para os desafios reais do município:
                </p>
              </div>

              {/* 3 Main Pillars of Genesis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
                <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-blue-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Reflexão no NTPPS</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Durante nossas aulas de <strong>NTPPS</strong>, estávamos discutindo sobre como a ciência, a tecnologia e o conhecimento podem ajudar a população.
                  </p>
                </div>

                <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-amber-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Desafio da Zona Rural</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Percebemos que muitas pessoas, principalmente da <strong>zona rural</strong> e distritos afastados, têm dificuldades para comunicar problemas e solicitar serviços públicos.
                  </p>
                </div>

                <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Aproximação com a Gestão</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Criamos o <strong>Mais Voz Madalena</strong> para aproximar a população da Prefeitura de Madalena, garantindo um canal direto e sem burocracias.
                  </p>
                </div>
              </div>

              {/* Bottom Quote Banner */}
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-blue-200 text-xs flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
                <span>
                  <strong>Missão Central:</strong> Transformar a ideia nascida na escola em um instrumento democrático de utilidade pública para toda Madalena.
                </span>
              </div>
            </div>
          )}

          {/* =======================================================
              SLIDE 3: A FERRAMENTA MULTIMÍDIA (+VOZ MADALENA)
             ======================================================= */}
          {currentSlide === 2 && (
            <div className="flex-1 flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Funcionalidades Multimídia</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">
                  Registro Completo & Encaminhamento Automático
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Demandas de iluminação, lixo, estradas, saúde e outros serviços municipais:
                </p>
              </div>

              {/* 4 Feature Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-auto">
                <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="p-2.5 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <Mic className="w-4 h-4" />
                    <Video className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Textos, Fotos, Vídeos & Áudios</h3>
                  <p className="text-xs text-slate-400">
                    O cidadão escolhe a melhor forma de se comunicar: digitando, gravando áudio de voz ou enviando fotos e vídeos.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-amber-500/40 transition-colors">
                  <div className="p-2.5 w-fit rounded-xl bg-amber-500/10 text-amber-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Localização Exata do Problema</h3>
                  <p className="text-xs text-slate-400">
                    Envio das coordenadas de GPS ou ponto no mapa para que as equipes cheguem com precisão no local da ocorrência.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-blue-500/40 transition-colors">
                  <div className="p-2.5 w-fit rounded-xl bg-blue-500/10 text-blue-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Encaminhamento Automático</h3>
                  <p className="text-xs text-slate-400">
                    Após o envio, a solicitação é encaminhada automaticamente para a secretaria responsável pela execução.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-purple-500/40 transition-colors">
                  <div className="p-2.5 w-fit rounded-xl bg-purple-500/10 text-purple-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Acompanhamento do Andamento</h3>
                  <p className="text-xs text-slate-400">
                    Permite que o cidadão acompanhe cada etapa da sua demanda pelo protocolo oficial 24h por dia.
                  </p>
                </div>
              </div>

              {/* Status Pipeline Step Indicator */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-400 uppercase text-[11px]">Fluxo de Atendimento:</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium">1. Envio Cidadão</span>
                <span className="text-slate-600">→</span>
                <span className="px-2.5 py-1 rounded-md bg-amber-950/50 text-amber-300 font-medium border border-amber-800/40">2. Triagem Inteligente</span>
                <span className="text-slate-600">→</span>
                <span className="px-2.5 py-1 rounded-md bg-blue-950/50 text-blue-300 font-medium border border-blue-800/40">3. Secretaria Responsável</span>
                <span className="text-slate-600">→</span>
                <span className="px-2.5 py-1 rounded-md bg-indigo-950/50 text-indigo-300 font-medium border border-indigo-800/40">4. Execução em Campo</span>
                <span className="text-slate-600">→</span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/50 text-emerald-300 font-bold border border-emerald-700/50">5. Resolvida com Fotos ✓</span>
              </div>
            </div>
          )}

          {/* =======================================================
              SLIDE 4: INTEGRAÇÃO COM AS SECRETARIAS MUNICIPAIS & SAAE
             ======================================================= */}
          {currentSlide === 3 && (
            <div className="flex-1 flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase mb-3">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Estrutura Governamental Integrada</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">
                  Estrutura das Secretarias & SAAE Integrados
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Atendimento oficial com responsáveis diretos, canais dedicados e controle de SLA:
                </p>
              </div>

              {/* Secretariat Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto text-xs">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-blue-400">Secretaria de Educação</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 font-medium">Juliana Maria Fernandes Pinheiro</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">(88) 99944-1326</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">SLA: 4 dias úteis</div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-purple-400">Assistência Social</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 font-medium">Valdemiro Júnior</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">(85) 99807-0763</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">SLA: 3 dias úteis</div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-emerald-400">Secretaria de Governo</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 font-medium">Benocélio da Silva Carneiro</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">(88) 99629-1075</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">SLA: 4 dias úteis</div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-amber-400">Secretaria de Obras</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 font-medium">Cristiano Barros Uchôa</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">(88) 99279-3878</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">SLA: 5 dias úteis</div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-green-400">Secretaria de Agricultura</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 font-medium">Antônio Ribeiro Barros</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">(88) 99466-1088</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">SLA: 5 dias úteis</div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-violet-400">Cultura, Esporte, Tur. e Juv.</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 font-medium">Adauto Maciel Barros</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">(88) 99239-1816</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">SLA: 5 dias úteis</div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-rose-400">Secretaria de Saúde</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 font-medium">Crislene Barros Uchôa</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">(88) 99902-6816</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">SLA: 3 dias úteis</div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-cyan-400">SAAE (Água e Esgoto)</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 font-medium">Fcº Evaldo Alves Dias</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">(88) 99685-8594</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">SLA: 2 dias úteis</div>
                </div>
              </div>

              {/* Key SLA Rule Note */}
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-blue-200 text-xs flex items-center justify-between">
                <span>⏱️ <strong>SLA Automatizado:</strong> Se a secretaria não responder no prazo limite, o sistema aciona alerta para a Controladoria e Ouvidoria Geral.</span>
              </div>
            </div>
          )}

          {/* =======================================================
              SLIDE 5: METODOLOGIA DE DESENVOLVIMENTO EM ETAPAS
             ======================================================= */}
          {currentSlide === 4 && (
            <div className="flex-1 flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase mb-3">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Trajetória do Projeto</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">
                  O Projeto Desenvolvido em Etapas
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Do levantamento das necessidades até os próximos passos de implantação:
                </p>
              </div>

              {/* 4 Pipeline Stages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-auto">
                <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3 relative">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-white">Levantamento das Necessidades</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Começando pela escuta ativa da população da sede e da zona rural para mapear as maiores dificuldades de comunicação.
                  </p>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase">✓ Concluído</span>
                </div>

                <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3 relative">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-white">Planejamento do Sistema</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Estruturação dos fluxos de atendimento, definição de categorias, órgãos municipais e prazos de resposta (SLA).
                  </p>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase">✓ Concluído</span>
                </div>

                <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3 relative">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h3 className="text-sm font-bold text-white">Criação do Aplicativo</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Construção da interface acessível, Inteligência Artificial de triagem, suporte multimídia e sistema de protocolos.
                  </p>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase">✓ Concluído</span>
                </div>

                <div className="bg-slate-950/70 p-5 rounded-2xl border border-amber-500/40 space-y-3 relative bg-amber-950/10">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <h3 className="text-sm font-bold text-amber-300">Testes & Implementação</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Os próximos passos serão os testes práticos com a comunidade e a implementação oficial em toda Madalena.
                  </p>
                  <span className="text-[10px] text-amber-400 font-semibold uppercase">⏳ Próximos Passos</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-200 text-xs flex items-center gap-2">
                <span>🚀 <strong>Rigor Metodológico:</strong> Cada etapa foi desenhada para garantir que a ferramenta seja prática, acessível e segura.</span>
              </div>
            </div>
          )}

          {/* =======================================================
              SLIDE 6: OBJETIVOS E IMPACTO ESPERADO
             ======================================================= */}
          {currentSlide === 5 && (
            <div className="flex-1 flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase mb-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Resultados Esperados</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">
                  O que Esperamos com essa Ferramenta
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Transformações concretas para a gestão pública e para a vida da população:
                </p>
              </div>

              {/* 4 Impact Goals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
                <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex items-start gap-4 hover:border-emerald-500/30 transition-colors">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Aumentar a Participação da População</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Incentivar a participação direta da população nas decisões e prioridades do município de Madalena.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex items-start gap-4 hover:border-blue-500/30 transition-colors">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Melhorar a Comunicação</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Criar uma comunicação contínua, clara e sem intermediários entre os cidadãos e a gestão pública.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex items-start gap-4 hover:border-amber-500/30 transition-colors">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Tornar os Serviços Mais Eficientes</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Direcionar os recursos públicos com agilidade para onde a comunidade mais precisa, reduzindo tempo de espera.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex items-start gap-4 hover:border-purple-500/30 transition-colors">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                    <BarChart2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Fortalecer a Transparência</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Garantir protocolos públicos rastreáveis e dados abertos para o controle social e fiscalização pela Câmara.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Quote */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>📊 <strong>Gestão Participativa:</strong> Decisões tomadas com base nas reais prioridades relatadas pela comunidade.</span>
              </div>
            </div>
          )}

          {/* =======================================================
              SLIDE 7: INCLUSÃO DIGITAL, INOVAÇÃO SOCIAL & CIDADANIA
             ======================================================= */}
          {currentSlide === 6 && (
            <div className="flex-1 flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase mb-3">
                  <Award className="w-3.5 h-3.5" />
                  <span>Valores e Cidadania</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">
                  Inclusão Digital, Inovação Social & Cidadania
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Utilizando a tecnologia para melhorar a qualidade de vida da população de Madalena:
                </p>
              </div>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
                <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-colors">
                  <div className="p-2.5 w-fit rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Inclusão Digital</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Garantir que todos, inclusive moradores de áreas rurais e idosos, consigam usar a ferramenta com facilidade e suporte a mensagens em áudio.
                  </p>
                </div>

                <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-blue-500/40 transition-colors">
                  <div className="p-2.5 w-fit rounded-xl bg-blue-500/10 text-blue-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Inovação Social</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Aplicação da tecnologia e do conhecimento com foco 100% humanizado, gerando soluções práticas para o bem-estar coletivo.
                  </p>
                </div>

                <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-amber-500/40 transition-colors">
                  <div className="p-2.5 w-fit rounded-xl bg-amber-500/10 text-amber-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Exercício da Cidadania</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Empoderar o munícipe a cuidar da cidade, fiscalizar serviços públicos e participar ativamente das melhorias do município.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 text-xs flex items-center gap-2">
                <span>🌱 <strong>Qualidade de Vida:</strong> Uma cidade mais iluminada, cuidada e com serviços que funcionam para todos.</span>
              </div>
            </div>
          )}

          {/* =======================================================
              SLIDE 8: CONCLUSÃO & CONVITE À DEMONSTRAÇÃO
             ======================================================= */}
          {currentSlide === 7 && (
            <div className="flex-1 flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Demonstração Oficial</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">
                  Vamos Conhecer o Nosso Aplicativo!
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  O app do cidadão madalenense está pronto para ser demonstrado aos Nobres Vereadores:
                </p>
              </div>

              {/* Action Plan Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-auto">
                <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 font-bold mx-auto flex items-center justify-center">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-white">Registro Multimídia</h3>
                  <p className="text-xs text-slate-400">
                    Demonstração do envio com texto, áudio, fotos, vídeos e localização GPS exata.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 font-bold mx-auto flex items-center justify-center">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-white">Painel das Secretarias & SAAE</h3>
                  <p className="text-xs text-slate-400">
                    Visualização do recebimento automático e despacho com acompanhamento de prazos.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 font-bold mx-auto flex items-center justify-center">
                    3
                  </div>
                  <h3 className="text-sm font-bold text-white">Consulta por Protocolo</h3>
                  <p className="text-xs text-slate-400">
                    Rastreamento transparente de cada solicitação pelo cidadão e parlamentares.
                  </p>
                </div>
              </div>

              {/* Interactive Call to Action Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div>
                  <h4 className="text-base font-bold text-white">Vamos conhecer o nosso aplicativo, o app do cidadão madalenense!</h4>
                  <p className="text-xs text-emerald-300/90 mt-0.5">
                    Apresentação interativa na tribuna da Câmara Municipal de Madalena.
                  </p>
                </div>
                <button
                  onClick={onStartLiveDemo}
                  className="px-6 py-3.5 rounded-xl bg-[#0F8A43] hover:bg-[#0c7036] text-white text-xs font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-all shrink-0 border border-emerald-400/30"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Explorar o Aplicativo Agora</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Speaker Notes Box (Collapsible Drawer for the Presenter) */}
        {showSpeakerNotes && (
          <div className="w-full max-w-6xl mt-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 text-amber-100 text-xs backdrop-blur-md animate-fadeIn">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Info className="w-3.5 h-3.5" />
                Roteiro de Fala para a Tribuna (Slide {currentSlide + 1}: {slidesData[currentSlide].title})
              </span>
              <button 
                onClick={() => setShowSpeakerNotes(false)}
                className="text-amber-400 hover:text-white text-[11px]"
              >
                Fechar Notas
              </button>
            </div>
            <p className="leading-relaxed text-amber-200/90 font-medium">
              {slidesData[currentSlide].speakerNote}
            </p>
          </div>
        )}

      </main>

      {/* Slide Navigation Bottom Bar */}
      <footer className="bg-slate-900/95 border-t border-slate-800 px-6 py-3 flex items-center justify-between z-30">
        
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            currentSlide === 0 
              ? 'opacity-30 cursor-not-allowed bg-slate-800 text-slate-500' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 shadow-md'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        {/* Dot Indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === idx 
                  ? 'w-8 bg-emerald-500 shadow-sm' 
                  : 'w-2.5 bg-slate-700 hover:bg-slate-600'
              }`}
              title={`Ir para slide ${idx + 1}: ${slidesData[idx].title}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            currentSlide === totalSlides - 1
              ? 'opacity-30 cursor-not-allowed bg-slate-800 text-slate-500' 
              : 'bg-[#0F8A43] hover:bg-[#0c7036] text-white shadow-md'
          }`}
        >
          <span>Próximo</span>
          <ChevronRight className="w-4 h-4" />
        </button>

      </footer>

    </div>
  );
};
