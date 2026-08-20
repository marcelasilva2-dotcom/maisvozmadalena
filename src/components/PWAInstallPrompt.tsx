import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check, Share2, PlusSquare } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);

  useEffect(() => {
    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if already in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

    if (isStandalone) {
      return; // Already installed
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a short delay if user hasn't dismissed it before
      const isDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!isDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show iOS guide prompt if iOS and not standalone
    if (isIosDevice && !localStorage.getItem('pwa_prompt_dismissed')) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Floating Bottom PWA Install Banner */}
      <div className="fixed bottom-18 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#0F8A43] text-white flex items-center justify-center shrink-0 font-extrabold shadow-md">
              <Smartphone className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                Instalar App +VOZ Madalena
              </h4>
              <p className="text-[11px] text-slate-300 leading-tight">
                Acesso rápido no seu celular, funciona sem internet e envia notificações!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 rounded-xl bg-[#0F8A43] hover:bg-[#0b6b33] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Instalar
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-slate-800">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-[#0F8A43] flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Instalar no iPhone / iPad
              </h3>
              <button onClick={() => setShowIOSGuide(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="text-xs space-y-3 text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0F8A43] font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                <span>Toque no botão de <strong>Compartilhar</strong> <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> no menu inferior do Safari.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0F8A43] font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                <span>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-800" />.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0F8A43] font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
                <span>Toque em <strong>Adicionar</strong> no canto superior direito para concluir.</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-[#0F8A43] text-white text-xs font-bold shadow-md"
            >
              Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
