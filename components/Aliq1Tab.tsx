import React, { useState } from 'react';
import { InputCurrency } from './InputCurrency';

interface Aliq1TabProps {
  rbt12: number;
  setRbt12: (val: number) => void;
  aliq1Decimal: number;
}

export const Aliq1Tab: React.FC<Aliq1TabProps> = ({ rbt12, setRbt12, aliq1Decimal }) => {
  const [touched, setTouched] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const aliq1Exibicao = aliq1Decimal * 100;
  const hasError = touched && rbt12 <= 0;

  const handleRbtChange = (val: number) => {
    setTouched(true);
    setRbt12(val);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aliq1Exibicao.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 animate-fade-in relative z-10">
      
      {/* Input Section */}
      <div className={`p-4 rounded-3xl border-2 border-dashed transition-colors duration-300 ${hasError ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
        <h2 className="font-cute text-base text-blue-400 mb-2 flex items-center gap-2">
          <span className="bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm text-xs">1</span>
          Informe os Dados
        </h2>
        
        <div>
          <InputCurrency 
            label="Receita Bruta (12 meses)"
            value={rbt12}
            onChange={handleRbtChange}
            error={hasError}
          />
          
          {hasError && (
            <div className="mt-2 text-red-500 font-cute text-xs bg-red-100/50 border-2 border-red-200 border-dashed rounded-xl p-2 shadow-sm flex items-center gap-2 animate-bounce">
              <span className="text-lg">😿</span>
              <span>Ops! Precisamos de um valor válido.</span>
            </div>
          )}
        </div>
      </div>

      {/* Result Section */}
      <div className="bg-yellow-50 rounded-3xl border-2 border-yellow-200 border-dashed p-4 text-center relative mt-4 shadow-sm transform transition-transform hover:scale-[1.01]">
        {/* "Tape" decoration */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-yellow-200/50 rotate-1"></div>
           
        <h2 className="font-cute text-yellow-600 uppercase tracking-widest text-xs mb-1">Resultado Encontrado</h2>
        <p className="font-bold text-gray-400 text-xs mb-3">
          Alíquota Efetiva (ICMS)
        </p>
        
        {/* Value Box with Tooltip Wrapper */}
        <div className="group relative">
          <div className="flex items-center justify-center py-2 bg-white rounded-2xl mx-4 shadow-inner border border-yellow-100 transition-colors hover:bg-yellow-50/50 relative">
            <span className="font-cute text-3xl sm:text-4xl text-yellow-500 drop-shadow-sm break-all px-2 cursor-help">
              {aliq1Exibicao}%
            </span>
            
            {/* Copy Button inside box */}
            <button 
              onClick={(e) => { e.stopPropagation(); handleCopy(); }}
              className="absolute right-2 p-2 rounded-full hover:bg-yellow-100 transition-colors text-yellow-400"
              title="Copiar valor"
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 animate-bounce">
                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 opacity-50 hover:opacity-100">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" display="none" /> 
                  {/* Clipboard Icon */}
                   <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 017.5 0h.375C18.66 1.5 19.5 2.34 19.5 3.375v17.25c0 1.035-.84 1.875-1.875 1.875H7.5A1.875 1.875 0 015.625 20.625V3.375zm1.5-.375c0-.621.504-1.125 1.125-1.125h.375a2.25 2.25 0 014.5 0h.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-6c-.621 0-1.125-.504-1.125-1.125v-1.5z" />
                </svg>
              )}
            </button>
          </div>

          {/* Tooltip Popup (Centered on container) */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white border-2 border-yellow-200 text-yellow-700 text-xs rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-20 text-center shadow-lg font-cute">
             <span className="block mb-1 font-bold">✨ Precisão Total!</span>
             Este é o valor exato calculado. Ele será arredondado automaticamente na próxima aba (PGDAS) para o cálculo final.
             {/* Arrow */}
             <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-yellow-200"></div>
          </div>
        </div>
        
        <div className="mt-3 inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-yellow-200 shadow-sm">
           <span className="text-[10px] text-yellow-400 font-bold">★ Base de Cálculo Imutável ★</span>
        </div>
      </div>
    </div>
  );
};