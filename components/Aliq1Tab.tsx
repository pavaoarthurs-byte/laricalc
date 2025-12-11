import React, { useState } from 'react';
import { InputCurrency } from './InputCurrency';

interface Aliq1TabProps {
  rbt12: number;
  setRbt12: (val: number) => void;
  aliq1Decimal: number;
}

export const Aliq1Tab: React.FC<Aliq1TabProps> = ({ rbt12, setRbt12, aliq1Decimal }) => {
  const [touched, setTouched] = useState(false);
  const aliq1Exibicao = aliq1Decimal * 100;
  const hasError = touched && rbt12 <= 0;

  const handleRbtChange = (val: number) => {
    setTouched(true);
    setRbt12(val);
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
          <div className="flex flex-col items-center justify-center py-2 bg-white rounded-2xl mx-4 shadow-inner border border-yellow-100 cursor-help transition-colors hover:bg-yellow-50/50">
            <span className="font-cute text-3xl sm:text-4xl text-yellow-500 drop-shadow-sm break-all px-2">
              {aliq1Exibicao}%
            </span>
          </div>

          {/* Tooltip Popup */}
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