import React from 'react';
import { Home, Plus, Search, Menu, Building2, BarChart2, Lock } from 'lucide-react';

interface BottomNavBarProps {
  activeView: string;
  onNavigate: (view: 'home' | 'wizard' | 'lookup' | 'transparency' | 'admin') => void;
  onOpenMenuModal?: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeView,
  onNavigate,
  onOpenMenuModal
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-2xl md:hidden pb-safe">
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2">
        
        {/* Início */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center gap-1 h-full w-full transition-colors ${
            activeView === 'home'
              ? 'text-[#0F8A43] font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 ${activeView === 'home' ? 'text-[#0F8A43] scale-110' : ''}`} />
          <span className="text-[10px]">Início</span>
        </button>

        {/* Nova Denúncia (Center CTA Button) */}
        <button
          onClick={() => onNavigate('wizard')}
          className="flex flex-col items-center justify-center gap-1 h-full w-full text-[#0F8A43] font-bold group"
        >
          <div className="w-10 h-10 rounded-full bg-[#0F8A43] text-white flex items-center justify-center shadow-lg group-active:scale-95 transition-transform -mt-3 border-2 border-white">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] text-[#0F8A43] font-bold -mt-0.5">Nova denúncia</span>
        </button>

        {/* Consultar */}
        <button
          onClick={() => onNavigate('lookup')}
          className={`flex flex-col items-center justify-center gap-1 h-full w-full transition-colors ${
            activeView === 'lookup'
              ? 'text-[#0F8A43] font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Search className={`w-5 h-5 ${activeView === 'lookup' ? 'text-[#0F8A43] scale-110' : ''}`} />
          <span className="text-[10px]">Consultar</span>
        </button>

        {/* Menu / Transparência */}
        <button
          onClick={() => onOpenMenuModal ? onOpenMenuModal() : onNavigate('transparency')}
          className={`flex flex-col items-center justify-center gap-1 h-full w-full transition-colors ${
            activeView === 'transparency' || activeView === 'admin'
              ? 'text-[#0F8A43] font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Menu className={`w-5 h-5 ${activeView === 'transparency' || activeView === 'admin' ? 'text-[#0F8A43] scale-110' : ''}`} />
          <span className="text-[10px]">Menu</span>
        </button>

      </div>
    </nav>
  );
};
