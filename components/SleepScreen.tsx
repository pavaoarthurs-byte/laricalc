import React, { useState } from 'react';

interface SleepScreenProps {
  onWakeUp: () => void;
}

export const SleepScreen: React.FC<SleepScreenProps> = ({ onWakeUp }) => {
  const [isWaking, setIsWaking] = useState(false);

  const handleWakeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsWaking(true);
    
    // Sincronia com o tempo total da animação refinada (1.5s)
    setTimeout(() => {
      onWakeUp();
    }, 1500); 
  };

  return (
    <div 
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden cursor-default"
      onClick={(e) => e.stopPropagation()} 
    >
      <style>{`
        /* --- Animações Decorativas (Nuvem, Zzz) --- */
        @keyframes zFloat {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(20px, -60px) scale(1.5); opacity: 0; }
        }
        .zzz-anim { animation: zFloat 3s ease-in infinite; }
        .zzz-delay-1 { animation-delay: 0s; }
        .zzz-delay-2 { animation-delay: 1s; }
        .zzz-delay-3 { animation-delay: 2s; }
        
        @keyframes breathing {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-breathe { animation: breathing 4s ease-in-out infinite; }

        @keyframes buttonGlow {
          0% { box-shadow: 0 0 0 0 rgba(253, 224, 71, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(253, 224, 71, 0); }
          100% { box-shadow: 0 0 0 0 rgba(253, 224, 71, 0); }
        }
        .animate-pulse-glow { animation: buttonGlow 2s infinite; }

        /* --- EFEITO CRT TURN ON (Refinado) --- */

        /* 1. O Flash Branco (Linha -> Tela Cheia -> Fade Out) */
        @keyframes crtLineExpand {
          0% { 
            transform: scaleX(0) scaleY(0.002); 
            opacity: 0.8; 
          }
          20% { 
            transform: scaleX(1) scaleY(0.002); 
            opacity: 1; 
            box-shadow: 0 0 30px 10px rgba(255, 255, 255, 0.8); /* Glow na linha */
          }
          50% { 
            transform: scaleX(1) scaleY(0.002); /* Pausa dramática na horizontal */
            opacity: 1;
          }
          100% { 
            transform: scaleX(1) scaleY(1); /* Expansão vertical completa */
            opacity: 0; /* Fade out suave revelando o app */
          }
        }

        /* 2. Abertura das Persianas Pretas (Shutter) */
        @keyframes shutterOpen {
          0% { height: 50%; }
          60% { height: 50%; } /* Mantém fechado enquanto a linha brilha */
          100% { height: 0%; } /* Abre rapidamente ao final */
        }

        /* 3. Blur Gradual na Tela (De fora de foco para nítido) */
        @keyframes blurFadeOut {
          0% { backdrop-filter: blur(20px) brightness(0.5); }
          50% { backdrop-filter: blur(10px) brightness(1.2); } /* Pico de brilho */
          100% { backdrop-filter: blur(0px) brightness(1); }
        }

        .crt-flash-active {
          animation: crtLineExpand 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .shutter-active {
          animation: shutterOpen 1.2s cubic-bezier(0.8, 0, 0.2, 1) forwards;
        }

        .blur-layer-active {
          animation: blurFadeOut 1.5s ease-out forwards;
        }

        /* Fade out rápido do conteúdo da soneca ao clicar */
        .content-fade-out {
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 0.3s ease-out, transform 0.3s ease-in;
        }
      `}</style>

      {/* 
         --- CAMADAS DO EFEITO ---
         Ordem de empilhamento (Z-Index):
         1. Blur Layer (Sobre o App, atrás do preto) - Cria a transição de foco
         2. Shutter Black Divs (A tela preta física) - Esconde o app
         3. Flash White Div (O feixe de luz) - O brilho do tubo
         4. Content (Botão, Nuvem) - Fica no topo até clicar
      */}

      {/* Camada de Blur que fica sobre o APP (atrás do preto) */}
      <div className={`fixed inset-0 z-[900] pointer-events-none ${isWaking ? 'blur-layer-active' : 'hidden'}`}></div>

      {/* Persianas Pretas (Fundo da tela de descanso) */}
      {/* Topo */}
      <div className={`fixed top-0 left-0 w-full h-1/2 bg-slate-900 z-[910] ${isWaking ? 'shutter-active' : ''}`}></div>
      {/* Base */}
      <div className={`fixed bottom-0 left-0 w-full h-1/2 bg-slate-900 z-[910] ${isWaking ? 'shutter-active' : ''}`}></div>

      {/* O Flash Branco (Linha de sinal) */}
      <div className={`fixed inset-0 z-[920] flex items-center justify-center pointer-events-none`}>
        <div className={`w-full h-full bg-white origin-center opacity-0 ${isWaking ? 'crt-flash-active' : ''}`}></div>
      </div>

      {/* --- CONTEÚDO VISUAL (Nuvem, Texto, Botão) --- */}
      <div className={`
        relative z-[950] flex flex-col items-center justify-center w-full h-full
        ${isWaking ? 'content-fade-out pointer-events-none' : ''}
      `}>
        
        {/* Lua/Fundo Decorativo */}
        <div className="absolute top-10 right-10 opacity-20 animate-pulse pointer-events-none text-white">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
          </svg>
        </div>

        {/* Personagem Dormindo (Nuvem) */}
        <div className="relative animate-breathe mb-12">
          {/* Zzz Container */}
          <div className="absolute -top-12 right-0 flex flex-col items-end pointer-events-none">
            <span className="text-2xl font-cute font-bold text-blue-200 zzz-anim zzz-delay-1 absolute right-8 top-8">Z</span>
            <span className="text-3xl font-cute font-bold text-blue-300 zzz-anim zzz-delay-2 absolute right-4 top-0">Z</span>
            <span className="text-4xl font-cute font-bold text-white zzz-anim zzz-delay-3 absolute right-0 -top-8">Z</span>
          </div>

          {/* Cloud SVG Body */}
          <svg width="180" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-blue-100 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
             <path d="M18.5 12c.03.16.04.33.04.5 0 1.93-1.57 3.5-3.5 3.5H5.5C3.29 16 1.5 14.21 1.5 12c0-1.85 1.28-3.41 2.96-3.85.37-2.87 2.75-5.15 5.54-5.15 2.79 0 5.17 2.28 5.54 5.15H15.5c1.68.44 2.96 2 2.96 3.85z" />
          </svg>
          
          {/* Face (Olhos Fechados) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center gap-6 mt-2">
              {/* Olho Esquerdo */}
              <div className="w-6 h-3 border-b-4 border-slate-600 rounded-full opacity-60"></div>
              {/* Olho Direito */}
              <div className="w-6 h-3 border-b-4 border-slate-600 rounded-full opacity-60"></div>
          </div>
          {/* Boca "o" pequena */}
          <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 mt-3">
               <div className="w-2 h-2 bg-pink-300 rounded-full animate-ping opacity-50"></div>
          </div>
        </div>

        <h2 className="font-cute text-4xl text-blue-200 mb-2 tracking-wider">Shhh...</h2>
        <p className="font-cute text-blue-100 mb-10 text-2xl tracking-wide flex items-center gap-3 drop-shadow-md">
           O sistema está à mimir. <span className="text-3xl animate-pulse">😴</span>
        </p>

        <button
          onClick={handleWakeClick}
          className="
            group relative px-10 py-5 
            bg-yellow-400 hover:bg-yellow-300 
            text-yellow-900 rounded-full 
            font-cute text-2xl font-bold 
            animate-pulse-glow
            transition-all duration-300 transform hover:scale-105 active:scale-95 
            flex items-center gap-4
            cursor-pointer
            text-white shadow-lg
          "
        >
          <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">☀️</span>
          Acordar e Calcular!
        </button>
      </div>
    </div>
  );
};