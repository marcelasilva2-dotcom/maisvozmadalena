import React from 'react';
import churchImage from '../assets/images/madalena_voz_unificado_1787245131978.jpg';

interface MadalenaChurchIllustrationProps {
  className?: string;
}

export const MadalenaChurchIllustration: React.FC<MadalenaChurchIllustrationProps> = ({
  className = 'w-full h-full'
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl flex items-center justify-center ${className}`}>
      <img
        src={churchImage}
        alt="+VOZ Madalena - Igreja Matriz de Nossa Senhora da Conceição e Praça"
        className="w-full h-full object-cover rounded-2xl select-none transition-transform duration-500 hover:scale-[1.02]"
        referrerPolicy="no-referrer"
        loading="eager"
      />
    </div>
  );
};

