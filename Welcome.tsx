import React from 'react';
import { View, Theme } from '../../types.ts';
import { Logo } from '../../components/Logo.tsx';

interface Props {
  onNavigate: (view: View) => void;
  theme: Theme;
}

const Welcome: React.FC<Props> = ({ onNavigate, theme }) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-8 bg-[#F3F4F6] transition-colors duration-300">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-10 w-full flex justify-center items-center">
          <Logo className="h-24 sm:h-28" />
        </div>
        
        <div className="space-y-4 px-2 max-w-[300px]">
          <p className="text-[#FACC15] text-xl font-black uppercase tracking-tight leading-tight drop-shadow-sm">
            Controle simples do seu lucro diário
          </p>
          <div className="w-14 h-1.5 bg-[#FACC15] mx-auto rounded-full opacity-90 shadow-sm"></div>
        </div>
      </div>
      
      <div className="space-y-4 mb-4">
        <button
          onClick={() => onNavigate(View.LOGIN)}
          className="w-full bg-[#2563EB] text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-blue-500/30 active:scale-[0.97] transition-all uppercase tracking-wider"
        >
          ENTRAR
        </button>
        <button
          onClick={() => onNavigate(View.REGISTER)}
          className="w-full bg-transparent text-[#2563EB] border-4 border-[#2563EB] py-4 rounded-[24px] font-black text-lg active:scale-[0.97] transition-all uppercase tracking-wider"
        >
          CRIAR CONTA
        </button>
      </div>
    </div>
  );
};

export default Welcome;